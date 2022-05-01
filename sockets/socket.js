module.exports = function (server) {
  const io = require('socket.io')(server);
  const initWordle = require('./wordle/lobby');
  const initWordleBoard = require('./wordle/playboard');
  
  initWordle(io.of('/wordle'));
  initWordleBoard(io.of('/wordle/playboard'));
};
