import type { Namespace } from 'socket.io';

export default function initHockey(nsp: Namespace) {
  const users = new Set<string>();  // { all users }
  const hosts = new Map<string, string>();  // { room: id }

  nsp.on('connection', (socket) => {
    let myRoom = '';
    users.add(socket.id);
    socket.emit('room list', [...hosts.keys()]);

    socket.on('create room', (room: string) => {
      myRoom = room;
      hosts.set(room, socket.id);
      socket.broadcast.emit('create room', room);
    });

    socket.on('room exist check', (room: string, callback: (isExist: boolean) => void) => {
      callback(hosts.has(room));
    });

    socket.on('remove room', () => {
      socket.broadcast.emit('remove room', myRoom);
      hosts.delete(myRoom);
      myRoom = '';
    });

    socket.on('join room request', (room: string) => {
      nsp.to(hosts.get(room)).emit('join room request', socket.id);
    });

    socket.on('join room cancel', (room: string) => {
      nsp.to(hosts.get(room)).emit('join room cancel', socket.id);
    });

    socket.on('user exist check', (user: string, callback: (isExist: boolean) => void) => {
      callback(users.has(user));
    });

    socket.on('join room accept', (user: string) => {
      socket.emit('join room accept', myRoom);
      nsp.to(user).emit('join room accept', myRoom);
    });

    socket.on('join room reject', (user: string) => {
      nsp.to(user).emit('join room reject');
    });

    socket.on('disconnect', (reason) => {
      socket.broadcast.emit('user leave', socket.id);
      if (myRoom) socket.broadcast.emit('remove room', myRoom);
      users.delete(socket.id);
      hosts.delete(myRoom);
    });
  });
}
