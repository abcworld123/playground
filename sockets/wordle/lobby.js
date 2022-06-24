const allRooms = require('#modules/wordle/m_wordle').allRooms;

module.exports = function (nsp) {
  const users = new Set();  // { all users }
  const hosts = new Map();  // { room: id }

  nsp.on('connection', (socket) => {
    let myRoom = '';
    users.add(socket.id);
    socket.emit('room list', [...hosts.keys()]);

    socket.on('create room', (room) => {
      myRoom = room;
      hosts.set(room, socket.id);
      socket.broadcast.emit('create room', room);
    });

    socket.on('room exist check', (room, callback) => {
      callback(hosts.has(room) || allRooms.has(room));
    });

    socket.on('remove room', () => {
      socket.broadcast.emit('remove room', myRoom);
      hosts.delete(myRoom);
      myRoom = '';
    });

    socket.on('join room request', (room) => {
      nsp.to(hosts.get(room)).emit('join room request', socket.id);
    });

    socket.on('join room cancel', (room) => {
      nsp.to(hosts.get(room)).emit('join room cancel', socket.id);
    });

    socket.on('user exist check', (user, callback) => {
      callback(users.has(user));
    });

    socket.on('join room accept', (user) => {
      allRooms.set(myRoom, 0);
      socket.emit('join room accept', myRoom);
      nsp.to(user).emit('join room accept', myRoom);
    });

    socket.on('join room reject', (user) => {
      nsp.to(user).emit('join room reject');
    });

    socket.on('disconnect', (reason) => {
      socket.broadcast.emit('user leave', socket.id);
      if (myRoom) socket.broadcast.emit('remove room', myRoom);
      users.delete(socket.id);
      hosts.delete(myRoom);
    });
  });
};
