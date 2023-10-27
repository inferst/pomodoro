import { io } from 'socket.io-client';

export const connection = (onPlayPause: () => void) => {
  const socket = io('http://localhost:3000');

  socket.on('connect', () => {
    console.log('connected');

    const searchParams = new URLSearchParams(window.location.search);
    const room = searchParams.get('room');

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.emit('create_room', {
      id: room,
    });

    socket.on('play_pause', () => {
      onPlayPause();
    });
  });

  return {
    playPause: (isPaused: boolean) => {
      socket.emit('state', { isPaused});
    },
  };
};
