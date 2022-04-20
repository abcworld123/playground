let socket;
let timelimit, numlen, myAnswer, myTurn, cursor, timer;
let lineTemplate, myContainer, rivalContainer, divMyAnswer, tiles;
let resultText, timerText, turnText;

/*********  alert functions  ***********/

function alertConfig() {
  return Swal.fire({
    icon: 'info',
    title: '게임 구성',
    html: `<input type="text" id="timelimit" class="swal2-input" autocomplete="off" placeholder="제한 시간 (초)">
    <input type="text" id="numlen" class="swal2-input" autocomplete="off" placeholder="자릿수">`,
    allowOutsideClick: false,
    confirmButtonText: '확인',
    focusConfirm: false,
    allowEscapeKey: false,
    preConfirm: () => {
      const timelimit = Swal.getPopup().querySelector('#timelimit').value;
      const numlen = Swal.getPopup().querySelector('#numlen').value;
      const timelimit_int = parseInt(timelimit);
      const numlen_int = parseInt(numlen);
      if (!timelimit) {
        Swal.showValidationMessage('제한 시간을 설정해주세요.');
      } else if (!numlen) {
        Swal.showValidationMessage('자릿수를 설정해주세요.');
      } else if (timelimit_int != timelimit || numlen_int != numlen) {
        Swal.showValidationMessage('정수만 입력해주세요.');
      } else if (timelimit_int < 1 || 10000 < timelimit_int) {
        Swal.showValidationMessage('제한 시간은 1~10000 사이의 숫자로 입력해주세요.');
      } else if (numlen_int < 1 || 10 < numlen_int) {
        Swal.showValidationMessage('자릿수는 1~10 사이의 숫자로 입력해주세요.');
      }
      return { timelimit: timelimit_int, numlen: numlen_int };
    },
  });
}

function alertWaitConfig() {
  return Swal.fire({
    title: '방장이 게임을 구성하고 있습니다.',
    text: '잠시만 기다려 주세요...',
    imageUrl: '/images/games/wordle/loading.gif',
    imageWidth: 100,
    allowOutsideClick: false,
    showConfirmButton: false,
    allowEscapeKey: false,
  });
}

function alertSetNumber() {
  return Swal.fire({
    icon: 'info',
    title: '정답 숫자를 입력해 주세요.',
    input: 'text',
    allowOutsideClick: false,
    confirmButtonText: '확인',
    allowEscapeKey: false,
    preConfirm: (myAnswer) => {
      if (!myAnswer) {
        Swal.showValidationMessage('숫자를 입력해주세요.');
      } else if (parseInt(myAnswer) != myAnswer) {
        Swal.showValidationMessage('정수만 입력해주세요.');
      } else if (myAnswer.length !== numlen) {
        Swal.showValidationMessage(`숫자 ${numlen}자리를 입력해주세요.`);
      } else if (new Set(myAnswer).size !== numlen) {
        Swal.showValidationMessage(`중복 없이 입력해주세요.`);
      }
      return myAnswer;
    },
  });
}

function alertWaitSetNumber() {
  return Swal.fire({
    title: '상대방이 숫자를 정하고 있습니다.',
    text: '잠시만 기다려 주세요...',
    imageUrl: '/images/games/wordle/loading.gif',
    imageWidth: 100,
    allowOutsideClick: false,
    showConfirmButton: false,
    allowEscapeKey: false,
  });
}

function alertWin() {
  return Swal.fire({
    icon: 'success',
    title: '이겼습니다!!',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

function alertLose() {
  return Swal.fire({
    icon: 'error',
    title: '패배했습니다.',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

function alertDraw() {
  return Swal.fire({
    icon: 'info',
    title: '비겼습니다.',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

function alertUserLeft() {
  return Swal.fire({
    icon: 'warning',
    title: '상대방과 연결이 끊어졌습니다.',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}

/********  handling functions  **********/

function allEntered(isHost) {
  if (isHost) configRoom();
  else alertWaitConfig();
  socket.emit('all entered');
}

// [방장] 게임 구성
async function configRoom() {
  const { timelimit, numlen } = (await alertConfig()).value;
  socket.emit('room config', timelimit, numlen);
}

// [ALL] 게임 구성 완료
function configRoomComplete(_timeLimit, _numlen) {
  const container = document.getElementById('container');
  container.classList.add(`numlen-${_numlen}`);
  timelimit = _timeLimit;
  numlen = _numlen;
  templateInit();
  setNumber();
}

// [ALL] 숫자 정하기
async function setNumber() {
  myAnswer = (await alertSetNumber()).value;
  socket.emit('set number', myAnswer);
  alertWaitSetNumber();
}

// [ALL] 게임 시작
function start(isFirst) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  const myAnswerContainer = document.getElementById('myAnswerContainer');
  const users = document.getElementsByClassName('user');
  myContainer = users[+!isFirst];
  rivalContainer = users[+isFirst];
  myTurn = isFirst;
  myAnswerContainer.removeAttribute('style');
  toastText.innerHTML = `<b>${isFirst ? '선' : '후'}공</b>입니다.`;
  toast.classList.add('toast-shown');
  setTimeout(() => toast.classList.remove('toast-shown'), 4000);
  Swal.close();
  turn();
}

// [ALL] 한 턴씩 토글
function turn() {
  let sec = timelimit;
  timerText.innerText = sec;
  clearInterval(timer);
  if (myTurn) {
    addLine(myContainer);
    turnText.innerText = '내 차례입니다.';
    timerText.style.color = sec <= 10 ? 'red' : '#74bf76';
    turnText.style.color = '#74bf76';
    timer = setInterval(() => {
      timerText.innerText = --sec;
      if (!sec) {
        socket.emit('submit', null);
        tiles.forEach(tile => tile.classList.remove('tile-cur'));
      } else if (sec <= 10) {
        timerText.style.color = 'red';
      }
    }, 1000);
  } else {
    addLine(rivalContainer);
    turnText.innerText = '상대방의 차례입니다.';
    timerText.style.color = '#999';
    turnText.style.color = '#999';
    timer = setInterval(() => {
      timerText.innerText = --sec;
    }, 1000);
  }
}

// [ALL] 한 줄 결과 보여주기
function showResult(strike, ball) {
  if (strike || ball) {
    const spanStrike = `<span class="result-strike">${strike}S</span>`;
    const spanBall = `<span class="result-ball">${ball}B</span>`;
    resultText.innerHTML = spanStrike + spanBall;
  } else {
    const spanOut = `<span class="result-out">OUT</span>`;
    resultText.innerHTML = spanOut;
  }
  const success = strike == numlen;
  tiles.forEach((tile) => {
    const cls = tile.classList;
    if (success) cls.replace('tile-cur', 'tile-success') || cls.add('tile-success');
    else cls.remove('tile-cur');
  });
}

// [ALL] 게임 종료
function gameEnd(result, answer) {
  if (result === 'win') alertWin();
  else if (result === 'lose') alertLose(answer);
  else if (result === 'draw') alertDraw();
  clearInterval(timer);
  turnText.innerText = `정답: ${answer}`;
  timerText.style.color = '#999';
  turnText.style.color = '#bc6bc6';
  divMyAnswer.innerText = myAnswer;
  divMyAnswer.outerHTML = divMyAnswer.outerHTML + '';
}

// 칸 추가
function addLine(user) {
  const line = document.importNode(lineTemplate.content, true).children[0];
  tiles = [...line.getElementsByClassName('tile')];
  if (myTurn) tiles.forEach(tile => tile.classList.add('tile-cur'));
  user.appendChild(line);
  resultText = line.children[1];
  window.scrollTo(0, document.body.scrollHeight);
  cursor = 0;
}

// 상대방 키 입력 처리
function rivalKeydown(key) {
  if (key < 10) tiles[cursor++].innerText = key;
  else tiles[--cursor].innerText = '';
}

// line template
function templateInit() {
  const divTile = '<div class="tile"></div>';
  const tileContainer = lineTemplate.content.querySelector('.tile-container');
  tileContainer.innerHTML = divTile.repeat(numlen);
}

// keyboard listener
window.addEventListener('keydown', (e) => {
  if (!myTurn) return;
  if (parseInt(e.key) == e.key) {
    if (cursor < numlen) {
      tiles[cursor++].innerText = e.key;
      socket.emit('keydown', e.key);
    }
  } else if (e.code === 'Backspace') {
    e.preventDefault();
    if (cursor > 0) {
      tiles[--cursor].innerText = '';
      socket.emit('keydown', '100');
    }
  } else if (e.code === 'Enter') {
    if (cursor === numlen) {
      const ans = tiles.map(tile => tile.innerText).join('');
      socket.emit('submit', ans);
    }
  }
});

window.onload = () => {
  const room = document.getElementById('room').value;
  const isHost = document.getElementById('host').value === 'true';
  divMyAnswer = document.getElementById('myAnswer');
  lineTemplate = document.getElementById('lineTemplate');
  timerText = document.getElementById('timer');
  turnText = document.getElementById('turn');
  
  divMyAnswer.addEventListener('mouseenter', (e) => {
    divMyAnswer.innerText = myAnswer;
  });
  divMyAnswer.addEventListener('mouseleave', (e) => {
    divMyAnswer.innerText = '[ 확인하기 ]';
  });
  
  // socket.io
  socket = io(`/wordle/playboard?room=${room}`);
  
  socket.on('all entered', () => {
    allEntered(isHost);
  });
  socket.on('room config', (timeLimit, numlen) => {
    configRoomComplete(timeLimit, numlen);
  });
  socket.on('game start', (isFirst) => {
    start(isFirst);
  });
  socket.on('turn', () => {
    myTurn = !myTurn;
    turn();
  });
  socket.on('rival keydown', (key) => {
    rivalKeydown(key);
  });
  socket.on('result', (strike, ball) => {
    showResult(strike, ball);
  });
  socket.on('game end', (result, answer) => {
    gameEnd(result, answer);
  });
  socket.on('user leave', () => {
    clearInterval(timer);
    alertUserLeft();
  });
};
