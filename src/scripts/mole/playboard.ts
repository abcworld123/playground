import 'styles/mole/playboard.scss';

import { io } from 'utils/socket';
import { sleep } from 'utils/tools';

const roomNum = window.location.href.split('/')[4].split('?')[0];
const socket = io(`/molePlay?roomNum=${roomNum}`);

document.getElementsByClassName('test1')[0].addEventListener('click', function () {
  console.log('redClick');
  socket.emit('redClick');
});

document.getElementsByClassName('test2')[0].addEventListener('click', function () {
  console.log('blueClick');
  socket.emit('blueClick');
});
