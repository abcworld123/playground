var playBoard
var playAction

const WIDTH = 600
const HEIGHT = 600

let player1_x = 100
let player1_y = 150
let player1_dy = 4
let player1_high = 100

let player2_x = 550
let player2_y = 250
let player2_dy = 4
let player2_high = 100

let play_ball_x = 200
let play_ball_y = 200
let play_ball_dx = 2
let play_ball_dy = 4
let play_ball_radius = 10
let play_ball_pause = 0

let play_ball_r = 100
let play_ball_g = 100
let play_ball_b = 100
let play_ball_dr = 1
let play_ball_dg = 1
let play_ball_db = 1
let play_ball_color_gauge = 50

// socket.io
const socket = io('/hockey');
const users = {};
const rooms = {};
let requestQueue = [];
let requestSending = false;


function alertJoinConfirm() {
    return Swal.fire({
        icon: 'question',
        title: '입장할까요?',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        confirmButtonColor: '#13a829',
        cancelButtonColor: '#cc2121',
    });
}

function alertJoinWait() {
    return Swal.fire({
        title: '요청을 보냈습니다.',
        text: '수락을 기다리는 중...',
        imageUrl: 'images/games/hockey/loading.gif',
        imageWidth: 100,
        allowOutsideClick: false,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: '취소',
        cancelButtonColor: '#66687A',
    });
}

function alertJoinRequest(user) {
    return Swal.fire({
        icon: 'info',
        title: '입장 요청',
        text: `${user}님이 입장을 요청하였습니다.`,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: '수락',
        cancelButtonText: '거절',
        confirmButtonColor: '#13a829',
        cancelButtonColor: '#cc2121',
    });
}

function alertJoinAccepted() {
    return Swal.fire({
        icon: 'success',
        title: '상대방이 입장을 수락하였습니다.',
        text: '수락 이후 처리',
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}

function alertJoinCanceled(msg) {
    return Swal.fire({
        icon: 'warning',
        title: `상대방이 입장을 ${msg === 'reject' ? '거절' : '취소'}하였습니다.`,
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}

function alertNotExist(msg) {
    return Swal.fire({
        icon: 'warning',
        title: `${msg} 존재하지 않습니다.`,
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}


async function joinRoom(room) {
    if ((await alertJoinConfirm()).isDismissed) return;
    if (!rooms[room]) { alertNotExist('방이'); return; }
    requestQueue = [room, ...requestQueue];
    socket.emit('join room request', room);
    requestSending = true;

    if (!(await alertJoinWait()).isDismissed) return;
    socket.emit('join room confirm', room, 'cancel');
    pollQueue(true);
}

async function joinResponse(user, msg) {
    if (msg === 'accept') {
        // 수락 이후 코드
        await alertJoinAccepted();
        pollQueue(true);
    } else if (!requestQueue.slice(1).includes(user)) {
        await alertJoinCanceled(msg);
        pollQueue(true);
    } else {
        requestQueue.splice(requestQueue.slice(1).indexOf(user) + 1, 1);
    }
}

async function joinRequest(user) {
    const accept = (await alertJoinRequest(user)).isConfirmed;
    if (accept) {
        // 수락 이후 코드
        if (users[user]) {
            requestQueue.shift();
            socket.emit('join room confirm', user, 'accept');
        } else {
            await alertNotExist('유저가');
            pollQueue(true);
        }
    } else {
        socket.emit('join room confirm', user, 'reject');
        pollQueue(true);
    }
}

function pollQueue(shift) {
    requestSending = false;
    if (shift) requestQueue.shift();
    if (requestQueue.length) joinRequest(requestQueue[0]);
}


//todo 클래스 변경
window.addEventListener("load", function() {

    const roomContainer = document.getElementById('roomContainer');
    const room0 = document.getElementById('room0');
    
    function addUser(user) {
        const item = room0.cloneNode(true);
        item.id = user;
        item.children[0].innerText = user;
        item.children[1].addEventListener('click', () => joinRoom(user));
        roomContainer.appendChild(item);
        rooms[user] = true;  //
        users[user] = true;
    }

    // socket.io
    socket.onAny((event, msg1, msg2) => {
        console.log(event, msg1, msg2);
    });
    socket.on('userlist', (arr) => {
        arr.forEach(user => addUser(user));
    });
    socket.on('userenter', (user) => {
        addUser(user);
    });
    socket.on('userleave', (user) => {
        document.getElementById(user).remove();
        if (requestSending && requestQueue[0] === user) alertNotExist('방이');
        requestQueue = requestQueue.filter(x => x !== user);
        delete users[user];
        delete rooms[user];
    });
    socket.on('join room request', (user) => {
        requestQueue.push(user);
        if (requestQueue.length === 1) pollQueue(false);
    });
    socket.on('join room confirm', (user, msg) => {
        joinResponse(user, msg);
    });

    window.addEventListener("keypress", togleDirection)
    gameStart()
})

// html에 있는 canvas 영역을 받아오고 함수 실행
function gameStart() {
    playBoard = document.getElementById('canvas').getContext('2d')

    playAction = window.requestAnimationFrame(draw)
}

// 화면 지우기 => 플레이어 및 공 그리기 => 충돌 검사 식으로 진행
//todo 벽에 박으면 멈추게
// crush를 그냥 전체 함수 안에 두기
function draw() {
    screenClear()
    screenDrawPlayer(player1_x, player1_y, player1_high)
    screenDrawPlayer(player2_x, player2_y, player1_high)
    screenDrawBall(play_ball_x, play_ball_y)

    player1_y += player1_dy
    player2_y += player2_dy
    play_ball_x += play_ball_dx
    play_ball_y += play_ball_dy
    play_ball_pause = play_ball_pause < 1 ? play_ball_pause : play_ball_pause - 1

    if( player1_y >= HEIGHT - player1_high || player1_y <= 0){player1_dy = -player1_dy }
    if( player2_y >= HEIGHT - player2_high || player2_y <= 0){player2_dy = -player2_dy }
    if(play_ball_x >= WIDTH - play_ball_radius || play_ball_x <= play_ball_radius ){
        play_ball_dx = -play_ball_dx;
    }
    if( play_ball_y >= HEIGHT - play_ball_radius || play_ball_y <= play_ball_radius){
        play_ball_dy = -play_ball_dy;
    }

    checkCrash()

    playAction = window.requestAnimationFrame(draw)
}

// canvas를 지우는 함수
function screenClear() {
    playBoard.clearRect(0, 0, WIDTH, HEIGHT)
}

// 플레이어 (직사각형)을 그리는 함수
// x : x좌표
// y : y좌표
// h : 직사각형의 넓이
// 넓이는 10으로 고정
function screenDrawPlayer(x, y, h) {
    playBoard.fillStyle = '#334ea4'
    playBoard.beginPath()
    playBoard.fillRect(x, y, 10, h)
    playBoard.closePath()
    playBoard.fill()
}

// 공 (원)을 그리는 함수
// x : x좌표
// y : y좌표
// 넓이는 play_ball_radius 으로 고정
function screenDrawBall(x, y) {
    changeColor()
    playBoard.fillStyle = 'rgb(' + String(play_ball_r) + ',' + String(play_ball_g) + ',' + String(play_ball_b) + ')'
    playBoard.beginPath()
    playBoard.arc(x, y, play_ball_radius, 0, Math.PI * 2, true)
    playBoard.closePath()
    playBoard.fill()
}

// 키보드 입력 함수
// w, s는 player_1 조종
// 8, 2는 player_2 조종
function togleDirection(e) {
    if (e.keyCode === 119) {
        // w 클릭
        player1_dy = player1_dy > 0 ? -player1_dy : player1_dy
    }else if (e.keyCode === 115) {
        // s 클릭
        player1_dy = player1_dy > 0 ? player1_dy : -player1_dy
    }else if (e.keyCode === 56) {
        // 8 클릭
        player2_dy = player2_dy > 0 ? -player2_dy : player2_dy
    }else if (e.keyCode === 50) {
        // 2 클릭
        player2_dy = player2_dy > 0 ? player2_dy : -player2_dy
    }
}

// player에 충돌이 일어났는지 검사
//todo 중심부 => 모든 영역
function checkCrash() {
    console.log(player1_x, play_ball_x, player1_y, play_ball_y)

    if (player1_x < play_ball_x && play_ball_x < player1_x + 10 && player1_y < play_ball_y && play_ball_y < player1_y + player1_high){
        play_ball_dx *= -1
        play_ball_pause = 20
    }else if (player2_x < play_ball_x && play_ball_x < player2_x + 10 && player2_y < play_ball_y && play_ball_y < player2_y + player2_high){
        play_ball_dx *= -1
        play_ball_pause = 20
    }
}

// 공의 색을 바꾸는 함수
function changeColor() {
    play_ball_r += play_ball_dr
    play_ball_g += play_ball_dg
    play_ball_b += play_ball_db

    if(play_ball_r <= 0 || play_ball_r <= 255){play_ball_dr *= -1}
    if(play_ball_g <= 0 || play_ball_g <= 255){play_ball_dg *= -1}
    if(play_ball_b <= 0 || play_ball_b <= 255){play_ball_db *= -1}
}
