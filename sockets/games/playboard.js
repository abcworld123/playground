module.exports = function (nsp) {
  const users = new Set();  // { all users }
  const rooms = new Map();  // { id: room }
  const playBoard = new Map();

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
        playBoard.set(roomNum, {
          "play1": socket.id,
          "play2": "",
          "player1_x": 10,
          "player1_y": 50,
          "player1_dy": 1,
          "player1_y_speed": 1,
          "player1_score": 0,
          "player2_x": 90,
          "player2_y": 50,
          "player2_dy": 1,
          "player2_y_speed": 1,
          "player2_score": 0,
          "play_ball_x": 50,
          "play_ball_y": 50,
          "play_ball_dx": 1,
          "play_ball_dy": 2,
          "play_ball_pause": 0,
          "time": 66,
          "left_time": 100,
        });
      } else {
        const userInfo = playBoard.get(roomNum);
        if (!userInfo.play2) {
          userInfo.play2 = socket.id;
          playBoard.set(roomNum, userInfo);

          abc(userInfo.play1, userInfo.play2, "3");
          setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 3000);
        }
      }
    });
    function abc(play1, play2, num) {
      nsp.to(play1).emit(num);
      nsp.to(play2).emit(num);
    }

    function calPlay(roomNum) {
      let userInfo = playBoard.get(roomNum);
      userInfo.player1_y += userInfo.player1_dy;
      userInfo.player2_y += userInfo.player2_dy;
      userInfo.play_ball_x += userInfo.play_ball_dx;
      userInfo.play_ball_y += userInfo.play_ball_dy;
      userInfo.play_ball_pause = userInfo.play_ball_pause < 1 ? userInfo.play_ball_pause : userInfo.play_ball_pause - 1;
      userInfo.time = userInfo.time - 1;

      if ( userInfo.player1_y >= 80 || userInfo.player1_y <= 0) {userInfo.player1_dy = 0; }
      if ( userInfo.player2_y >= 80 || userInfo.player2_y <= 0) {userInfo.player2_dy = 0; }
      if (userInfo.play_ball_x >= 100 && userInfo.play_ball_pause < 1) {
        userInfo.play_ball_dx = -userInfo.play_ball_dx;
        userInfo.player1_score = userInfo.player1_score + 1;
        setInitialState(userInfo);

        nsp.to(userInfo.play1).emit('player1_goal');
        nsp.to(userInfo.play2).emit('player1_goal');

        setTimeout(function () {
          nsp.to(userInfo.play1).emit('3');
          nsp.to(userInfo.play2).emit('3');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      } else if (userInfo.play_ball_x <= 0 && userInfo.play_ball_pause < 1) {
        userInfo.play_ball_dx = -userInfo.play_ball_dx;
        userInfo.player2_score = userInfo.player2_score + 1;
        setInitialState(userInfo);

        nsp.to(userInfo.play1).emit('player2_goal');
        nsp.to(userInfo.play2).emit('player2_goal');

        setTimeout(function () {
          nsp.to(userInfo.play1).emit('3');
          nsp.to(userInfo.play2).emit('3');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      }
      if ( userInfo.play_ball_y >= 100 || userInfo.play_ball_y <= 0) {
        userInfo.play_ball_dy = -userInfo.play_ball_dy;
      }
      if (userInfo.time < 1) {
        nsp.to(userInfo.play1).emit('timeFlow');
        nsp.to(userInfo.play2).emit('timeFlow');
        if (userInfo.left_time < 2) {
          clearInterval(userInfo.gameBoard);
        }
        userInfo.left_time -= 1;
        userInfo.time = 66;
      }

      playBoard.set(roomNum, userInfo);

      userInfo = checkCrash(userInfo);

      nsp.to(userInfo.play1).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);
      nsp.to(userInfo.play2).emit('playboard', userInfo.player1_x, userInfo.player1_y, userInfo.player2_x, userInfo.player2_y, Math.round(userInfo.play_ball_x), Math.round(userInfo.play_ball_y), userInfo.player1_score, userInfo.player2_score);
    }

    function checkCrash(userInfo) {
      if (userInfo.player1_x < userInfo.play_ball_x &&
        userInfo.play_ball_x < userInfo.player1_x + 2 &&
        userInfo.player1_y < userInfo.play_ball_y &&
        userInfo.play_ball_y < userInfo.player1_y + 20) {
        userInfo.play_ball_dx *= -1;
        let dy = Math.floor(Math.random() * 200);
        dy = userInfo.player1_dy < 0 ? -dy : dy;
        dy /= 100;
        userInfo.play_ball_dy = dy;
        userInfo.play_ball_pause = 5;
      } else if (userInfo.player2_x < userInfo.play_ball_x &&
        userInfo.play_ball_x < userInfo.player2_x + 2 &&
        userInfo.player2_y < userInfo.play_ball_y &&
        userInfo.play_ball_y < userInfo.player2_y + 20) {
        userInfo.play_ball_dx *= -1;
        let dy = Math.floor(Math.random() * 400);
        dy -= 200;
        dy = userInfo.player2_dy < 0 ? -dy : dy;
        dy /= 100;
        userInfo.play_ball_dy = dy;
        userInfo.play_ball_pause = 5;
      }
      return userInfo;
    }

    function setInitialState(userInfo) {
      userInfo.player1_y = 50;
      userInfo.player2_y = 50;
      userInfo.play_ball_x = 50;
      userInfo.play_ball_y = 50;
    }

    function gameLoading(userInfo, roomNum) {
      setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
    }
  });
};
