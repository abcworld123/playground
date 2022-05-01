module.exports = function (server) {
  const io = require('socket.io')(server);
  const initHockey = require('./games/hockey');
  const initHockeyBoard = require('./games/playboard');
  const initWordle = require('./wordle/lobby');
  const initWordleBoard = require('./wordle/playboard');

  initHockey(io.of('/hockey'));
  initHockeyBoard(io.of('/hockeyPlay'));
  initWordle(io.of('/wordle'));
  initWordleBoard(io.of('/wordle/playboard'));
};
