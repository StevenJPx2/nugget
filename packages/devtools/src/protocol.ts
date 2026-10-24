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
    };
  };
  events: {
    pageScript: { highlight: (id: string | null) => void };
  };
  sharedStates: {
    nugget: NuggetState;
  };
}
