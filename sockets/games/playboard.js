module.exports = function (nsp) {
  const users = new Set();
  const rooms = new Map();
  const playBoard = new Map();
  const widthPixel = 1000;
  const heightPixel = 500;

  nsp.on('connection', (socket) => {
    users.add(socket.id);
    socket.emit('user list', [...users]);
    socket.emit('room list', [...rooms]);
    socket.broadcast.emit('user enter', socket.id);

    socket.onAny((event, msg) => {
      console.log(`${event}:  ${msg}`);
    });

    socket.on('disconnect', (reason) => {
      console.log("나감");
    });

    socket.on('moveUp', (roomNum) => {
      const userInfo = playBoard.get(roomNum);
      if (userInfo.play1 === socket.id) {
        userInfo.player1_dy = -userInfo.player1_y_speed;
      } else {
        userInfo.player2_dy = -userInfo.player2_y_speed;
      }
      playBoard.set(roomNum, userInfo);
    });

    socket.on('moveDown', (roomNum) => {
      const userInfo = playBoard.get(roomNum);
      if (userInfo.play1 === socket.id) {
        userInfo.player1_dy = userInfo.player1_y_speed;
      } else {
        userInfo.player2_dy = userInfo.player2_y_speed;
      }
      playBoard.set(roomNum, userInfo);
    });

    socket.on('connection', (roomNum) => {
      if (!playBoard.has(roomNum)) {
        socket.join(roomNum);
        playBoard.set(roomNum, {
          "play1": socket.id,
          "play2": "",
          "player1_x": 100,
          "player1_y": 250,
          "player1_dy": 5,
          "player1_y_speed": 5,
          "player1_score": 0,
          "player2_x": 900,
          "player2_y": 250,
          "player2_dy": 5,
          "player2_y_speed": 5,
          "player2_score": 0,
          "play_ball_x": 500,
          "play_ball_y": 250,
          "play_ball_dx": 5,
          "play_ball_dy": 2,
          "play_ball_pause": 0,
          "time": 66,
          "left_time": 50,
        });
      } else {
        const userInfo = playBoard.get(roomNum);
        if (!userInfo.play2) {
          userInfo.play2 = socket.id;
          socket.join(roomNum);
          playBoard.set(roomNum, userInfo);

          abc(userInfo.play1, userInfo.play2, "countDown", roomNum);
          setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 3000);
        }
      }
    });
    function abc(play1, play2, num, roomNum) {
      nsp.to(roomNum).emit(num);
    }

    function calPlay(roomNum) {
      let userInfo = playBoard.get(roomNum);
      userInfo.player1_y += userInfo.player1_dy;
      userInfo.player2_y += userInfo.player2_dy;
      userInfo.play_ball_x += userInfo.play_ball_dx;
      userInfo.play_ball_y += userInfo.play_ball_dy;
      userInfo.play_ball_pause = userInfo.play_ball_pause < 1 ? userInfo.play_ball_pause : userInfo.play_ball_pause - 1;
      userInfo.time = userInfo.time - 1;

      if ( userInfo.player1_y >= heightPixel * 0.8 || userInfo.player1_y <= 0) {userInfo.player1_dy = 0; }
      if ( userInfo.player2_y >= heightPixel * 0.8 || userInfo.player2_y <= 0) {userInfo.player2_dy = 0; }
      if (userInfo.play_ball_x >= widthPixel && userInfo.play_ball_pause < 1) {
        userInfo.play_ball_dx = -userInfo.play_ball_dx;
        userInfo.player1_score = userInfo.player1_score + 1;
        nsp.to(roomNum).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);
        setInitialState(userInfo);

        nsp.to(roomNum).emit('player1_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);
          nsp.to(roomNum).emit('countDown');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      } else if (userInfo.play_ball_x <= 0 && userInfo.play_ball_pause < 1) {
        userInfo.play_ball_dx = -userInfo.play_ball_dx;
        userInfo.player2_score = userInfo.player2_score + 1;
        nsp.to(roomNum).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);

        setInitialState(userInfo);

        nsp.to(roomNum).emit('player2_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);
          nsp.to(roomNum).emit('countDown');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      }
      if ( userInfo.play_ball_y >= heightPixel || userInfo.play_ball_y <= 0) {
        userInfo.play_ball_dy = -userInfo.play_ball_dy;
      }
      if (userInfo.time < 1) {
        nsp.to(roomNum).emit('timeFlow');
        if (userInfo.left_time < 2) {
          clearInterval(userInfo.gameBoard);
        }
        userInfo.play_ball_dx = userInfo.play_ball_dx > 0 ? userInfo.play_ball_dx + 1 : userInfo.play_ball_dx - 1;
        userInfo.left_time -= 1;
        userInfo.time = 66;
      }

      playBoard.set(roomNum, userInfo);

      userInfo = checkCrash(userInfo);

      nsp.to(roomNum).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);
    }

    function checkCrash(userInfo) {
      if (userInfo.player1_x < userInfo.play_ball_x &&
        userInfo.play_ball_x < userInfo.player1_x + 20 &&
        userInfo.player1_y < userInfo.play_ball_y &&
        userInfo.play_ball_y < userInfo.player1_y + heightPixel * 0.2) {
        userInfo.play_ball_dx *= -1;
        let dy = Math.floor(Math.random() * 200);
        dy = userInfo.player1_dy < 0 ? -dy : dy;
        dy /= 20;
        userInfo.play_ball_dy = dy;
        userInfo.play_ball_pause = 5;
      } else if (userInfo.player2_x < userInfo.play_ball_x &&
        userInfo.play_ball_x < userInfo.player2_x + 20 &&
        userInfo.player2_y < userInfo.play_ball_y &&
        userInfo.play_ball_y < userInfo.player2_y + heightPixel * 0.2) {
        userInfo.play_ball_dx *= -1;
        let dy = Math.floor(Math.random() * 400);
        dy -= 200;
        dy = userInfo.player2_dy < 0 ? -dy : dy;
        dy /= 20;
        userInfo.play_ball_dy = dy;
        userInfo.play_ball_pause = 5;
      }
      return userInfo;
    }

    function setInitialState(userInfo) {
      userInfo.player1_y = 240;
      userInfo.player2_y = 240;
      userInfo.play_ball_x = 500;
      userInfo.play_ball_y = 250;
      userInfo.play_ball_dx = 5;
    }

    function gameLoading(userInfo, roomNum) {
      setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
    }
  });
};
