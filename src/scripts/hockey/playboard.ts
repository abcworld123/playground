import 'styles/hockey/playboard.scss';
import { io } from 'socket.io-client';
const socket = io('/hockeyPlay');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//canvas에 관한 정보
const p1_x = 100;
const p2_x = 900;
const play_ball_radius = 10;
const canvas = document.querySelector('canvas');
const playBoard = canvas.getContext('2d');
const WIDTH = canvas.offsetWidth;
const HEIGHT = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const roomNum = window.location.href.split('/')[4];
socket.emit('connection', roomNum);

window.addEventListener('keypress', togleDirection);

socket.on('countDown', (nowPlay) => {
  countDown(nowPlay);
});

socket.on('timeFlow', () => {
  const timeHtml = document.querySelector<div>('.playboard_time_area');
  let nowTime = Number(timeHtml.innerHTML.trim());
  nowTime -= 1;
  timeHtml.innerHTML = nowTime < 0 ? 'Golden Goal!!' : String(nowTime);
});

socket.on('playboard', (p1_y, p2_y, ball_x, ball_y) => {
  document.querySelector<div>('.playboard_play1_goal').style.display = 'none';
  document.querySelector<div>('.playboard_play2_goal').style.display = 'none';
  screenClear();
  screenDrawPlayer(Number(p1_x * WIDTH / 1000), Number(p1_y * HEIGHT / 500), 20 * HEIGHT / 100);
  screenDrawPlayer(Number(p2_x * WIDTH / 1000), Number(p2_y * HEIGHT / 500), 20 * HEIGHT / 100);
  screenDrawBall(Number(ball_x * WIDTH / 1000), Number(ball_y * HEIGHT / 500));
});

socket.on('goal', (player, score) => {
  const color = player === 1 ? 'red' : 'blue';
  document.querySelector<div>(`.playboard_play${player}_goal`).style.display = 'block';
  document.querySelector<div>(`.playboard_${color}_score`).innerHTML = score;
});

socket.on('gameSet', (winner) => {
  document.querySelector<div>('.modal').style.display = 'flex';
  document.querySelector<div>('.hockey_modal_winner_text').style.color = winner == '1' ? '#b23c3c' : '#333399';
  document.querySelector<div>('.hockey_modal_winner_text').innerHTML = winner + 'P';
  document.querySelector<div>('.hockey_modal_btn').addEventListener('click', function () {
    location.replace('/');
  });
});

async function countDown(nowPlay) {
  if (nowPlay === 1) {
    document.querySelector<div>('.playboard_play1_port').style.display = 'block';
  } else {
    document.querySelector<div>('.playboard_play2_port').style.display = 'block';
  }
  document.querySelector<div>('.playboard_play1_goal').style.display = 'none';
  document.querySelector<div>('.playboard_play2_goal').style.display = 'none';
  const countDown = <HTMLCollectionOf<div>>document.getElementById('countDown').children;
  for (let x = 0; x < 3; x++) {
    console.log(x, countDown[x]);
    countDown[x].style.visibility = 'visible';
    countDown[x].classList.add('playboard_after_count');
    await sleep(1000);
    countDown[x].classList.remove('playboard_after_count');
    countDown[x].style.visibility = 'hidden';
  }

  document.querySelector<div>('.playboard_play1_port').style.display = 'none';
  document.querySelector<div>('.playboard_play2_port').style.display = 'none';

}

// canvas를 지우는 함수
function screenClear() {
  playBoard.clearRect(0, 0, WIDTH, HEIGHT);
}

// 플레이어 (직사각형)을 그리는 함수
// x : x좌표
// y : y좌표
// h : 직사각형의 넓이
// 넓이는 10으로 고정
function screenDrawPlayer(x: number, y: number, h: number) {
  playBoard.fillStyle = '#334ea4';
  playBoard.beginPath();
  playBoard.fillRect(x, y, 10, h);
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
  playBoard.arc(x, y, play_ball_radius, 0, Math.PI * 2, true);
  playBoard.closePath();
  playBoard.fill();
}

// 키보드 입력 함수
// w, s로 조종
function togleDirection(e: KeyboardEvent) {
  if (e.key === 'w') {
    socket.emit('moveUp');
  } else if (e.key === 's') {
    socket.emit('moveDown');
  }
}
