import 'styles/mole/playboard.scss';

import { io } from 'utils/socket';
import { sleep } from 'utils/tools';

const roomNum = window.location.href.split('/')[4].split('?')[0];
const socket = io(`/molePlay?roomNum=${roomNum}`);
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

socket.on('birth', (idx: string, x: number, y: number, w: number, type: number) => {
  const html = `<div id="${idx}" class="${['aaa', 'bbb', 'ccc'][type - 1]}"></div>`;

  document.getElementsByClassName('mole_playboard')[0].insertAdjacentHTML('beforeend', html);

  document.getElementById(String(idx)).style.width = String(w) + 'vh';
  document.getElementById(String(idx)).style.height = String(w) + 'vh';
  document.getElementById(String(idx)).style.left = String(x) + '%';
  document.getElementById(String(idx)).style.top = String(y * 0.9 + 10) + '%';
});

socket.on('death', (idx: string) => {
  document.getElementById(String(idx)).remove();
});

socket.on('countdown', (i: number) => {
  console.log(i);
});

socket.on('score', (p1: number, p2: number) => {
  document.getElementsByClassName('my_score')[0].innerHTML = String(p1);
  document.getElementsByClassName('enemy_score')[0].innerHTML = String(p2);
});

document.getElementsByClassName('mole_playboard')[0].addEventListener('click', async function (event: any) {
  const target = event.target.getAttribute('id') ? event.target.getAttribute('id') : 'miss';

  const totalWidth = event.target.offsetWidth * 0.01;
  const widthPercentage = Math.ceil(event.offsetX / totalWidth);
  const totalHeight = event.target.offsetHeight * 0.009;
  const heightPercentage = Math.ceil(event.offsetY / totalHeight);

  socket.emit('click', widthPercentage, heightPercentage);
});

socket.connect();
