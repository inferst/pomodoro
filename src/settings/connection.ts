import { io } from 'socket.io-client';

export type PomodoroUpdateProps = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  rounds: number;
};

export type PomodoroState = {
  seconds: number;
  minutes: number;
  round: number;
  status: PomodoroStatus;
  play: boolean;
};

export enum PomodoroStatus {
  focus = 'focus',
  shortBreak = 'shortBreak',
  longBreak = 'longBreak',
}

export const connection = (onUpdate: (state: PomodoroState) => void) => {
  const socket = io('http://localhost:3000');

  const url = new URLSearchParams(location.search);
  const roomId = url.get('room');

  socket.on('connect', () => {
    console.log('connected');

    socket.on('client_update', (state) => {
      onUpdate(state);
      console.log('client_update', state);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });

  return {
    roomId,
    init: (props: PomodoroUpdateProps) => {
      socket.emit('server_init', { ...props, roomId });
    },
    update: (props: PomodoroUpdateProps) => {
      socket.emit('server_update', props);
    },
    toggle: (play: boolean) => {
      socket.emit('server_toggle', play);
    },
  };
};
