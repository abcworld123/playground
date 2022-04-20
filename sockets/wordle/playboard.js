const allRooms = require('#modules/wordle/m_wordle').allRooms;

module.exports = function (nsp) {
  const answers = new Map();
  const ended = new Map();
  const turns = new Map();
  const rooms = nsp.adapter.rooms;
  
  nsp.on('connection', (socket) => {
    const room = socket.handshake.query.room;
    let rival;
    init();
    
    function init() {
      socket.join(room);
      if (rooms.get(room).size === 2) {
        ended.set(room, [false, false]);
        turns.set(room, 0);
        nsp.to(room).emit('all entered');
      }
    }
    
    function setNumber(num) {
      answers.set(rival, num);
      if (answers.has(socket.id)) {
        const isFirst = Math.random() < 0.5;
        socket.emit('game start', isFirst);
        nsp.to(rival).emit('game start', !isFirst);
      }
    }
    
    // todo 패배했을 경우 상대방 정답 공개?
    function submit(num) {
      const win = ended.get(room);
      const turn = turns.get(room);
      scoring(win, turn, num);
      handleTurn(win, turn);
    }
    
    function scoring(win, turn, num) {
      if (num) {
        let strike = 0, ball = 0;
        const ans = answers.get(socket.id);
        for (let i = 0; i < num.length; i++) {
          if (ans[i] === num[i]) strike++;
          else if (ans.includes(num[i])) ball++;
        }
        if (strike === num.length) win[turn] = true;
        socket.emit('result', strike, ball);
      }
    }
    
    function handleTurn(win, turn) {
      if (turn === 1 && (win[0] || win[1])) {
        if (win[0] && win[1]) {
          nsp.to(room).emit('game end', 'draw');
        } else {
          socket.emit('game end', win[1] ? 'win' : 'lose');
          nsp.to(rival).emit('game end', win[0] ? 'win' : 'lose');
        }
        closeRoom();
      } else {
        turns.set(room, turn ^ 1);
        nsp.to(room).emit('turn');
      }
    }
    
    function closeRoom() {
      allRooms.delete(room);
      nsp.in(room).disconnectSockets();
      turns.delete(room);
      ended.delete(room);
    }
    
    function disconnectUser() {
      answers.delete(socket.id);
      if (allRooms.has(room)) {
        nsp.to(room).emit('user leave');
        closeRoom();
      }
    }
    
    socket.on('all entered', () => {
      rival = [...rooms.get(room)].filter(x => x !== socket.id)[0];
    });
    
    socket.on('room config', (timelimit, numlen) => {
      nsp.to(room).emit('room config', timelimit, numlen);
    });
    
    socket.on('set number', (num) => {
      setNumber(num);
    });
    
    socket.on('submit', (num) => {
      submit(num);
    });
    
    socket.on('disconnect', (reason) => {
      disconnectUser();
    });
  });
};
