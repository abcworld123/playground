module.exports = function (nsp) {
  const users = {};  // all users
  const rooms = {};  // { id: room }

  nsp.on('connection', (socket) => {
    users[socket.id] = true;
    socket.emit('room list', rooms);
    
    socket.on('create room', (room) => {
      rooms[socket.id] = room;
      socket.broadcast.emit('new room', socket.id, room);
    });

    socket.on('remove room', () => {
      socket.broadcast.emit('remove room', rooms[socket.id]);
      delete rooms[socket.id];
    });

    socket.on('join room request', (host) => {
      nsp.to(host).emit('join room request', socket.id);
    });

    socket.on('join room cancel', (host) => {
      nsp.to(host).emit('join room cancel', socket.id);
    });

    socket.on('join room accept', (user) => {
      if (users[user]) {
        nsp.to(user).emit('join room accept', rooms[socket.id]);
        socket.emit('join room accept', rooms[socket.id]);
      } else {
        socket.emit('user not exist');
      }
    });

    socket.on('join room reject', (user) => {
      nsp.to(user).emit('join room reject');
    });

    // debug
    socket.onAny((event, msg) => {
      console.log(`${event}:  ${msg}`);
    });

    socket.on('disconnect', (reason) => {
      delete users[socket.id];
      if (rooms[socket.id]) {
        socket.broadcast.emit('remove room', rooms[socket.id]);
        delete rooms[socket.id];
      }
    });
  });
};
