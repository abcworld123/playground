import '@css/hockey/playboard.scss';
import { io } from 'socket.io-client';
const socket = io('/hockeyPlay');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//canvas에 관한 정보
const play_ball_radius = 10;
const canvas = document.querySelector('canvas');
const playBoard = canvas.getContext('2d');
const WIDTH = canvas.offsetWidth;
const HEIGHT = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let roomNum = window.location.href.split('/')[4];
socket.emit('connection', roomNum);

window.addEventListener('keypress', togleDirection);

socket.on('countDown', async (nowPlay) => {
  await countDown(nowPlay);
});

socket.on('timeFlow', () => {
  const timeHtml = document.querySelector<div>('.playboard_time_area');
  let nowTime = Number(timeHtml.innerHTML.trim());
  nowTime -= 1
  timeHtml.innerHTML = nowTime < 0 ? "Golden Goal!!" : String(nowTime);
});

socket.on('playboard', (player1_x, player1_y, player2_x, player2_y, play_ball_x, play_ball_y, player1_score, player2_score) => {
  document.querySelector<div>('.playboard_play1_goal').style.display = 'none';
  document.querySelector<div>('.playboard_play2_goal').style.display = 'none';
  screenClear();
  screenDrawPlayer(Number(player1_x * WIDTH / 1000), Number(player1_y * HEIGHT / 500), 20 * HEIGHT / 100);
  screenDrawPlayer(Number(player2_x * WIDTH / 1000), Number(player2_y * HEIGHT / 500), 20 * HEIGHT / 100);
  screenDrawBall(Number(play_ball_x * WIDTH / 1000), Number(play_ball_y * HEIGHT / 500));
  document.querySelector<div>('.playboard_red_score').innerHTML = player1_score;
  document.querySelector<div>('.playboard_blue_scord').innerHTML = player2_score;
});

socket.on('player1_goal', () => {
  document.querySelector<div>('.playboard_play1_goal').style.display = 'block';
});

socket.on('player2_goal', () => {
  document.querySelector<div>('.playboard_play2_goal').style.display = 'block';
});

socket.on('gameSet', (winner) => {
  document.querySelector<div>('.modal').style.display = 'flex';
  document.querySelector<div>('.hockey_modal_winner_text').style.color = winner == "1" ? '#b23c3c' : '#333399';
  document.querySelector<div>('.hockey_modal_winner_text').innerHTML = winner + "P";
  document.querySelector<div>('.hockey_modal_btn').addEventListener('click', function () {
    location.replace('/')
  })
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
// w, s는 player_1 조종
// 8, 2는 player_2 조종
function togleDirection(e: KeyboardEvent) {
  if (e.keyCode === 119) {
    // w 클릭
    socket.emit('moveUp', roomNum);
  } else if (e.keyCode === 115) {
    // s 클릭
    socket.emit('moveDown', roomNum);
  }
}
