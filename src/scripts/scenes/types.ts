export interface SceneController {
  start(): void;
  stop(): void;
  setProgress(p: number): void;
  dispose(): void;
}

export type SceneFactory = (host: HTMLElement, opts: { reduced: boolean }) => SceneController;
