import { createMemo, createSignal, onCleanup } from 'solid-js';
import { PomodoroState, createPomodoro } from './pomodoro';

import styles from './App.module.scss';
import { connection } from './connection';

function App() {
  const searchParams = new URLSearchParams(window.location.search);

  const focusDuration = Number(searchParams.get('fd'));
  const shortBreakDuration = Number(searchParams.get('sb'));
  const longBreakDuration = Number(searchParams.get('lb'));
  const rounds = Number(searchParams.get('r'));

  const [seconds, setSeconds] = createSignal(0);
  const [minutes, setMinutes] = createSignal(focusDuration);
  const [state, setState] = createSignal<PomodoroState>(PomodoroState.focus);

  const [isPaused, setIsPaused] = createSignal(true);

  const room = connection(() => {
    if (isPaused()) {
      pomodoro.start();
    } else {
      pomodoro.pause();
    }

    setIsPaused(!isPaused());
  });

  const pomodoro = createPomodoro({
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    rounds,
    onTick: (data) => {
      setSeconds(data.seconds);
      setMinutes(data.minutes);

      if (data.state != state()) {
        setState(data.state);
        setIsPaused(true);
        room.playPause(true);
      }
    },
  });

  onCleanup(() => {
    pomodoro.pause();
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
          <div class={styles.state}>{state()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
