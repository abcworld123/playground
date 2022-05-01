const socket = io('/hockeyPlay');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

  window.addEventListener("keypress", togleDirection);

  playBoard = document.getElementById('canvas').getContext('2d');


  socket.onAny((event, msg1, msg2) => {
    // console.log(event, msg1, msg2);
  });

  socket.on('3', async () => {
    await countDown();
  });


  socket.on('playboard', (a, b, c, d, e, f, g, h) => {
    document.getElementsByClassName('test_obj')[0].style.display = 'none';
    document.getElementsByClassName('test_obj2')[0].style.display = 'none';
    WIDTH = document.querySelector('.playboard_canvas_area').offsetWidth;
    HEIGHT = document.querySelector('.playboard_canvas_area').offsetHeight;
    document.querySelector('#canvas').width = WIDTH;
    document.querySelector('#canvas').height = HEIGHT;
    screenClear();
    screenDrawPlayer(Number(a * WIDTH / 100), Number(b * HEIGHT / 100), 20 * HEIGHT / 100);
    screenDrawPlayer(Number(c * WIDTH / 100), Number(d * HEIGHT / 100), 20 * HEIGHT / 100);
    screenDrawBall(Number(e * WIDTH / 100), Number(f * HEIGHT / 100));
    document.getElementsByClassName('playboard_red_score')[0].innerHTML = g;
    document.getElementsByClassName('playboard_blue_scord')[0].innerHTML = h;

    player1_x = a;
    player1_y = b;

    player2_x = c;
    player2_y = d;

    play_ball_x = e;
    play_ball_y = f;

    // playAction = window.requestAnimationFrame(draw)

  });

  socket.on('timeFlow', () => {
    const timeHtml = document.getElementsByClassName('playboard_time_area')[0];
    const nowTime = Number(timeHtml.innerHTML.trim());
    timeHtml.innerHTML = String(nowTime - 1);
  });

  socket.on('player1_goal', () => {
    document.getElementsByClassName('test_obj')[0].style.display = 'block';
  });

  socket.on('player2_goal', () => {
    document.getElementsByClassName('test_obj2')[0].style.display = 'block';
  });

  // gameStart()
});

async function countDown() {
  document.getElementsByClassName('test_obj')[0].style.display = 'none';
  document.getElementsByClassName('test_obj2')[0].style.display = 'none';
  const abcworld = document.getElementById('abcworld').children;
  for (let x = 0; x < 3; x++) {
    console.log(x, abcworld[x]);
    abcworld[x].style.visibility = 'visible';
    abcworld[x].classList.add('bbb');
    await sleep(1000);
    abcworld[x].classList.remove('bbb');
    abcworld[x].style.visibility = 'hidden';
  }
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
  }
}
