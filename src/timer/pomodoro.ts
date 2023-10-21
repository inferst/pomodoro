type OnTickProps = {
  seconds: number;
  minutes: number;
  round: number;
  state: PomodoroState;
};

export type PomodoroProps = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  rounds: number;
  onTick: (props: OnTickProps) => void;
};

export enum PomodoroState {
  focus = 'focus',
  shortBreak = 'shortBreak',
  longBreak = 'longBreak',
}

export const createPomodoro = (props: PomodoroProps) => {
  const { focusDuration, longBreakDuration, shortBreakDuration, rounds, onTick } =
    props;

  let seconds = 0;
  let minutes = focusDuration;
  let round = 0;
  let state = PomodoroState.focus;
  let timer: number;

  const alert = new Audio('/alert.wav');

  const start = () => {
    clearTimer();
    timer = setInterval(() => {
      if (seconds == 0) {
        minutes = minutes - 1;

        if (minutes < 0) {
          if (state == PomodoroState.focus) {
            state =
              round >= rounds
                ? PomodoroState.longBreak
                : PomodoroState.shortBreak;
            minutes = round >= rounds ? longBreakDuration : shortBreakDuration;
          } else if (state == PomodoroState.shortBreak) {
            state = PomodoroState.focus;
            minutes = focusDuration;
            round = round + 1;
          } else if (state == PomodoroState.longBreak) {
            state = PomodoroState.focus;
            minutes = focusDuration;
            round = 0;
          }

          // alert.play();

          clearTimer();
        } else {
          seconds = 59;
        }
      } else {
        seconds = seconds - 1;
      }

      onTick({
        seconds,
        minutes,
        round,
        state,
      });
    }, 10);
  };

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  return {
    start,
    pause: clearTimer,
  };
};
