/** Capture page clicks without activating links/buttons, while leaving the dock usable. */
export function createElementPicker(options: {
  highlight: (element: Element | null) => void;
  picked: (element: Element) => void;
  changed: (active: boolean) => void;
}) {
  let active = false;
  const style = document.createElement("style");
  style.textContent = "html * { cursor: crosshair !important; }";

  const elementOf = (event: Event) => {
    const path = event.composedPath();
    // The dock is a web component: target alone isn't sufficient for its shadow tree.
    if (path.some((node) => node instanceof Element && node.tagName.toLowerCase() === "devframes-dock-embedded")) return;
    return path.find((node): node is Element => node instanceof Element);
  };
  const move = (event: PointerEvent) => options.highlight(elementOf(event) ?? null);
  const down = (event: PointerEvent) => {
    if (!elementOf(event)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const click = (event: MouseEvent) => {
    const element = elementOf(event);
    if (!element) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setActive(false);
    options.picked(element);
  };
  const key = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    setActive(false);
  };

  function setActive(next: boolean) {
    if (active === next) return;
    active = next;
    if (active) {
      document.documentElement.append(style);
      window.addEventListener("pointermove", move, true);
      window.addEventListener("pointerdown", down, true);
      window.addEventListener("click", click, true);
      window.addEventListener("keydown", key, true);
    } else {
      style.remove();
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("click", click, true);
      window.removeEventListener("keydown", key, true);
      options.highlight(null);
    }
    options.changed(active);
  }
  return { setActive };
}
