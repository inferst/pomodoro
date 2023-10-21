import { createSignal, onCleanup } from 'solid-js';
import { PomodoroState, createPomodoro } from './pomodoro';

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
      }
    },
  });

  onCleanup(() => {
    pomodoro.pause();
  });

  const handlePause = () => {
    if (isPaused()) {
      pomodoro.start();
    } else {
      pomodoro.pause();
    }

    setIsPaused(!isPaused());
  };

  return (
    <>
      <div>
        {minutes()} : {seconds()}
      </div>
      <div>{state()}</div>
      <div>
        <button onClick={handlePause}>{isPaused() ? 'Play' : 'Pause'}</button>
      </div>
    </>
  );
}

export default App;
