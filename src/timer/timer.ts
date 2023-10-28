type OnTickProps = {
  seconds: number;
  minutes: number;
};

export type TimerProps = {
  onTick: (props: OnTickProps) => void;
};

export type TimerSetProps = {
  seconds: number;
  minutes: number;
}

export const createTimer = (props: TimerProps) => {
  const {
    onTick,
  } = props;

  let seconds = 0;
  let minutes = 0;
  let timer: number;

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

      onTick({
        seconds,
        minutes,
      });
    }, 10);
  };

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  const set = (props: TimerSetProps) => {
    seconds = props.seconds
    minutes = props.minutes;
  };

  return {
    start,
    clearTimer,
    set,
  };
};
