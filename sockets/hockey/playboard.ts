import type { Namespace } from 'socket.io';
import type { BallInfo, GameInfo, PlayBoard, PlayerInfo } from 'types/games/hockey';

export default function initHockeyBoard(nsp: Namespace) {
  const playBoard = new Map<string, PlayBoard>();
  const widthPixel = 1000;
  const heightPixel = 500;

  nsp.on('connection', (socket) => {
    let p1: PlayerInfo;
    let p2: PlayerInfo;
    let ball: BallInfo;
    let info: GameInfo;

    socket.onAny((event, msg) => {
      console.log(`${event}:  ${msg}`);
    });

    socket.on('disconnect', (reason) => {
      console.log('나감');
    });

    socket.on('moveUp', (roomNum: string) => {
      const userInfo = playBoard.get(roomNum);
      if (userInfo.p1._id === socket.id) {
        userInfo.p1.dy = -userInfo.p1.ySpeed;
      } else {
        userInfo.p2.dy = -userInfo.p2.ySpeed;
      }
      playBoard.set(roomNum, userInfo);
    });

    socket.on('moveDown', (roomNum: string) => {
      const userInfo = playBoard.get(roomNum);
      if (userInfo.p1._id === socket.id) {
        userInfo.p1.dy = userInfo.p1.ySpeed;
      } else {
        userInfo.p2.dy = userInfo.p2.ySpeed;
      }
      playBoard.set(roomNum, userInfo);
    });

    socket.on('connection', (roomNum: string) => {
      if (!playBoard.has(roomNum)) {
        socket.join(roomNum);
        p1 = {
          '_id': socket.id,
          'x': 100,
          'y': 250,
          'dy': 5,
          'ySpeed': 5,
          'score': 0,
        };
        p2 = {
          '_id': '',
          'x': 900,
          'y': 250,
          'dy': 5,
          'ySpeed': 5,
          'score': 0,
        };
        ball = {
          'x': 500,
          'y': 250,
          'dx': 5,
          'dy': 2,
          'pause': 0,
        };
        info = {
          'time': 66,
          'left_time': 50,
        };

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
          'info': {
            'time': 66,
            'left_time': 50,
          },
        });
      } else {
        const userInfo = playBoard.get(roomNum);
        if (!userInfo.p2._id) {
          userInfo.p2._id = socket.id;
          socket.join(roomNum);
          playBoard.set(roomNum, userInfo);
          p1 = userInfo.p1;
          p2 = userInfo.p2;
          ball = userInfo.ball;
          info = userInfo.info;

          abc(userInfo.p1._id, userInfo.p2._id, 'countDown', roomNum);
          setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 3000);
        }
      }
    });

    function abc(p1: string, p2: string, num: string, roomNum: string) {
      console.log(p1);
      console.log(p2);
      console.log(socket.id);
      nsp.to(p1).emit(num, 1);
      nsp.to(p2).emit(num, 2);
    }

    function calPlay(roomNum: string) {
      let userInfo = playBoard.get(roomNum);
      p1.y += p1.dy;
      p2.y += p2.dy;
      ball.x += ball.dx;
      ball.y += ball.dy;
      ball.pause = ball.pause < 1 ? ball.pause : ball.pause - 1;
      info.time = info.time - 1;

      if ( p1.y >= heightPixel * 0.8 || p1.y <= 0) {p1.dy = 0; }
      if ( p2.y >= heightPixel * 0.8 || p2.y <= 0) {p2.dy = 0; }
      if (ball.x >= widthPixel && ball.pause < 1) {
        ball.dx = -ball.dx;
        p1.score = p1.score + 1;
        nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
        setInitialState(userInfo);

        nsp.to(roomNum).emit('player1_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
          nsp.to(roomNum).emit('countDown');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      } else if (ball.x <= 0 && ball.pause < 1) {
        ball.dx = -ball.dx;
        p2.score = p2.score + 1;
        nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);

        setInitialState(userInfo);

        nsp.to(roomNum).emit('player2_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
          nsp.to(roomNum).emit('countDown');
        }, 3000);

        clearInterval(userInfo.gameBoard);
        gameLoading(userInfo, roomNum);
        return;
      }
      if ( ball.y >= heightPixel || ball.y <= 0) {
        ball.dy = -ball.dy;
      }
      if (info.time < 1) {
        nsp.to(roomNum).emit('timeFlow');
        if (info.left_time < 2) {
          clearInterval(userInfo.gameBoard);
        }
        ball.dx = ball.dx > 0 ? ball.dx + 1 : ball.dx - 1;
        info.left_time -= 1;
        info.time = 66;
      }

      playBoard.set(roomNum, userInfo);

      userInfo = checkCrash(userInfo);

      nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
    }

    function checkCrash(userInfo: PlayBoard) {
      if (p1.x < ball.x &&
        ball.x < p1.x + 20 &&
        p1.y < ball.y &&
        ball.y < p1.y + heightPixel * 0.2) {
        ball.dx *= -1;
        let dy = Math.floor(Math.random() * 200);
        dy = p1.dy < 0 ? -dy : dy;
        dy /= 20;
        ball.dy = dy;
        ball.pause = 5;
      } else if (p2.x < ball.x &&
        ball.x < p2.x + 20 &&
        p2.y < ball.y &&
        ball.y < p2.y + heightPixel * 0.2) {
        ball.dx *= -1;
        let dy = Math.floor(Math.random() * 400);
        dy -= 200;
        dy = p2.dy < 0 ? -dy : dy;
        dy /= 20;
        ball.dy = dy;
        ball.pause = 5;
      }
      return userInfo;
    }

    function setInitialState(userInfo: PlayBoard) {
      p1.y = 240;
      p2.y = 240;
      ball.x = 500;
      ball.y = 250;
      ball.dx = 5;
    }

    function gameLoading(userInfo: PlayBoard, roomNum: string) {
      setTimeout(function () {userInfo.gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
    }

    function setGameInfo() {
      return {

      };
    }
  });
}
