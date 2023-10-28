import { createMemo, createSignal, onCleanup } from 'solid-js';
import { createTimer } from './timer';

import styles from './App.module.scss';
import { PomodoroStatus, connection } from './connection';

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get('room');

  const [seconds, setSeconds] = createSignal(0);
  const [minutes, setMinutes] = createSignal(0);
  const [status, setStatus] = createSignal<PomodoroStatus>(PomodoroStatus.focus);

  const [play, setPlay] = createSignal(true);
  
  const timer = createTimer({
    onTick: (data) => {
      setSeconds(data.seconds);
      setMinutes(data.minutes);
    },
  });

  const room = connection((state) => {
    setSeconds(state.seconds);
    setMinutes(state.minutes);
    setStatus(state.status);
    setPlay(state.play);

    timer.set(state);
    
    if (play()) {
      timer.start();
    } else {
      timer.clearTimer();
    }
  });

  if (roomId) {
    room.get(roomId);
  }

  onCleanup(() => {
    timer.clearTimer();
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
