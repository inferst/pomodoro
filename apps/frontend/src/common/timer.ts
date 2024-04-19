export type TimerState = {
  seconds: number;
  minutes: number;
};

export type TimerProps = {
  onTick: (state: TimerState) => void;
};

export type Timer = {
  start: () => void;
  clearTimer: () => void;
  set: (state: TimerState) => void;
};

export const createTimer = (props: TimerProps): Timer => {
  let seconds = 0;
  let minutes = 0;
  let timer: ReturnType<typeof setInterval>;

  const start = () => {
    clearTimer();
    timer = setInterval(() => {
      if (seconds == 0) {
        minutes = minutes - 1;

        if (minutes < 0) {
          minutes = 0;
          clearTimer();
        } else {
          seconds = 59;
        }
      } else {
        seconds = seconds - 1;
      }

      props.onTick({
        seconds,
        minutes,
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  const set = (state: TimerState) => {
    seconds = state.seconds;
    minutes = state.minutes;
  };

  return {
    start,
    clearTimer,
    set,
  };
};
