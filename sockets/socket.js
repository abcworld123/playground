module.exports = function (server) {
  const io = require('socket.io')(server);
  const initHockey = require('./games/hockey');
  
  initHockey(io.of('/hockey'));
};
