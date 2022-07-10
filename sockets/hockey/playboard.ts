import type { Namespace } from 'socket.io';
import type { BallInfo, GameInfo, PlayBoard, PlayerInfo } from 'types/games/hockey';

export default function initHockeyBoard(nsp: Namespace) {
  const playBoard = new Map<string, PlayerInfo>();
  const widthPixel = 1000;
  const heightPixel = 500;

  nsp.on('connection', (socket) => {
    let p1: PlayerInfo = {
      '_id': '',
      'x': 100,
      'y': 250,
      'dy': 5,
      'ySpeed': 5,
      'score': 0,
    };
    let p2: PlayerInfo = {
      '_id': '',
      'x': 900,
      'y': 250,
      'dy': 5,
      'ySpeed': 5,
      'score': 0,
    };
    let ball: BallInfo = {
      'x': 500,
      'y': 250,
      'dx': 5,
      'dy': 2,
      'pause': 0,
    };
    let info: GameInfo = {
      'time': 66,
      'left_time': 50,
    };
    let t_roomNum: string;
    let gameBoard: any

    socket.onAny((event, msg) => {
      console.log(`${event}:  ${msg}`);
    });

    socket.on('disconnect', (reason) => {
      const userInfo = playBoard.get(t_roomNum);
      if(userInfo && gameBoard){
        clearInterval(gameBoard);
      }
    });

    socket.on('moveUp', (roomNum: string) => {
      if (p1._id === socket.id && p1.y > 0) {
        p1.dy = -p1.ySpeed;
      } else if(p2._id === socket.id && p2.y > 0) {
        p2.dy = -p2.ySpeed;
      }
      playBoard.set(roomNum, p1);
    });

    socket.on('moveDown', (roomNum: string) => {
      if (p1._id === socket.id && p1.y < heightPixel - 100) {
        p1.dy = p1.ySpeed;
      } else if(p2._id === socket.id && p2.y < heightPixel - 100) {
        p2.dy = p2.ySpeed;
      }
      playBoard.set(roomNum, p1);
    });

    socket.on('connection', (roomNum: string) => {
      if (!playBoard.has(roomNum)) {
        socket.join(roomNum);
        t_roomNum = roomNum
        p1._id = socket.id

        playBoard.set(roomNum, p1);
      } else {
        const userInfo = playBoard.get(roomNum);
        if (p1._id != socket.id && !p2._id) {
          p1 = userInfo
          t_roomNum = roomNum
          p2._id = socket.id;
          socket.join(roomNum);
          playBoard.set(roomNum, userInfo);

          countDown(p1._id, p2._id);
          setTimeout(function () {gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 3000);
        }
      }
    });

    function countDown(p1: string, p2: string) {
      nsp.to(p1).emit("countDown", 1);
      nsp.to(p2).emit("countDown", 2);
    }

    function calPlay(roomNum: string) {
      let userInfo = playBoard.get(roomNum);
      p1 = userInfo
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
        setInitialState(0);

        nsp.to(roomNum).emit('player1_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
          countDown(p1._id, p2._id)
        }, 3000);

        clearInterval(gameBoard);
        setTimeout(function () {gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
        return;
      } else if (ball.x <= 0 && ball.pause < 1) {
        ball.dx = -ball.dx;
        p2.score = p2.score + 1;
        nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);

        setInitialState(1);

        nsp.to(roomNum).emit('player2_goal');

        setTimeout(function () {
          nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
          countDown(p1._id, p2._id)
        }, 3000);

        clearInterval(gameBoard);
        setTimeout(function () {gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
        return;
      }
      if ( ball.y >= heightPixel || ball.y <= 0) {
        ball.dy = -ball.dy;
      }
      if (info.time < 1) {
        nsp.to(roomNum).emit('timeFlow');
        if (info.left_time < 2 && p1.score != p2.score) {
          clearInterval(gameBoard);
          nsp.to(roomNum).emit('gameSet', p1.score > p2.score ? "1" : "2");
        }
        ball.dx = ball.dx > 0 ? ball.dx + 1 : ball.dx - 1;
        info.left_time -= 1;
        info.time = 66;
      }

      playBoard.set(roomNum, userInfo);

      checkCrash();

      nsp.to(roomNum).emit('playboard', p1.x, p1.y, p2.x, p2.y, Math.round(ball.x), Math.round(ball.y), p1.score, p2.score);
    }

    function checkCrash() {
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
    }

    function setInitialState(user: Number) {
      p1.y = 240;
      p2.y = 240;
      ball.x = 500;
      ball.y = 250;
      ball.dy = 5;
      ball.dx = user ? 5 : -5;
    }

    function gameLoading(userInfo: PlayBoard, roomNum: string) {
      setTimeout(function () {gameBoard = setInterval(calPlay.bind(this, roomNum), 15 ); }, 6000);
    }

    function setGameInfo() {
      return {

      };
    }
  });
}
