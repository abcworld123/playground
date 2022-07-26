import type { Namespace } from 'socket.io';

export function initMoleBoard(nsp: Namespace, moleRooms: Map<string, number>) {
  nsp.on('connection', (socket) => {
    socket.on('disconnect', (reason) => {
    });
  });
}
