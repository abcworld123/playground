const socket = io('/hockey');
const hosts = {};  // { room: id }
let requestQueue = [];
let requestFor = '';


/*********  alert functions  ***********/

function alertCreateRoom() {
    return Swal.fire({
        icon: 'info',
        title: '방 제목을 입력해주세요.',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        confirmButtonColor: '#13a829',
        cancelButtonColor: '#cc2121',
    });
}

function alertWaitUser() {
    return Swal.fire({
        title: '유저를 기다리는 중...',
        imageUrl: 'images/games/hockey/loading.gif',
        imageWidth: 100,
        allowOutsideClick: false,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: '취소',
        cancelButtonColor: '#66687A',
    });
}

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

function alertWaitResponse() {
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

function alertJoinRejected() {
    return Swal.fire({
        icon: 'warning',
        title: '상대방이 입장을 거절하였습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}

function alertJoinCanceled() {
    return Swal.fire({
        icon: 'warning',
        title: '상대방이 입장을 취소하였습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}

function alertUserNotExist() {
    return Swal.fire({
        icon: 'warning',
        title: '유저가 존재하지 않습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}

function alertRoomNotExist() {
    return Swal.fire({
        icon: 'warning',
        title: '방이 존재하지 않습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#6E7881',
    });
}


/********  handling functions  **********/

// [방장] 방 생성
async function createRoom() {
    const room = (await alertCreateRoom()).value;
    if (!room) return;
    socket.emit('create room', room);
    waitUser();
}

// [방장] 유저를 기다리는 중
async function waitUser() {
    const cancel = (await alertWaitUser()).isDismissed;
    if (cancel) socket.emit('remove room');
}

// [방장] 유저가 입장을 요청
function joinReceived(user) {
    requestQueue.push(user);
    if (requestQueue.length === 1) pollQueue(false);
}

// [방장] 입장 요청 처리
async function sendResponse(user) {
    const accept = (await alertJoinRequest(user)).isConfirmed;
    if (accept) {
        socket.emit('join room accept', user);
    } else {
        socket.emit('join room reject', user);
        pollQueue(true);
    }
}

// [방장] 유저가 입장을 취소
async function joinCanceled(user) {
    if (requestQueue.slice(1).includes(user)) {
        requestQueue.splice(requestQueue.slice(1).indexOf(user) + 1, 1);
    } else {
        await alertJoinCanceled();
        pollQueue(true);
    }
}

// [방장] 유저가 존재하지 않음
async function userNotExist() {
    await alertUserNotExist();
    pollQueue(true);
}

// [방장] 입장 요청 큐 처리
function pollQueue(shift) {
    if (shift) requestQueue.shift();
    if (requestQueue.length) sendResponse(requestQueue[0]);
    else waitUser();
}

// [유저] 방에 입장하기
async function joinRoom(room) {
    if ((await alertJoinConfirm()).isDismissed) return;
    if (!hosts[room]) { alertRoomNotExist(); return; }
    socket.emit('join room request', hosts[room]);
    requestFor = room;

    if (!(await alertWaitResponse()).isDismissed) return;
    socket.emit('join room cancel', hosts[room]);
    requestFor = '';
}

// [유저] 방장이 거절함
function joinRejected() {
    alertJoinRejected();
    requestFor = '';
}

// [ALL] 수락됨, 게임 페이지로 이동
// fixme 뒤로가기 문제 있음
function gameStart(room) {
    Swal.close();
    requestQueue.shift();
    location.href = `hockey/${room}`;
}

// [ALL] 삭제된 방 새로고침
function removeRoom(room) {
    document.getElementById(room).remove();
    delete hosts[room];
    if (requestFor === room) {
        alertRoomNotExist();
        requestFor = '';
    }
}

window.onload = () => {
    const roomContainer = document.getElementById('roomContainer');
    const room0 = document.getElementById('room0');
    const myId = document.getElementById('myId');
    myId.innerText = socket.id;

    function addRoom(host, room) {
        const item = room0.cloneNode(true);
        item.id = room;
        item.children[0].innerText = room;
        item.children[1].addEventListener('click', () => joinRoom(room));
        roomContainer.appendChild(item);
        hosts[room] = host;
    }

    // socket.io
    socket.onAny((event, msg1, msg2) => {
        console.log(event, msg1, msg2);
    });
    socket.on('connect', () => {
        myId.innerText = `ID: ${socket.id}`;
    });
    socket.on('room list', (arr) => {
        Object.entries(arr).forEach(x => addRoom(x[0], x[1]));
    });
    socket.on('new room', (host, room) => {
        addRoom(host, room);
    });
    socket.on('remove room', (room) => {
        removeRoom(room);
    });
    socket.on('join room request', (user) => {
        joinReceived(user);
    });
    socket.on('join room cancel', (user) => {
        joinCanceled(user);
    });
    socket.on('join room accept', (room) => {
        gameStart(room);
    });
    socket.on('join room reject', () => {
        joinRejected();
    });
    socket.on('user not exist', () => {
        userNotExist();
    });
};
