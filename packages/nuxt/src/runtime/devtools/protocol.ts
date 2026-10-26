import type { InPageChannelProtocol } from "devframe/in-page-channel";

export const NUGGET_CHANNEL = "nugget-devtools";

export type AnimationKind = "tween" | "timeline";

export type AnimationRow = {
  id: string;
  parentId?: string;
  label: string;
  kind: AnimationKind;
  targets: string;
  /** Seconds on GSAP's global timeline */
  start: number;
  /** Total duration in seconds, including repeats */
  duration: number;
  progress: number;
  paused: boolean;
  active: boolean;
  scroll: boolean;
  /** Changed from the devtools during this page session */
  edited: boolean;
};

export type EditableValue = number | string;

export type AnimationDetail = {
  id: string;
  label: string;
  targets: string;
  /** How the animation was created: `to`, `from`, `fromTo` or `timeline` */
  method: string;
  /** Why the animation cannot be edited, when it cannot */
  locked?: string;
  /** Seconds for one target and one iteration */
  duration: number;
  delay: number;
  /** GSAP ease string; empty when the ease is a function */
  ease: string;
  /** Seconds between targets; null without a stagger */
  stagger: number | null;
  repeat: number;
  yoyo: boolean;
  /** Start values; null when they are the element's own values (`to`) */
  from: Record<string, EditableValue> | null;
  /** End values; null when they are the element's own values (`from`) */
  to: Record<string, EditableValue> | null;
  /** Properties whose values are set in code by functions or objects */
  computed: string[];
  edited: boolean;
  /** Every target element has no size or isn't in the page, so changes can't be seen right now */
  targetsHidden: boolean;
};

export type AnimationEdit = Partial<
  Pick<AnimationDetail, "duration" | "delay" | "ease" | "stagger" | "repeat" | "yoyo">
> & {
  from?: Record<string, EditableValue>;
  to?: Record<string, EditableValue>;
};

/** One edited animation, described so a coding agent can find and change it in source */
export type EditRecord = {
  id: string;
  label: string;
  /** `to`, `from`, `fromTo` or `timeline` */
  method: string;
  targets: string;
  /** Vue components around the first target, innermost first. Files come from Vue's dev build */
  components: { name?: string; file?: string }[];
  /** Set when the animation is a step of a timeline */
  timeline?: { label: string; step: number; steps: number };
  /** Values before the first edit */
  before: AnimationEdit;
  /** Values now */
  after: AnimationEdit;
  /** The ease wasn't set in code; GSAP's default applied */
  easeWasDefault: boolean;
  staggered: boolean;
  page: string;
};

export type NuggetState = {
  /** Current time of GSAP's global timeline, in seconds */
  now: number;
  paused: boolean;
  speed: number;
  rows: AnimationRow[];
};

export type ControlAction = "play" | "pause" | "restart" | "reverse";

export interface NuggetChannelProtocol extends InPageChannelProtocol {
  functions: {
    pageScript: {
      control: (id: string, action: ControlAction) => void;
      seek: (id: string, progress: number) => void;
      setGlobal: (options: { paused?: boolean; speed?: number }) => void;
      clearFinished: () => void;
      inspect: (id: string) => AnimationDetail | null;
      /** Applies the edit to the running animation, keeping its progress */
      edit: (id: string, edit: AnimationEdit) => AnimationDetail | null;
      /** Puts back the values the animation had before its first edit */
      resetEdits: (id: string) => AnimationDetail | null;
      /** Edited animations; all of them, or the given ids and their timeline steps */
      edits: (ids?: string[]) => EditRecord[];
    };
  };
  events: {
    pageScript: { highlight: (id: string | null) => void };
  };
  sharedStates: {
    nugget: NuggetState;
  };
}
