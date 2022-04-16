const socket = io('/hockeyPlay');


//canvas에 관한 정보
let playBoard;
let playAction;
let WIDTH = 0;
let HEIGHT = 0;

// player 1 에관한 정보
let player1_x = 200;
let player1_y = 150;
let player1_dy = 4;
const player1_y_speed = 4;
const player1_high = 100;

// player 2 에관한 정보
let player2_x = 1750;
let player2_y = 250;
let player2_dy = 4;
const player2_y_speed = 4;
const player2_high = 100;

// 공에 대한 정보
let play_ball_x = 200;
let play_ball_y = 200;
let play_ball_dx = 4;
let play_ball_dy = 8;
const play_ball_radius = 10;
let play_ball_pause = 0;

let roomNum = "";

//todo 클래스 변경
window.addEventListener("load", function () {
  roomNum = window.location.href.split("/")[4];
  socket.emit('connection', roomNum);

  document.querySelector('#canvas').width = document.querySelector('#canvas').offsetWidth;
  document.querySelector('#canvas').height = document.querySelector('#canvas').offsetHeight;
  WIDTH = document.querySelector('#canvas').offsetWidth;
  HEIGHT = document.querySelector('#canvas').offsetHeight;
  console.log(WIDTH);
  console.log(HEIGHT);

  window.addEventListener("keypress", togleDirection);

  playBoard = document.getElementById('canvas').getContext('2d');


  socket.onAny((event, msg1, msg2) => {
    // console.log(event, msg1, msg2);
  });

  socket.on('playboard', (a, b, c, d, e, f) => {
    WIDTH = document.querySelector('.playboard_canvas_area').offsetWidth;
    HEIGHT = document.querySelector('.playboard_canvas_area').offsetHeight;
    screenClear();
    screenDrawPlayer(Number(a * WIDTH / 100), Number(b * HEIGHT / 100), 20 * HEIGHT / 100);
    screenDrawPlayer(Number(c * WIDTH / 100), Number(d * HEIGHT / 100), 20 * HEIGHT / 100);
    screenDrawBall(Number(e * WIDTH / 100), Number(f * HEIGHT / 100));
    player1_x = a;
    player1_y = b;

    player2_x = c;
    player2_y = d;

    play_ball_x = e;
    play_ball_y = f;

    // playAction = window.requestAnimationFrame(draw)

  });

  // gameStart()
});

// html에 있는 canvas 영역을 받아오고 함수 실행
function gameStart() {
  playBoard = document.getElementById('canvas').getContext('2d');

  playAction = window.requestAnimationFrame(draw);
}

// 화면 지우기 => 플레이어 및 공 그리기 => 충돌 검사 식으로 진행
//todo 벽에 박으면 멈추게
// crush를 그냥 전체 함수 안에 두기
function draw() {
  document.querySelector('.playboard_canvas_area').width = document.querySelector('#canvas').offsetWidth;
  document.querySelector('.playboard_canvas_area').height = document.querySelector('#canvas').offsetHeight;
  WIDTH = document.querySelector('.playboard_canvas_area').offsetWidth;
  HEIGHT = document.querySelector('.playboard_canvas_area').offsetHeight;

  screenClear();
  screenDrawPlayer(player1_x, player1_y, player1_high);
  screenDrawPlayer(player2_x, player2_y, player1_high);
  screenDrawBall(play_ball_x, play_ball_y);

  player1_y += player1_dy;
  player2_y += player2_dy;
  play_ball_x += play_ball_dx;
  play_ball_y += play_ball_dy;
  play_ball_pause = play_ball_pause < 1 ? play_ball_pause : play_ball_pause - 1;

  if ( player1_y >= HEIGHT - player1_high || player1_y <= 0) {player1_dy = 0; }
  if ( player2_y >= HEIGHT - player2_high || player2_y <= 0) {player2_dy = 0; }
  if ((play_ball_x >= WIDTH - play_ball_radius || play_ball_x <= play_ball_radius) && play_ball_pause < 1 ) {
    play_ball_dx = -play_ball_dx;
  }
  if ( play_ball_y >= HEIGHT - play_ball_radius || play_ball_y <= play_ball_radius) {
    play_ball_dy = -play_ball_dy;
  }

  checkCrash();

  playAction = window.requestAnimationFrame(draw);
}

// canvas를 지우는 함수
function screenClear() {
  console.log(WIDTH, HEIGHT);
  playBoard.clearRect(0, 0, WIDTH, HEIGHT);
}

// 플레이어 (직사각형)을 그리는 함수
// x : x좌표
// y : y좌표
// h : 직사각형의 넓이
// 넓이는 10으로 고정
function screenDrawPlayer(x, y, h) {
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
function screenDrawBall(x, y) {
  playBoard.fillStyle = 'rgb(33,40,33)';
  playBoard.beginPath();
  playBoard.arc(x, y, play_ball_radius, 0, Math.PI * 2, true);
  playBoard.closePath();
  playBoard.fill();
}

// 키보드 입력 함수
// w, s는 player_1 조종
// 8, 2는 player_2 조종
function togleDirection(e) {
  if (e.keyCode === 119) {
    // w 클릭
    socket.emit('moveUp', roomNum);
  } else if (e.keyCode === 115) {
    // s 클릭
    socket.emit('moveDown', roomNum);
  } else if (e.keyCode === 56) {
    // 8 클릭
    player2_dy = -player2_y_speed;
  } else if (e.keyCode === 50) {
    // 2 클릭
    player2_dy = player2_y_speed;
  }
}

// player에 충돌이 일어났는지 검사
//todo 중심부 => 모든 영역
function checkCrash() {
  if (player1_x < play_ball_x && play_ball_x < player1_x + 10 && player1_y < play_ball_y && play_ball_y < player1_y + player1_high) {
    play_ball_dx *= -1;
    play_ball_pause = 10;
  } else if (player2_x < play_ball_x && play_ball_x < player2_x + 10 && player2_y < play_ball_y && play_ball_y < player2_y + player2_high) {
    play_ball_dx *= -1;
    play_ball_pause = 10;
  }
}
