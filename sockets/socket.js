module.exports = function (server) {
  var io = require('socket.io')(server);
  const clients = [];

  io.on('connection', (socket) => {
    console.log(`user ${socket.id}: connected`);
    clients.push(socket.id);
    // console.log(clients);
    // console.log(socket.referer);
    const timer = setInterval(() => {
      io.emit('message', Math.random());
    }, 500);
    // socket.on('message', (msg) => {
    //   console.log('Message received: ' + msg);
    //   io.emit('message', msg);
    // });
    socket.on('disconnect', (reason) => {
      console.log(`user ${socket.id}: disconnected`);
      clients.pop(socket.id);
      clearInterval(timer);
    });
  });
  
  return io;
};
