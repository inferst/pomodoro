import { createSignal } from 'solid-js';
import './App.css';

function App() {
  const [focusDuration, setFocusDuration] = createSignal(25);
  const [shortBreakDuration, setShortBreakDuration] = createSignal(5);
  const [longBreakDuration, setLongBreakDuration] = createSignal(15);

  const url = () =>
    'http://localhost:5173/timer/?' +
    `fd=${focusDuration()}&sb=${shortBreakDuration()}&lb=${longBreakDuration()}`;

  let inputRef: HTMLInputElement | undefined;

  const handleInputClick = () => {
    if (!inputRef) return;

    inputRef.select();
    navigator.clipboard.writeText(inputRef.value);

    console.log(inputRef.value);
  };

  return (
    <div id="root" class="container">
      <h1>Settings</h1>

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

      <p>Copied!</p>
    </div>
  );
}

export default App;
