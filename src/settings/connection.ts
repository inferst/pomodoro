import { io } from 'socket.io-client';

export const connection = (
  onStateUpdate: (state: { isPaused: boolean }) => void
) => {
  const socket = io('http://localhost:3000');

  const url = new URLSearchParams(location.search);
  const roomId = url.get('room');

  socket.on('connect', () => {
    console.log('connected');

    socket.on('state', (state) => {
      console.log(state)
      onStateUpdate(state);
    });

    socket.emit('create_room', {
      id: roomId,
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });

  return {
    roomId,
    playPause: () => {
      socket.emit('play_pause');
    },
  };
};
