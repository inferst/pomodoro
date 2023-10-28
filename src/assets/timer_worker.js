onmessage = (message) => {
  if (message.data.type == 'start') {
    timer.start();
  } else if (message.data.type == 'clearTimer') {
    timer.clearTimer();
  } else if (message.data.type == 'set') {
    timer.set(message.data.data);
  }
}

const createTimer = (onTick) => {
  let seconds = 0;
  let minutes = 0;
  let timer;

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

  const set = (props) => {
    seconds = props.seconds
    minutes = props.minutes;
  };

  return {
    start,
    clearTimer,
    set,
  };
};

const timer = createTimer((data) => {
  postMessage({
    type: 'tick',
    data,
  });
});