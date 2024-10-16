// pages/api/socket.js
import { Server as SocketIOServer } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new SocketIOServer(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Broadcast the message to all connected clients
      io.emit('message', `Server: ${message}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  console.log('Socket is initialized');
  res.end();
}
