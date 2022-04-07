module.exports = function (nsp) {
  const users = {};
  nsp.on('connection', (socket) => {
    // console.log(`[hockey] connected user ${socket.id}`);
    socket.emit('userlist', Object.keys(users));
    socket.broadcast.emit('userenter', socket.id);
    users[socket.id] = socket;
    
    // socket.on('keypress', (msg) => {
    //   console.log(msg);
    // });

    // debug
    socket.onAny((event, msg) => {
      console.log(`--------- ${event}:  ${msg} ----------`);
    });

    socket.on('disconnect', (reason) => {
      // console.log(`[hockey] disconnected user ${socket.id}`);
      socket.broadcast.emit('userleave', socket.id);
      delete users[socket.id];
    });
  });
};
