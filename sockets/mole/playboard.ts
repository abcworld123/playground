import { Cell } from 'types/games/mole';
import { randint, sleep } from 'utils/tools';
import type { Namespace } from 'socket.io';
import type { GameInfo, PlayBoard, PlayerInfo } from 'types/games/mole';

export function initMoleBoard(nsp: Namespace, moleRooms: Map<string, number>) {
  const rooms = new Map<string, PlayBoard>();
  const width = 100;
  const height = 100;
  const playTime = 50;

  nsp.on('connection', (socket) => {
    const room = socket.handshake.query.roomNum as string;
    let p1: PlayerInfo;
    let p2: PlayerInfo;
    let info: GameInfo;
    let board: Cell[][];
    init();

    socket.on('click', click);

    socket.on('disconnect', (reason) => {
      if (moleRooms.has(room)) {
        closeRoom();
      }
    });

    function init() {
      // if (!moleRooms.get(room)) {
      //   socket.disconnect();
      //   return;
      // }
      socket.join(room);
      if (!rooms.has(room)) {
        const gameState = getInitialState();
        rooms.set(room, gameState);
        ({ p1, p2, board } = gameState);
        p1.id = socket.id;
      } else {
        ({ p1, p2, board } = rooms.get(room));
        p2.id = socket.id;
        gameLoading();
      }
    }

    async function gameLoading() {
      await countdown();
      start();
      timeFlow();
    }

    async function countdown() {
      for (let i = 3; i; i--) {
        nsp.to(room).emit('countdown', i);
        await sleep(1000);
      }
    }

    async function start() {
      sleep(randint(300, 1000));
      while (info.time && info.timer) {
        createMole();
        await sleep(randint(100, 1000));
      }
    }

    function timeFlow() {
      info.timer = setInterval(() => {
        info.time -= 1;
        nsp.to(room).emit('time', info.time);
        if (info.time === 0) {
          gameEnd();
        }
      }, 1000);
    }

    // todo thread lock?
    function click(idx: number, x: number, y: number) {
      const me = socket.id === p1.id ? p1 : p2;
      if (board[y][x] === Cell.ACTIVE) {
        me.score += 1;
        socket.emit('click', 1);
        deleteMole(getIdx(idx, x, y));
      } else {
        me.score -= 1;
        socket.emit('click', -1);
      }
      nsp.to(p1.id).emit('score', p1.score, p2.score);
      nsp.to(p2.id).emit('score', p2.score, p1.score);
    }

    function createMole() {
      const idx = info.moleCnt;
      for (let t = 0; t < 5; t++) {  // 5회까지 실패 시 패스
        const w = randint(5, 15);
        const x = randint(0, 100 - w);
        const y = randint(0, 100 - w);
        if (!checkConflict(x, y, w)) {
          fillSquare(x, y, w, Cell.ACTIVE);
          nsp.to(room).emit('birth', idx, x, y, w);
          info.moles.push({ x, y, w });
          info.timeouts.push(setTimeout(() => {
            deleteMole(idx);
          }, 1000));
          info.moleCnt += 1;
          break;
        }
      }
    }

    function deleteMole(idx: number) {
      const { x, y, w } = info.moles[idx];
      fillSquare(x, y, w, Cell.DEAD);
      nsp.to(room).emit('death', idx);
      info.timeouts[idx] = setTimeout(() => {
        fillSquare(x, y, w, Cell.NONE);
      }, randint(500, 2000));
    }

    function checkConflict(x: number, y: number, w: number) {
      for (let i = y; i <= y + w; i++) {
        for (let j = x; j <= x + w; j++) {
          if (board[i][j] !== Cell.NONE) {
            return true;
          }
        }
      }
      return false;
    }

    function getIdx(idx: number, x: number, y: number) {
      const mole = info.moles[idx];
      if (
        mole.x <= x && x <= mole.x + mole.w &&
        mole.y <= y && y <= mole.y + mole.w
      ) {
        return idx;
      }
      for (let idx = info.moleCnt; idx < info.moles.length; idx++) {
        const mole = info.moles[idx];
        if (
          mole.x <= x && x <= mole.x + mole.w &&
          mole.y <= y && y <= mole.y + mole.w
        ) {
          return idx;
        }
      }
      return -1;  // todo except
    }

    function fillSquare(x: number, y: number, w: number, value: Cell) {
      for (let i = y; i <= y + w; i++) {
        for (let j = x; j <= x + w; j++) {
          board[i][j] = value;
        }
      }
    }

    function gameEnd() {
      nsp.to(p1.id).emit('score', p1.score, p2.score);
      nsp.to(p2.id).emit('score', p2.score, p1.score);
      nsp.to(p1.id).emit('end', p1.score > p2.score ? 'win' : p1.score < p2.score ? 'lose' : 'draw');
      nsp.to(p2.id).emit('end', p2.score > p1.score ? 'win' : p2.score < p1.score ? 'lose' : 'draw');
      closeRoom();
    }

    function closeRoom() {
      if (info.time) {
        clearInterval(info.time);
        info.time = null;
      }
      info.timeouts.forEach(x => clearTimeout(x));
      moleRooms.delete(room);
      rooms.delete(room);
      nsp.in(room).disconnectSockets();
    }
  });

  function getInitialState(): PlayBoard {
    return {
      p1: {
        id: null,
        score: 0,
      },
      p2: {
        id: null,
        score: 0,
      },
      info: {
        moles: [],
        moleCnt: 0,
        time: playTime,
        timer: null,
        timeouts: [],
      },
      board: Array(height).map(_ => Array(width).fill(0)),
    };
  }
}
