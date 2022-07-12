import 'styles/hockey/playboard.scss';
import { io } from 'socket.io-client';
import { sleep } from 'utils/tools';

const socket = io('/hockeyPlay', { transports: ['websocket'] });

//canvas에 관한 정보
const p1 = { x: 100, y: 0 };
const p2 = { x: 900, y: 0 };
const ball = { x: 0, y: 0 };
const canvas = document.querySelector('canvas');
const playBoard = canvas.getContext('2d');
let sizeUnit = canvas.offsetHeight / 75;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let movable = false;
let dir = '';

const roomNum = window.location.href.split('/')[4];
socket.emit('connection', roomNum);

window.addEventListener('keypress', togleDirection);
window.addEventListener('resize', resizeCanvas);

socket.on('countDown', (nowPlay: number) => {
  countDown(nowPlay);
  dir = '';
});

socket.on('timeFlow', () => {
  const timeHtml = document.querySelector<div>('.playboard_time_area');
  let nowTime = Number(timeHtml.innerHTML.trim());
  nowTime -= 1;
  timeHtml.innerHTML = nowTime < 0 ? 'Golden Goal!!' : String(nowTime);
});

socket.on('playboard', (p1_y: number, p2_y: number, ball_x: number, ball_y: number) => {
  p1.y = p1_y;
  p2.y = p2_y;
  ball.x = ball_x;
  ball.y = ball_y;
  document.querySelector<div>('.playboard_play1_goal').style.display = 'none';
  document.querySelector<div>('.playboard_play2_goal').style.display = 'none';
  draw();
});

socket.on('goal', (player: number, score: number) => {
  const color = player === 1 ? 'red' : 'blue';
  document.querySelector<div>(`.playboard_play${player}_goal`).style.display = 'grid';
  document.querySelector<div>(`.playboard_${color}_score`).innerHTML = String(score);
  movable = false;
});

socket.on('gameSet', (winner: string) => {
  document.querySelector<div>('.modal').style.display = 'flex';
  document.querySelector<div>('.hockey_modal_winner_text').style.color = winner == '1' ? '#b23c3c' : '#333399';
  document.querySelector<div>('.hockey_modal_winner_text').innerHTML = winner + 'P';
  document.querySelector<div>('.hockey_modal_btn').addEventListener('click', function () {
    location.replace('/');
  });
  movable = false;
});

async function countDown(nowPlay: number) {
  if (nowPlay === 1) {
    document.querySelector<div>('.playboard_play1_port').style.display = 'block';
  } else {
    document.querySelector<div>('.playboard_play2_port').style.display = 'block';
  }
  document.querySelector<div>('.playboard_play1_goal').style.display = 'none';
  document.querySelector<div>('.playboard_play2_goal').style.display = 'none';
  const countDown = <HTMLCollectionOf<div>>document.getElementById('countDown').children;
  for (let x = 0; x < 3; x++) {
    countDown[x].style.visibility = 'visible';
    countDown[x].classList.add('playboard_after_count');
    await sleep(1000);
    countDown[x].classList.remove('playboard_after_count');
    countDown[x].style.visibility = 'hidden';
  }
  movable = true;
  document.querySelector<div>('.playboard_play1_port').style.display = 'none';
  document.querySelector<div>('.playboard_play2_port').style.display = 'none';

}

function draw() {
  screenClear();
  screenDrawPlayer(Number(p1.x * canvas.width / 1000), Number(p1.y * canvas.height / 500), 20 * canvas.height / 100);
  screenDrawPlayer(Number(p2.x * canvas.width / 1000), Number(p2.y * canvas.height / 500), 20 * canvas.height / 100);
  screenDrawBall(Number(ball.x * canvas.width / 1000), Number(ball.y * canvas.height / 500));
}

// canvas를 지우는 함수
function screenClear() {
  playBoard.clearRect(0, 0, canvas.width, canvas.height);
}

// 플레이어 (직사각형)을 그리는 함수
// x : x좌표
// y : y좌표
// h : 직사각형의 넓이
// 넓이는 10으로 고정
function screenDrawPlayer(x: number, y: number, h: number) {
  playBoard.fillStyle = '#334ea4';
  playBoard.beginPath();
  playBoard.fillRect(x, y, sizeUnit, h);
  playBoard.closePath();
  playBoard.fill();
}

// 공 (원)을 그리는 함수
// x : x좌표
// y : y좌표
// 넓이는 play_ball_radius 으로 고정
function screenDrawBall(x: number, y: number) {
  playBoard.fillStyle = '#382741';
  playBoard.beginPath();
  playBoard.arc(x, y, sizeUnit, 0, Math.PI * 2, true);
  playBoard.closePath();
  playBoard.fill();
}

// 키보드 입력 함수
// w, s로 조종
function togleDirection(e: KeyboardEvent) {
  if (!movable) return;
  if (e.key === 'w' && dir !== 'w') {
    socket.emit('moveUp');
    dir = 'w';
  } else if (e.key === 's' && dir !== 's') {
    socket.emit('moveDown');
    dir = 's';
  }
}

function resizeCanvas(e: UIEvent) {
  sizeUnit = canvas.offsetHeight / 75;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  draw();
}
