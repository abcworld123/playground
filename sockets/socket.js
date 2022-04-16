module.exports = function (server) {
  const io = require('socket.io')(server);
  const initHockey = require('./games/hockey');
  const initHockeyBoard = require('./games/playboard');

  initHockey(io.of('/hockey'));
  initHockeyBoard(io.of('/hockeyPlay'));
};
