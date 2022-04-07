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
        if (requestQueue[0] === user) {
            if (requestSending) alertNotExist('방이');
            requestQueue = [requestQueue[0], ...requestQueue.slice(1).filter(x => x !== user)];
        } else {
            requestQueue = requestQueue.filter(x => x !== user);
        }
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
})
