module.exports = function (nsp) {
  const users = new Set();  // { all users }
  const rooms = new Map();  // { id: room }

  nsp.on('connection', (socket) => {
    users.add(socket.id);
    socket.emit('user list', [...users]);
    socket.emit('room list', [...rooms]);
    socket.broadcast.emit('user enter', socket.id);

    socket.on('create room', (room) => {
      rooms.set(socket.id, room);
      socket.broadcast.emit('create room', socket.id, room);
    });

    socket.on('remove room', () => {
      socket.broadcast.emit('remove room', rooms.get(socket.id));
      rooms.delete(socket.id);
    });

    socket.on('join room request', (host) => {
      nsp.to(host).emit('join room request', socket.id);
    });

    socket.on('join room cancel', (host) => {
      nsp.to(host).emit('join room cancel', socket.id);
    });

    socket.on('join room accept', (user) => {
      socket.emit('join room accept', rooms.get(socket.id));
      nsp.to(user).emit('join room accept', rooms.get(socket.id));
    });

    socket.on('join room reject', (user) => {
      nsp.to(user).emit('join room reject');
    });

    socket.on('disconnect', (reason) => {
      socket.broadcast.emit('user leave', socket.id, rooms.get(socket.id));
      if (rooms.has(socket.id)) rooms.delete(socket.id);
      users.delete(socket.id);
    });
  });
};
