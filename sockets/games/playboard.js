module.exports = function (nsp) {
  const users = new Set();
  const rooms = new Map();
  const playBoard = new Map();
  const widthPixel = 1000;
  const heightPixel = 500;

  nsp.on('connection', (socket) => {
    let p1, p2, ball, info;

    users.add(socket.id);
    socket.emit('user list', [...users]);
    socket.emit('room list', [...rooms]);
    socket.broadcast.emit('user enter', socket.id);

    socket.onAny((event, msg) => {
      console.log(`${event}:  ${msg}`);
    });

    socket.on('disconnect', (reason) => {
      console.log('나감');
    });

    socket.on('moveUp', (roomNum) => {
      const userInfo = playBoard.get(roomNum);
      if (userInfo.p1._id === socket.id) {
        userInfo.p1.dy = -userInfo.p1.ySpeed;
      } else {
        userInfo.p2.dy = -userInfo.p2.ySpeed;
      }
      playBoard.set(roomNum, userInfo);
    });

    socket.on('moveDown', (roomNum) => {
      const userInfo = playBoard.get(roomNum);
      if (userInfo.p1._id === socket.id) {
        userInfo.p1.dy = userInfo.p1.ySpeed;
      } else {
        userInfo.p2.dy = userInfo.p2.ySpeed;
      }
      playBoard.set(roomNum, userInfo);
    });

    socket.on('connection', (roomNum) => {
      if (!playBoard.has(roomNum)) {
        socket.join(roomNum);
        playBoard.set(roomNum, {
          'p1': {
            '_id': socket.id,
            'x': 100,
            'y': 250,
            'dy': 5,
            'ySpeed': 5,
            'score': 0,
          },
          'p2': {
            '_id': '',
            'x': 900,
            'y': 250,
            'dy': 5,
            'ySpeed': 5,
            'score': 0,
          },
          'ball': {
            'x': 500,
            'y': 250,
            'dx': 5,
            'dy': 2,
            'pause': 0,
          },
          'time': 66,
          'left_time': 50,
        });
      } else {
        const userInfo = playBoard.get(roomNum);
        if (!userInfo.p2._id) {
          userInfo.p2._id = socket.id;
          socket.join(roomNum);
          playBoard.set(roomNum, userInfo);

          abc(userInfo.p1._id, userInfo.p2._id, 'countDown', roomNum);
          setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 3000);
        }
      }
    });

    function abc(p1, p2, num, roomNum) {
      console.log(p1);
      console.log(p2);
      console.log(socket.id);
      nsp.to(p1).emit(num, 1);
      nsp.to(p2).emit(num, 2);
    }

    function calPlay(roomNum) {
      let userInfo = playBoard.get(roomNum);
      userInfo.p1.y += userInfo.p1.dy;
      userInfo.p2.y += userInfo.p2.dy;
      userInfo.ball.x += userInfo.ball.dx;
      userInfo.ball.y += userInfo.ball.dy;
      userInfo.ball.pause = userInfo.ball.pause < 1 ? userInfo.ball.pause : userInfo.ball.pause - 1;
      userInfo.time = userInfo.time - 1;

      if ( userInfo.p1.y >= heightPixel * 0.8 || userInfo.p1.y <= 0) {userInfo.p1.dy = 0; }
      if ( userInfo.p2.y >= heightPixel * 0.8 || userInfo.p2.y <= 0) {userInfo.p2.dy = 0; }
      if (userInfo.ball.x >= widthPixel && userInfo.ball.pause < 1) {
        userInfo.ball.dx = -userInfo.ball.dx;
        userInfo.p1.score = userInfo.p1.score + 1;
        nsp.to(roomNum).emit('playboard', userInfo.p1.x, userInfo.p1.y, userInfo.p2.x, userInfo.p2.y, Math.round(userInfo.ball.x), Math.round(userInfo.ball.y), userInfo.p1.score, userInfo.p2.score);
        setInitialState(userInfo);

        nsp.to(roomNum).emit('player1_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', userInfo.p1.x, userInfo.p1.y, userInfo.p2.x, userInfo.p2.y, Math.round(userInfo.ball.x), Math.round(userInfo.ball.y), userInfo.p1.score, userInfo.p2.score);
          nsp.to(roomNum).emit('countDown');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      } else if (userInfo.ball.x <= 0 && userInfo.ball.pause < 1) {
        userInfo.ball.dx = -userInfo.ball.dx;
        userInfo.p2.score = userInfo.p2.score + 1;
        nsp.to(roomNum).emit('playboard', userInfo.p1.x, userInfo.p1.y, userInfo.p2.x, userInfo.p2.y, Math.round(userInfo.ball.x), Math.round(userInfo.ball.y), userInfo.p1.score, userInfo.p2.score);

        setInitialState(userInfo);

        nsp.to(roomNum).emit('player2_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', userInfo.p1.x, userInfo.p1.y, userInfo.p2.x, userInfo.p2.y, Math.round(userInfo.ball.x), Math.round(userInfo.ball.y), userInfo.p1.score, userInfo.p2.score);
          nsp.to(roomNum).emit('countDown');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      }
      if ( userInfo.ball.y >= heightPixel || userInfo.ball.y <= 0) {
        userInfo.ball.dy = -userInfo.ball.dy;
      }
      if (userInfo.time < 1) {
        nsp.to(roomNum).emit('timeFlow');
        if (userInfo.left_time < 2) {
          clearInterval(userInfo.gameBoard);
        }
        userInfo.ball.dx = userInfo.ball.dx > 0 ? userInfo.ball.dx + 1 : userInfo.ball.dx - 1;
        userInfo.left_time -= 1;
        userInfo.time = 66;
      }

      playBoard.set(roomNum, userInfo);

      userInfo = checkCrash(userInfo);

      nsp.to(roomNum).emit('playboard', userInfo.p1.x, userInfo.p1.y, userInfo.p2.x, userInfo.p2.y, Math.round(userInfo.ball.x), Math.round(userInfo.ball.y), userInfo.p1.score, userInfo.p2.score);
    }

    function checkCrash(userInfo) {
      if (userInfo.p1.x < userInfo.ball.x &&
        userInfo.ball.x < userInfo.p1.x + 20 &&
        userInfo.p1.y < userInfo.ball.y &&
        userInfo.ball.y < userInfo.p1.y + heightPixel * 0.2) {
        userInfo.ball.dx *= -1;
        let dy = Math.floor(Math.random() * 200);
        dy = userInfo.p1_dy < 0 ? -dy : dy;
        dy /= 20;
        userInfo.ball.dy = dy;
        userInfo.ball.pause = 5;
      } else if (userInfo.p2.x < userInfo.ball.x &&
        userInfo.ball.x < userInfo.p2.x + 20 &&
        userInfo.p2.y < userInfo.ball.y &&
        userInfo.ball.y < userInfo.p2.y + heightPixel * 0.2) {
        userInfo.ball.dx *= -1;
        let dy = Math.floor(Math.random() * 400);
        dy -= 200;
        dy = userInfo.p2.dy < 0 ? -dy : dy;
        dy /= 20;
        userInfo.ball.dy = dy;
        userInfo.ball.pause = 5;
      }
      return userInfo;
    }

    function setInitialState(userInfo) {
      userInfo.p1.y = 240;
      userInfo.p2.y = 240;
      userInfo.ball.x = 500;
      userInfo.ball.y = 250;
      userInfo.ball.dx = 5;
    }

    function gameLoading(userInfo, roomNum) {
      setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
    }

    function setGameInfo() {

    }
  });
};
