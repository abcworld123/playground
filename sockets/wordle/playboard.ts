import { wordleRooms } from 'modules/rooms';
import type { Namespace } from 'socket.io';

export default function initWordleBoard(nsp: Namespace) {
  const answers = new Map();
  const ended = new Map();
  const turns = new Map();
  const rooms = nsp.adapter.rooms;

  nsp.on('connection', (socket) => {
    const room = socket.handshake.query.room as string;
    let rival: string;
    init();

    socket.on('all entered', () => {
      rival = [...rooms.get(room)].filter(x => x !== socket.id)[0];
    });

    socket.on('room config', (timelimit: number, numlen: number) => {
      nsp.to(room).emit('room config', timelimit, numlen);
    });

    socket.on('set number', (num: string) => {
      setNumber(num);
    });

    socket.on('keydown', (key: string) => {
      nsp.to(rival).emit('rival keydown', key);
    });

    socket.on('submit', (num: string) => {
      submit(num);
    });

    socket.on('disconnect', (reason) => {
      disconnectUser();
    });

    function init() {
      socket.join(room);
      if (rooms.get(room).size === 2) {
        ended.set(room, [false, false]);
        turns.set(room, 0);
        nsp.to(room).emit('all entered');
      }
    }

    function setNumber(num: string) {
      answers.set(rival, num);
      if (answers.has(socket.id)) {
        const isFirst = Math.random() < 0.5;
        socket.emit('game start', isFirst);
        nsp.to(rival).emit('game start', !isFirst);
      }
    }

    function submit(num: string) {
      const win = ended.get(room);
      const turn = turns.get(room);
      scoring(win, turn, num);
      handleTurn(win, turn);
    }

    function scoring(win: [boolean, boolean], turn: number, num: string) {
      if (num) {
        let strike = 0, ball = 0;
        const ans = answers.get(socket.id);
        for (let i = 0; i < num.length; i++) {
          if (ans[i] === num[i]) strike++;
          else if (ans.includes(num[i])) ball++;
        }
        if (strike === num.length) win[turn] = true;
        nsp.to(room).emit('result', strike, ball);
      }
    }

    function handleTurn(win: [boolean, boolean], turn: number) {
      if (turn === 1 && (win[0] || win[1])) {
        if (win[0] && win[1]) {
          socket.emit('game end', 'draw', answers.get(socket.id));
          nsp.to(rival).emit('game end', 'draw', answers.get(rival));
        } else {
          socket.emit('game end', win[1] ? 'win' : 'lose', answers.get(socket.id));
          nsp.to(rival).emit('game end', win[0] ? 'win' : 'lose', answers.get(rival));
        }
        closeRoom();
      } else {
        turns.set(room, turn ^ 1);
        nsp.to(room).emit('turn');
      }
    }

    function closeRoom() {
      wordleRooms.delete(room);
      nsp.in(room).disconnectSockets();
      turns.delete(room);
      ended.delete(room);
    }

    function disconnectUser() {
      answers.delete(socket.id);
      if (wordleRooms.has(room)) {
        nsp.to(room).emit('user leave');
        closeRoom();
      }
    }
  });
}
