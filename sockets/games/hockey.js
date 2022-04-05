module.exports = function (io) {
  const clients = [];

  io.on('connection', (socket) => {
    console.log(`[hockey] connected user ${socket.id}`);
    clients.push(socket.id);
    const timer = setInterval(() => {
      io.emit('message', Math.random());
    }, 500);
    // socket.on('message', (msg) => {
    //   console.log('Message received: ' + msg);
    //   io.emit('message', msg);
    // });
    socket.on('disconnect', (reason) => {
      console.log(`[hockey] disconnected user ${socket.id}`);
      clients.pop(socket.id);
      clearInterval(timer);
    });
  });
};
