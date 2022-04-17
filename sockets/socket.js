module.exports = function (server) {
  const io = require('socket.io')(server);
  const initWordle = require('./wordle/lobby');
  
  initWordle(io.of('/wordle'));
};
