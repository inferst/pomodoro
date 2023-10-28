import { io } from 'socket.io-client';
import { PomodoroState, PomodoroUpdateProps } from './types';

export const createConnection = (roomId: string, onUpdate: (state: PomodoroState) => void) => {
  const socket = io(import.meta.env.VITE_SOCKET_HOST, {
    path: import.meta.env.VITE_SOCKET_PATH,
  });

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('client_update', (state) => {
    onUpdate(state);
    console.log('client_update', state);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  return {
    init: (props: PomodoroUpdateProps) => {
      socket.emit('server_init', { ...props, roomId });
    },
    update: (props: PomodoroUpdateProps) => {
      socket.emit('server_update', props);
    },
    toggle: (play: boolean) => {
      socket.emit('server_toggle', play);
    },
    get: () => {
      socket.emit('server_get', { roomId }, (state: any) => {
        onUpdate(state);
        console.log('server_get', state);
      });
    },
  };
};
