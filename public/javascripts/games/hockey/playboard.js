const socket = io('/hockeyPlay');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//canvas에 관한 정보
let playBoard;
let WIDTH = 0;
let HEIGHT = 0;
const play_ball_radius = 10;

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

  socket.on('countDown', async () => {
    await countDown();
  });


  socket.on('playboard', (player1_x, player1_y, player2_x, player2_y, play_ball_x, play_ball_y, player1_score, player2_score) => {
    document.getElementsByClassName('playboard_play1_goal')[0].style.display = 'none';
    document.getElementsByClassName('playboard_play2_goal')[0].style.display = 'none';
    WIDTH = document.querySelector('.playboard_canvas_area').offsetWidth;
    HEIGHT = document.querySelector('.playboard_canvas_area').offsetHeight;
    document.querySelector('#canvas').width = WIDTH;
    document.querySelector('#canvas').height = HEIGHT;
    screenClear();
    screenDrawPlayer(Number(player1_x * WIDTH / 1000), Number(player1_y * HEIGHT / 500), 20 * HEIGHT / 100);
    screenDrawPlayer(Number(player2_x * WIDTH / 1000), Number(player2_y * HEIGHT / 500), 20 * HEIGHT / 100);
    screenDrawBall(Number(play_ball_x * WIDTH / 1000), Number(play_ball_y * HEIGHT / 500));
    document.getElementsByClassName('playboard_red_score')[0].innerHTML = player1_score;
    document.getElementsByClassName('playboard_blue_scord')[0].innerHTML = player2_score;
  });

  socket.on('timeFlow', () => {
    const timeHtml = document.getElementsByClassName('playboard_time_area')[0];
    const nowTime = Number(timeHtml.innerHTML.trim());
    timeHtml.innerHTML = String(nowTime - 1);
  });

  socket.on('player1_goal', () => {
    document.getElementsByClassName('playboard_play1_goal')[0].style.display = 'block';
  });

  socket.on('player2_goal', () => {
    document.getElementsByClassName('playboard_play2_goal')[0].style.display = 'block';
  });

  // gameStart()
});

async function countDown() {
  document.getElementsByClassName('playboard_play1_goal')[0].style.display = 'none';
  document.getElementsByClassName('playboard_play2_goal')[0].style.display = 'none';
  const countDown = document.getElementById('countDown').children;
  for (let x = 0; x < 3; x++) {
    console.log(x, countDown[x]);
    countDown[x].style.visibility = 'visible';
    countDown[x].classList.add('playboard_after_count');
    await sleep(1000);
    countDown[x].classList.remove('playboard_after_count');
    countDown[x].style.visibility = 'hidden';
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
