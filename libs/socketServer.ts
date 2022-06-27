import { Server } from 'socket.io';
import initHockey from 'sockets/hockey/lobby';
import initHockeyBoard from 'sockets/hockey/playboard';
import initWordle from 'sockets/wordle/lobby';
import initWordleBoard from 'sockets/wordle/playboard';
import type { Server as HttpServer } from 'http';

export default function socket(server: HttpServer) {
  const io = new Server(server);

  initHockey(io.of('/hockey'));
  initWordle(io.of('/wordle'));
  initHockeyBoard(io.of('/hockeyPlay'));
  initWordleBoard(io.of('/wordle/playboard'));
}
