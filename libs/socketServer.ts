import { Server } from 'socket.io';
import initWordle from 'sockets/wordle/lobby';
import initWordleBoard from 'sockets/wordle/playboard';
import type { Server as HttpServer } from 'http';

export default function socket(server: HttpServer) {
  const io = new Server(server);

  initWordle(io.of('/wordle'));
  initWordleBoard(io.of('/wordle/playboard'));
}
