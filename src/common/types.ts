export type PomodoroUpdateProps = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  rounds: number;
};

export type PomodoroState = {
  seconds: number;
  minutes: number;
  round: number;
  status: PomodoroStatus;
  play: boolean;
  isFinished?: boolean;
};

export enum PomodoroStatus {
  focus = 'focus',
  shortBreak = 'shortBreak',
  longBreak = 'longBreak',
}
