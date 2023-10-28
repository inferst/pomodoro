import { io } from 'socket.io-client';

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
  const socket = io('http://pomodoro.mikedanagam.space/api');

  socket.on('connect', () => {
    console.log('connected');

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('client_update', (state) => {
      onUpdate(state);
      console.log('client_update', state);
    });
  });

  return {
    get: (roomId: string) => {
      socket.emit('server_get', { roomId });
    },
  };
};
