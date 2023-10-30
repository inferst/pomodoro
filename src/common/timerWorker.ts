import timerWorkerUrl from './workers/timer.worker?worker&url';
import { Timer, TimerProps, TimerState } from './timer';

export type TimerWorkerState = TimerState;

export type TimerWorkerProps = TimerProps;

export type TimerWorker = Timer & {
  terminate: () => void;
};

export const createTimerWorker = (props: TimerProps): TimerWorker => {
  const timerWorker = new Worker(timerWorkerUrl, { type: 'module' });

  timerWorker.onmessage = (message) => {
    if (message.data.type == 'tick') {
      props.onTick(message.data.data);
    }
  };

  return {
    set: (state: TimerState) => {
      timerWorker.postMessage({
        type: 'set',
        data: state,
      });
    },
    start: () => {
      timerWorker.postMessage({
        type: 'start',
      });
    },
    clearTimer: () => {
      timerWorker.postMessage({
        type: 'clearTimer',
      });
    },
    terminate: () => {
      timerWorker.terminate();
    }
  };
};
