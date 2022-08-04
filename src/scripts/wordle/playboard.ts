import 'styles/wordle/playboard.scss';
import 'animate.css';
import Swal from 'sweetalert2';
import { imgGear } from 'images/common';
import { shakeOutsideClick } from 'utils/alerts';
import { io } from 'utils/socket';

let myTurn: boolean;
let myAnswer: string;
let timer: NodeJS.Timer;
let [timelimit, numlen, cursor]: number[] = [];
let [myContainer, rivalContainer, resultText]: div[] = [];
let tiles: div[];

const room = (<input>document.getElementById('room')).value;
const isHost = (<input>document.getElementById('host')).value === 'true';
const lineTemplate = <template>document.getElementById('lineTemplate');
const divMyAnswer = <div>document.getElementById('myAnswer');
const timerText = <div>document.getElementById('timer');
const turnText = <div>document.getElementById('turn');

/* ********  alert functions  ********** */

function alertConfig() {
  return Swal.fire({
    icon: 'info',
    title: '게임 구성',
    html: `<input type="text" class="swal2-input" autocomplete="off" placeholder="제한 시간 (초)">
    <input type="text" class="swal2-input" autocomplete="off" placeholder="자릿수">`,
    allowOutsideClick: shakeOutsideClick,
    confirmButtonText: '확인',
    focusConfirm: false,
    allowEscapeKey: false,
    backdrop: true,
    preConfirm: () => {
      const inputs = Swal.getPopup().querySelectorAll('input');
      let timelimit: string | number = inputs[0].value;
      let numlen: string | number = inputs[1].value;
      if (!timelimit) {
        Swal.showValidationMessage('제한 시간을 설정해주세요.');
      } else if (!numlen) {
        Swal.showValidationMessage('자릿수를 설정해주세요.');
      } else if (!/^\d+$/.test(timelimit) || !/^\d+$/.test(numlen)) {
        Swal.showValidationMessage('정수만 입력해주세요.');
      }
      timelimit = parseInt(timelimit);
      numlen = parseInt(numlen);
      if (timelimit < 1 || 10000 < timelimit) {
        Swal.showValidationMessage('제한 시간은 1~10000 사이의 숫자로 입력해주세요.');
      } else if (numlen < 1 || 6 < numlen) {
        Swal.showValidationMessage('자릿수는 1~6 사이의 숫자로 입력해주세요.');
      }
      return { timelimit, numlen };
    },
  });
}

function alertWaitConfig() {
  return Swal.fire({
    title: '방장이 게임을 구성하고 있습니다.',
    text: '잠시만 기다려 주세요...',
    imageUrl: imgGear,
    imageWidth: 100,
    allowOutsideClick: shakeOutsideClick,
    showConfirmButton: false,
    allowEscapeKey: false,
    backdrop: true,
  });
}

function alertSetNumber() {
  return Swal.fire({
    icon: 'info',
    title: '정답 숫자를 입력해 주세요.',
    input: 'text',
    allowOutsideClick: shakeOutsideClick,
    confirmButtonText: '확인',
    allowEscapeKey: false,
    backdrop: true,
    preConfirm: (myAnswer: string) => {
      if (!myAnswer) {
        Swal.showValidationMessage('숫자를 입력해주세요.');
      } else if (myAnswer.length !== numlen) {
        Swal.showValidationMessage(`숫자 ${numlen}자리를 입력해주세요.`);
      } else if (!/^\d+$/.test(myAnswer)) {
        Swal.showValidationMessage('정수만 입력해주세요.');
      } else if (new Set(myAnswer).size !== numlen) {
        Swal.showValidationMessage('중복 없이 입력해주세요.');
      }
      return myAnswer;
    },
  });
}

function alertWaitSetNumber() {
  return Swal.fire({
    title: '상대방이 숫자를 정하고 있습니다.',
    text: '잠시만 기다려 주세요...',
    imageUrl: imgGear,
    imageWidth: 150,
    allowOutsideClick: shakeOutsideClick,
    showConfirmButton: false,
    allowEscapeKey: false,
    backdrop: true,
  });
}

function alertWin() {
  return Swal.fire({
    icon: 'success',
    title: '이겼습니다!!',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
  });
}

function alertLose() {
  return Swal.fire({
    icon: 'error',
    title: '패배했습니다.',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
  });
}

function alertDraw() {
  return Swal.fire({
    icon: 'info',
    title: '비겼습니다.',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
  });
}

function alertUserLeft() {
  return Swal.fire({
    icon: 'warning',
    title: '상대방과 연결이 끊어졌습니다.',
    confirmButtonText: '확인',
    allowOutsideClick: false,
    allowEscapeKey: false,
    backdrop: true,
  });
}

/* *******  handling functions  ********* */

function allEntered(isHost: boolean) {
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
function configRoomComplete(_timeLimit: number, _numlen: number) {
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
function start(isFirst: boolean) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  const myAnswerContainer = document.getElementById('myAnswerContainer');
  const users = document.querySelectorAll<div>('.user');
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
  timerText.innerText = String(sec);
  clearInterval(timer);
  if (myTurn) {
    addLine(myContainer);
    turnText.innerText = '내 차례입니다.';
    timerText.style.color = sec <= 10 ? 'red' : '#74bf76';
    turnText.style.color = '#74bf76';
    timer = setInterval(() => {
      timerText.innerText = String(--sec);
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
      timerText.innerText = String(--sec);
    }, 1000);
  }
}

// [ALL] 한 줄 결과 보여주기
function showResult(strike: number, ball: number) {
  if (strike || ball) {
    const spanStrike = `<span class="result-strike">${strike}S</span>`;
    const spanBall = `<span class="result-ball">${ball}B</span>`;
    resultText.innerHTML = spanStrike + spanBall;
  } else {
    const spanOut = '<span class="result-out">OUT</span>';
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
function gameEnd(result: string, answer: string) {
  if (result === 'win') alertWin();
  else if (result === 'lose') alertLose();
  else if (result === 'draw') alertDraw();
  clearInterval(timer);
  turnText.innerText = `정답: ${answer}`;
  timerText.style.color = '#999';
  turnText.style.color = '#bc6bc6';
  divMyAnswer.innerText = myAnswer;
  divMyAnswer.outerHTML = divMyAnswer.outerHTML + '';
}

// 칸 추가
function addLine(user: div) {
  const line = document.importNode(lineTemplate.content, true).children[0];
  tiles = [...line.querySelectorAll<div>('.tile')];
  if (myTurn) tiles.forEach(tile => tile.classList.add('tile-cur'));
  user.appendChild(line);
  resultText = <div>line.children[1];
  window.scrollTo(0, document.body.scrollHeight);
  cursor = 0;
}

// 상대방 키 입력 처리
function rivalKeydown(key: string) {
  if (key <= '9') tiles[cursor++].innerText = key;
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
  if ('0' <= e.key && e.key <= '9') {
    if (cursor < numlen) {
      tiles[cursor++].innerText = e.key;
      socket.emit('keydown', e.key);
    }
  } else if (e.code === 'Backspace') {
    e.preventDefault();
    if (cursor > 0) {
      tiles[--cursor].innerText = '';
      socket.emit('keydown', 'b');
    }
  } else if (e.code === 'Enter') {
    if (cursor === numlen) {
      const ans = tiles.map(tile => tile.innerText).join('');
      socket.emit('submit', ans);
    }
  }
});

divMyAnswer.addEventListener('mouseenter', (e) => {
  divMyAnswer.innerText = myAnswer;
});
divMyAnswer.addEventListener('mouseleave', (e) => {
  divMyAnswer.innerText = '[ 확인하기 ]';
});

// socket.io
const socket = io(`/wordle/playboard?room=${room}`);

socket.on('all entered', () => {
  allEntered(isHost);
});
socket.on('room config', (timeLimit: number, numlen: number) => {
  configRoomComplete(timeLimit, numlen);
});
socket.on('game start', (isFirst: boolean) => {
  start(isFirst);
});
socket.on('turn', () => {
  myTurn = !myTurn;
  turn();
});
socket.on('rival keydown', (key: string) => {
  rivalKeydown(key);
});
socket.on('result', (strike: number, ball: number) => {
  showResult(strike, ball);
});
socket.on('game end', (result: string, answer: string) => {
  gameEnd(result, answer);
});
socket.on('user leave', () => {
  clearInterval(timer);
  alertUserLeft();
});

socket.connect();
