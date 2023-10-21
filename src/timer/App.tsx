import { createEffect, createSignal, onCleanup } from 'solid-js';

enum PomodoroState {
  focus = 'focus',
  shortBreak = 'shortBreak',
  longBreak = 'longBreak',
}

function App() {
  const searchParams = new URLSearchParams(window.location.search);

  const focusDuration = Number(searchParams.get('fd'));
  const shortBreakDuration = Number(searchParams.get('sb'));
  const longBreakDuration = Number(searchParams.get('lb'));
  const rounds = Number(searchParams.get('r'));

  const [round, setRound] = createSignal(0);
  const [seconds, setSeconds] = createSignal(0);
  const [minutes, setMinutes] = createSignal(focusDuration);
  const [state, setState] = createSignal<PomodoroState>(PomodoroState.focus);

  const [isPaused, setIsPaused] = createSignal(true);

  const timer = setInterval(() => {
    if (!isPaused()) {
      if (seconds() == 0) {
        setMinutes(minutes() - 1);

        if (minutes() < 0) {
          if (state() == PomodoroState.focus) {
            setState(
              round() >= rounds
                ? PomodoroState.longBreak
                : PomodoroState.shortBreak
            );
            setMinutes(
              round() >= rounds ? longBreakDuration : shortBreakDuration
            );
          } else if (state() == PomodoroState.shortBreak) {
            setState(PomodoroState.focus);
            setMinutes(focusDuration);
            setRound(round() + 1);
          } else if (state() == PomodoroState.longBreak) {
            setState(PomodoroState.focus);
            setMinutes(focusDuration);
            setRound(0);
          }

          const audio = new Audio('/alert.wav');
          audio.play();

          setIsPaused(true);
        } else {
          setSeconds(59);
        }
      } else {
        setSeconds(seconds() - 1);
      }
    }
  }, 10);

  onCleanup(() => {
    clearInterval(timer);
  });

  const handlePuase = () => {
    setIsPaused(!isPaused());
  };

  return (
    <>
      <div>
        {minutes()} : {seconds()}
      </div>
      <div>{state()}</div>
      <div>
        <button onClick={handlePuase}>{isPaused() ? 'Play' : 'Pause'}</button>
      </div>
    </>
  );
}

export default App;
