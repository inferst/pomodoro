import { Socket, io } from 'socket.io-client';
import {
  ClientToServerEvents,
  GetSettingsCallback,
  GetStateCallback,
  ServerToClientEvents,
} from './types/socket.types';
import { PomodoroSettings, PomodoroState } from './types/pomodoro.types';

export const createConnection = (
  roomId: string,
  onUpdate: (state: PomodoroState) => void
) => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    import.meta.env.VITE_SOCKET_HOST,
    {
      path: import.meta.env.VITE_SOCKET_PATH,
    }
  );

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('updateState', (state) => {
    onUpdate(state);
  });

  return {
    getSettings: (callback: GetSettingsCallback) => {
      socket.emit('getSettings', { roomId }, callback);
    },
    updateSettings: (props: PomodoroSettings) => {
      socket.emit('updateSettings', props);
    },
    getState: (callback: GetStateCallback) => {
      socket.emit('getState', { roomId }, callback);
    },
    run: () => {
      socket.emit('run');
    },
    pause: () => {
      socket.emit('pause');
    },
  };
};
