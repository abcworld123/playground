import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import 'styles/hockey/lobby.scss';
import { imgLoading } from 'images/common';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

const rooms = new Set<string>();  // { lobby room list }
const requestQueue: string[] = [];
let requestFor = '';

const roomContainer = <div>document.getElementById('roomContainer');
const roomTemplate = <template>document.getElementById('roomTemplate');
const myId = <span>document.getElementById('myId');

/* *********  alert functions  ********** */

function shakeOutsideClick() {
  const popup = Swal.getPopup();
  popup.classList.remove('swal2-show');
  setTimeout(() => {
    popup.classList.add('animate__animated', 'animate__headShake');
  });
  setTimeout(() => {
    popup.classList.remove('animate__animated', 'animate__headShake');
  }, 500);
  return false;
}

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
    preConfirm: async (room: string) => {
      if (!room) {
        Swal.showValidationMessage('방 제목을 입력해주세요.');
      } else if (room.length > 100) {
        Swal.showValidationMessage('방 제목은 100글자 이하로 입력해주세요.');
      }
      const roomExist = await new Promise<boolean>(resolve => {
        socket.emit('room exist check', room, (x: boolean) => resolve(x));
      });
      if (roomExist) {
        Swal.showValidationMessage('동일한 방 제목이 존재합니다.');
      }
      return room;
    },
  });
}

function alertWaitUser() {
  return Swal.fire({
    title: '유저를 기다리는 중...',
    imageUrl: imgLoading,
    allowOutsideClick: shakeOutsideClick,
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
    imageUrl: imgLoading,
    imageWidth: 100,
    allowOutsideClick: shakeOutsideClick,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: '취소',
    cancelButtonColor: '#66687A',
  });
}

function alertJoinRequest(user: string) {
  return Swal.fire({
    icon: 'info',
    title: '입장 요청',
    text: `${user}님이 입장을 요청하였습니다.`,
    allowOutsideClick: shakeOutsideClick,
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

/* ********  handling functions  ********* */

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
function joinReceived(user: string) {
  requestQueue.push(user);
  if (requestQueue.length === 1) pollQueue(false);
}

// [방장] 입장 요청 처리
async function handleRequest(user: string) {
  const accept = (await alertJoinRequest(user)).isConfirmed;
  if (accept) {
    const userExist = await new Promise<boolean>(resolve => {
      socket.emit('user exist check', user, (x: boolean) => resolve(x));
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
async function joinCanceled(user: string) {
  const idx = requestQueue.slice(1).indexOf(user) + 1;
  if (idx) requestQueue.splice(idx, 1);
  else {
    await alertJoinCanceled();
    pollQueue(true);
  }
}

// [방장] 입장 요청 큐 처리
function pollQueue(shift: boolean) {
  if (shift) requestQueue.shift();
  if (requestQueue.length) handleRequest(requestQueue[0]);
  else waitUser();
}

// [유저] 방에 입장하기
async function joinRoom(room: string) {
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
function gameStart(room: string) {
  Swal.close();
  room = encodeURIComponent(room);
  const host = Boolean(requestQueue.length);
  location.replace(`hockey/${room}`);
}

// [ALL] 삭제된 방 새로고침
function removeRoom(room: string) {
  document.getElementById(room).remove();
  rooms.delete(room);
  if (requestFor === room) {
    alertRoomNotExist();
    requestFor = '';
  }
}

// [ALL] 나간 유저 새로고침
function removeUser(user: string) {
  const idx = requestQueue.slice(1).indexOf(user) + 1;
  if (idx) requestQueue.splice(idx, 1);
}

function addRoom(room: string) {
  const item = <div>document.importNode(roomTemplate.content, true).children[0];
  item.id = room;
  (<div>item.children[0]).innerText = room;
  (<div>item.children[1]).addEventListener('click', () => joinRoom(room));
  roomContainer.appendChild(item);
  rooms.add(room);
}

// socket.io
const socket = io('/hockey', { transports: ['websocket'] });

socket.on('connect', () => {
  myId.innerText = `ID: ${socket.id}`;
});
socket.once('room list', (arr: string[]) => {
  arr.forEach(room => addRoom(room));
});
socket.on('create room', (room: string) => {
  addRoom(room);
});
socket.on('remove room', (room: string) => {
  removeRoom(room);
});
socket.on('join room request', (user: string) => {
  joinReceived(user);
});
socket.on('join room cancel', (user: string) => {
  joinCanceled(user);
});
socket.on('join room accept', (room: string) => {
  gameStart(room);
});
socket.on('join room reject', () => {
  joinRejected();
});
socket.on('user leave', (user: string) => {
  removeUser(user);
});

global.createRoom = createRoom;
