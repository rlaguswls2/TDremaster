import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = async (socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}`);
  // 주석
  socket.buffer = Buffer.alloc(0);
  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
