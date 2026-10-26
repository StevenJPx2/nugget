import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { createElementPicker } from "../../src/runtime/devtools/element-picker";

class FakeElement {
  textContent = "";
  attached = false;
  constructor(public tagName = "DIV") {}
  remove() { this.attached = false; }
}

let host: EventTarget;
let styles: FakeElement[];
beforeEach(() => {
  host = new EventTarget();
  styles = [];
  vi.stubGlobal("window", host);
  vi.stubGlobal("Element", FakeElement);
  vi.stubGlobal("document", {
    createElement: (tag: string) => {
      const element = new FakeElement(tag.toUpperCase());
      styles.push(element);
      return element;
    },
    documentElement: { append: (element: FakeElement) => { element.attached = true; } },
  });
});
afterEach(() => vi.unstubAllGlobals());

function dispatch(type: string, path: FakeElement[], key?: string) {
  const event = new Event(type, { cancelable: true });
  Object.defineProperty(event, "composedPath", { value: () => path });
  if (key) Object.defineProperty(event, "key", { value: key });
  host.dispatchEvent(event);
  return event;
}

test("picks once without activating the page, then cleans up listeners and cursor", () => {
  const picked = vi.fn();
  const changed = vi.fn();
  const highlight = vi.fn();
  const picker = createElementPicker({ picked, changed, highlight });
  const link = new FakeElement("A");
  picker.setActive(true);
  picker.setActive(true);
  expect(styles[0].attached).toBe(true);
  dispatch("pointermove", [link]);
  expect(highlight).toHaveBeenLastCalledWith(link);
  expect(dispatch("pointerdown", [link]).defaultPrevented).toBe(true);
  expect(dispatch("click", [link]).defaultPrevented).toBe(true);
  expect(picked).toHaveBeenCalledExactlyOnceWith(link);
  expect(changed.mock.calls).toEqual([[true], [false]]);
  expect(styles[0].attached).toBe(false);
  expect(highlight).toHaveBeenLastCalledWith(null);
  expect(dispatch("click", [link]).defaultPrevented).toBe(false);
  expect(picked).toHaveBeenCalledTimes(1);
});

test("ignores the dock's shadow tree and cancels on Escape", () => {
  const picked = vi.fn();
  const changed = vi.fn();
  const picker = createElementPicker({ picked, changed, highlight: vi.fn() });
  picker.setActive(true);
  const dock = new FakeElement("DEVFRAMES-DOCK-EMBEDDED");
  expect(dispatch("click", [new FakeElement("BUTTON"), dock]).defaultPrevented).toBe(false);
  expect(picked).not.toHaveBeenCalled();
  expect(dispatch("keydown", [], "Escape").defaultPrevented).toBe(true);
  expect(styles[0].attached).toBe(false);
  expect(changed).toHaveBeenLastCalledWith(false);
  expect(dispatch("click", [new FakeElement()]).defaultPrevented).toBe(false);
});
