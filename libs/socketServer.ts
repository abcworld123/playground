import { Server } from 'socket.io';
import { hockeyRooms, moleRooms, wordleRooms } from 'modules/rooms';
import { initHockeyBoard, initLobby, initMoleBoard, initWordleBoard } from 'sockets';
import type { Server as HttpServer } from 'http';

export function socket(server: HttpServer) {
  const io = new Server(server);

  initLobby(io.of('/hockey'), hockeyRooms);
  initLobby(io.of('/mole'), moleRooms);
  initLobby(io.of('/wordle'), wordleRooms);
  initHockeyBoard(io.of('/hockeyPlay'), hockeyRooms);
  initMoleBoard(io.of('/molePlay'), moleRooms);
  initWordleBoard(io.of('/wordle/playboard'), wordleRooms);
}
