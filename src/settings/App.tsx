import { createMemo, createSignal, Show } from 'solid-js';
import styles from './App.module.scss';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';
import { createConnection } from '../common/connection';
import { PomodoroState } from '../common/types';

function App() {
  const [focusDuration, setFocusDuration] = createSignal(25);
  const [shortBreakDuration, setShortBreakDuration] = createSignal(5);
  const [longBreakDuration, setLongBreakDuration] = createSignal(15);
  const [rounds, setRounds] = createSignal(4);
  const [isCopied, setIsCopied] = createSignal(false);
  const [state, setState] = createSignal<PomodoroState>();

  let pomodoroId = Cookies.get('pomodoro_id');

  if (!pomodoroId) {
    pomodoroId = nanoid(8);
    Cookies.set('pomodoro_id', pomodoroId);
  }

  const room = createConnection(pomodoroId, (state) => {
    setState(state);
  });

  room.init({
    focusDuration: focusDuration(),
    shortBreakDuration: shortBreakDuration(),
    longBreakDuration: longBreakDuration(),
    rounds: rounds(),
  });

  room.get();

  const url = createMemo(
    () =>
      import.meta.env.VITE_HOST +
      `/timer/?room=${pomodoroId}`
  );

  let inputRef: HTMLInputElement | undefined;

  const handleInputClick = () => {
    if (!inputRef) return;

    inputRef.select();
    navigator.clipboard.writeText(inputRef.value);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handlePreviewClick = () => {
    window.open(url(), '', 'width=300,height=400');
  };

  const handleToggle = () => {
    const newValue = !state()?.play;
    room.toggle(newValue);
  };

  const handleSaveClick = () => {
    room.update({
      focusDuration: focusDuration(),
      shortBreakDuration: shortBreakDuration(),
      longBreakDuration: longBreakDuration(),
      rounds: rounds(),
    });
  };

  return (
    <div class={clsx(styles.root, 'container')}>
      <h1>Settings</h1>

      <button onClick={handleToggle}>
        <Show when={!state()?.play} fallback={'Pause'}>
          Play
        </Show>
      </button>

      <div class="grid">
        <label for="focusDuration">
          Focus duration
          <input
            type="number"
            id="focusDuration"
            name="focusDuration"
            required
            min={5}
            max={60}
            onInput={(e) => {
              setFocusDuration(parseInt(e.currentTarget.value));
            }}
            value={focusDuration()}
          />
        </label>

        <label for="shortBreakDuration">
          Short break duration
          <input
            type="number"
            id="shortBreakDuration"
            name="shortBreakDuration"
            required
            min={1}
            max={15}
            onInput={(e) => {
              setShortBreakDuration(parseInt(e.currentTarget.value));
            }}
            value={shortBreakDuration()}
          />
        </label>

        <label for="longBreakDuration">
          Long break duration
          <input
            type="number"
            id="longBreakDuration"
            name="longBreakDuration2"
            required
            min={5}
            max={30}
            onInput={(e) => {
              setLongBreakDuration(parseInt(e.currentTarget.value));
            }}
            value={longBreakDuration()}
          />
        </label>
      </div>

      <label for="rounds">
        Rounds
        <input
          type="number"
          id="rounds"
          name="rounds"
          required
          min={1}
          onInput={(e) => {
            setRounds(parseInt(e.currentTarget.value));
          }}
          value={rounds()}
        />
      </label>

      <label for="url">
        Timer URL
        <input
          ref={inputRef}
          type="text"
          id="url"
          name="url"
          value={url()}
          readOnly
          onClick={handleInputClick}
        />
      </label>

      {isCopied() && <p>Copied!</p>}

      <button onClick={handleSaveClick}>Save</button>

      <button onClick={handlePreviewClick}>Preview</button>
    </div>
  );
}

export default App;
