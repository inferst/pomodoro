import { createMemo, createSignal, onCleanup } from 'solid-js';

import styles from './App.module.scss';
import { createConnection } from '../common/connection';
import { PomodoroStatus } from '../common/types';

import TimerWorker from '../assets/timer_worker.js?worker';

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get('room');

  const [seconds, setSeconds] = createSignal(0);
  const [minutes, setMinutes] = createSignal(0);
  const [status, setStatus] = createSignal<PomodoroStatus>(PomodoroStatus.focus);

  const [play, setPlay] = createSignal(false);

  if (!roomId) {
    return;
  }

  const timerWorker = new TimerWorker();
  const alarm = new Audio('/clock_alarm.mp3');
  alarm.volume = 0.2;

  timerWorker.onmessage = (message) => {
    if (message.data.type == 'tick') {
      setSeconds(message.data.data.seconds);
      setMinutes(message.data.data.minutes);
    }
  };

  const room = createConnection(roomId, (state) => {
    setSeconds(state.seconds);
    setMinutes(state.minutes);
    setStatus(state.status);
    setPlay(state.play);

    timerWorker.postMessage({
      type: 'set',
      data: state,
    });
    
    if (play()) {
      timerWorker.postMessage({
        type: 'start',
      });
    } else {
      timerWorker.postMessage({
        type: 'clearTimer',
      });
    }

    if (state.isFinished) {
      alarm.play();
    }
  });

  room.get();

  onCleanup(() => {
    timerWorker.postMessage({
      type: 'clearTimer',
    });
  });

  const timerSeconds = createMemo(() => seconds().toString().padStart(2, '0'));
  const timerMinutes = createMemo(() => minutes().toString().padStart(2, '0'));

  return (
    <div class={styles.container}>
      <div class={styles.wrapper}>
        <div>
          <div class={styles.timer}>
            <div class={styles.minutes}>
              <div class={styles.number}>{timerMinutes()[0]}</div>
              <div class={styles.number}>{timerMinutes()[1]}</div>
            </div>
            <div class={styles.delimeter}>:</div>
            <div class={styles.seconds}>
              <div class={styles.number}>{timerSeconds()[0]}</div>
              <div class={styles.number}>{timerSeconds()[1]}</div>
            </div>
          </div>
          <div class={styles.state}>{status()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
