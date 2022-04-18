let socket;
const rooms = new Set();  // { lobby room list }
const requestQueue = [];
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
    preConfirm: async (room) => {
      const encodedRoom = encodeURIComponent(room);
      if (!room) {
        Swal.showValidationMessage('방 제목을 입력해주세요.');
      } else if (room.length > 100) {
        Swal.showValidationMessage('방 제목은 100글자 이하로 입력해주세요.');
      }
      const roomExist = await new Promise(resolve => {
        socket.emit('room exist check', encodedRoom, x => resolve(x));
      });
      if (roomExist) {
        Swal.showValidationMessage('동일한 방 제목이 존재합니다.');
      }
      return encodedRoom;
    },
  });
}

function alertWaitUser() {
  return Swal.fire({
    title: '유저를 기다리는 중...',
    imageUrl: 'images/games/wordle/loading.gif',
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
    imageUrl: 'images/games/wordle/loading.gif',
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
    showDenyButton: true,
    confirmButtonText: '수락',
    denyButtonText: '거절',
    confirmButtonColor: '#13a829',
    denyButtonColor: '#cc2121',
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
async function handleRequest(user) {
  const accept = (await alertJoinRequest(user)).isConfirmed;
  if (accept) {
    const userExist = await new Promise(resolve => {
      socket.emit('user exist check', user, x => resolve(x));
    });
    if (userExist) {
      socket.emit('join room accept', user);
    } else {
      await alertUserNotExist();
      pollQueue(true);
    }
  } else {
    socket.emit('join room reject', user);
    pollQueue(true);
  }
}

// [방장] 유저가 입장을 취소
async function joinCanceled(user) {
  const idx = requestQueue.slice(1).indexOf(user) + 1;
  if (idx) requestQueue.splice(idx, 1);
  else {
    await alertJoinCanceled();
    pollQueue(true);
  }
}

// [방장] 입장 요청 큐 처리
function pollQueue(shift) {
  if (shift) requestQueue.shift();
  if (requestQueue.length) handleRequest(requestQueue[0]);
  else waitUser();
}

// [유저] 방에 입장하기
async function joinRoom(room) {
  if ((await alertJoinConfirm()).isDismissed) return;
  if (!rooms.has(room)) { alertRoomNotExist(); return; }
  socket.emit('join room request', room);
  requestFor = room;

  if (!(await alertWaitResponse()).isDismissed) return;
  socket.emit('join room cancel', room);
  requestFor = '';
}

// [유저] 방장이 거절함
function joinRejected() {
  alertJoinRejected();
  requestFor = '';
}

// [ALL] 수락됨, 게임 페이지로 이동
function gameStart(room) {
  Swal.close();
  const host = Boolean(requestQueue.length);
  location.replace(`wordle/${room}?host=${host}`);
}

// [ALL] 삭제된 방 새로고침
function removeRoom(room) {
  document.getElementById(room).remove();
  rooms.delete(room);
  if (requestFor === room) {
    alertRoomNotExist();
    requestFor = '';
  }
}

// [ALL] 나간 유저 새로고침
function removeUser(user) {
  const idx = requestQueue.slice(1).indexOf(user) + 1;
  if (idx) requestQueue.splice(idx, 1);
}

window.onload = () => {
  const roomContainer = document.getElementById('roomContainer');
  const room0 = document.getElementById('room0');
  const myId = document.getElementById('myId');

  function addRoom(room) {
    const item = room0.cloneNode(true);
    item.id = room;
    item.children[0].innerText = decodeURIComponent(room);
    item.children[1].addEventListener('click', () => joinRoom(room));
    roomContainer.appendChild(item);
    rooms.add(room);
  }
  
  // socket.io
  socket = io('/wordle');
  
  socket.on('connect', () => {
    myId.innerText = `ID: ${socket.id}`;
  });
  socket.once('room list', (arr) => {
    arr.forEach(room => addRoom(room));
  });
  socket.on('create room', (room) => {
    addRoom(room);
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
  socket.on('user leave', (user) => {
    removeUser(user);
  });
};
