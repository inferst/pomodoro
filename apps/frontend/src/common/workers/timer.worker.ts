import { createTimer } from '../timer';

onmessage = (message) => {
  if (message.data.type == 'start') {
    timer.start();
  } else if (message.data.type == 'clearTimer') {
    timer.clearTimer();
  } else if (message.data.type == 'set') {
    timer.set(message.data.data);
  }
};

const timer = createTimer({
  onTick: (data) => {
    postMessage({
      type: 'tick',
      data,
    });
  },
});
