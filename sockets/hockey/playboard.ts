import type { Namespace } from 'socket.io';
import type { BallInfo, GameInfo, PlayBoard, PlayerInfo } from 'types/games/hockey';

export default function initHockeyBoard(nsp: Namespace) {
  const playBoard = new Map<string, PlayBoard>();
  const widthPixel = 1000;
  const heightPixel = 500;
  const refreshInterval = 15;
  const playTime = 50;
  const tick = Math.round(1000 / refreshInterval);

  nsp.on('connection', (socket) => {
    let p1: PlayerInfo;
    let p2: PlayerInfo;
    let ball: BallInfo;
    let info: GameInfo;
    let roomNum: string;

    socket.on('connection', (t_roomNum: string) => {
      roomNum = t_roomNum;
      socket.join(roomNum);
      if (!playBoard.has(roomNum)) {
        const gameState = getInitialState();
        playBoard.set(roomNum, gameState);
        ({ p1, p2, ball, info } = gameState);
        p1.id = socket.id;
      } else {
        ({ p1, p2, ball, info } = playBoard.get(roomNum));
        p2.id = socket.id;
        gameLoading();
      }
    });

    socket.on('moveUp', () => {
      const player = p1.id === socket.id ? p1 : p2;
      player.dy = -player.ySpeed;
    });

    socket.on('moveDown', () => {
      const player = p1.id === socket.id ? p1 : p2;
      player.dy = player.ySpeed;
    });

    socket.on('disconnect', (reason) => {
      if (playBoard.has(roomNum)) {
        closeRoom();
      }
    });

    function gameLoading() {
      sendState();
      countDown(p1, p2);
      info.timeout = setTimeout(() => {
        info.interval = setInterval(calPlay, refreshInterval);
      }, 3000);
    }

    function countDown(p1: PlayerInfo, p2: PlayerInfo) {
      nsp.to(p1.id).emit('countDown', 1);
      nsp.to(p2.id).emit('countDown', 2);
    }

    function calPlay() {
      p1.y += p1.dy;
      p2.y += p2.dy;
      ball.x += ball.dx;
      ball.y += ball.dy;
      ball.pause -= ball.pause && 1;
      info.time -= 1;
      if (p1.y >= heightPixel * 0.8 || p1.y <= 0) p1.dy = 0;
      if (p2.y >= heightPixel * 0.8 || p2.y <= 0) p2.dy = 0;

      if (widthPixel <= ball.x && ball.pause < 1) goal(p1);
      else if (ball.x <= 0 && ball.pause < 1) goal(p2);
      else {
        if (info.time < 1) {
          nsp.to(roomNum).emit('timeFlow');
          if (--info.left_time <= 0 && p1.score !== p2.score) gameEnd();
          ball.dx += ball.dx > 0 ? 1 : -1;
          info.time = tick;
        }
        if (ball.y >= heightPixel || ball.y <= 0) {
          ball.dy = -ball.dy;
        }
        handleCrash();
        sendState();
      }
    }

    function sendState() {
      nsp.to(roomNum).emit('playboard', p1.y, p2.y, ball.x, ball.y);
    }

    function handleCrash() {
      for (const player of [p1, p2]) {
        if (
          player.x < ball.x &&
          ball.x < player.x + 20 &&
          player.y < ball.y &&
          ball.y < player.y + heightPixel * 0.2
        ) {
          let dy = Math.floor(Math.random() * 10);
          dy = player.dy < 0 ? -dy : dy;
          ball.dx *= -1;
          ball.dy = dy;
          ball.pause = 5;
        }
      }
    }

    function goal(player: PlayerInfo) {
      const n = player === p1 ? 1 : 2;
      player.score += 1;
      nsp.to(roomNum).emit('goal', n, player.score);
      clearInterval(info.interval);
      info.timeout = setTimeout(() => {
        resetState(player);
        gameLoading();
      }, 3000);
    }

    function resetState(goalPlayer: PlayerInfo) {
      p1.y = 200;
      p2.y = 200;
      p1.dy = 0;
      p2.dy = 0;
      ball.x = 500;
      ball.y = 250;
      ball.dx = goalPlayer === p1 ? -5 : 5;
    }

    function gameEnd() {
      nsp.to(roomNum).emit('gameSet', p1.score > p2.score ? '1' : '2');
      closeRoom();
    }

    function closeRoom() {
      clearTimeout(info.timeout);
      clearInterval(info.interval);
      playBoard.delete(roomNum);
      nsp.in(roomNum).disconnectSockets();
    }

    function getInitialState(): PlayBoard {
      return {
        p1: {
          id: null,
          x: 100,
          y: 200,
          dy: 0,
          ySpeed: 5,
          score: 0,
        },
        p2: {
          id: null,
          x: 900,
          y: 200,
          dy: 0,
          ySpeed: 5,
          score: 0,
        },
        ball: {
          x: 500,
          y: 250,
          dx: 5,
          dy: 2,
          pause: 0,
        },
        info: {
          time: tick,
          left_time: playTime,
          interval: null,
          timeout: null,
        },
      };
    }
  });
}
