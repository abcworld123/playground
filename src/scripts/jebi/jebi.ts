import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/jebi/jebi.scss';
import Toast from 'bootstrap/js/dist/toast.js';
import { imgAilen, imgHaHa, imgJebi, imgJebiHover } from 'images/games/jebi';
import { randint } from 'utils/tools';
import type { ResJebiSubmit } from 'types/games/jebi';

const toast = new Toast(document.getElementById('toast'));
const jebiContainer = <div>document.getElementById('jebiContainer');
const btnMinus = <button>document.getElementById('jebiMinus');
const jebiNum = <span>document.getElementById('jebiNum');
const toastText = <span>document.getElementById('toastText');

let n = 5, dog = 0;
let ailen = randint(1, n);

/* 제비 초기화 */
function reset() {
  const jebies = <HTMLCollectionOf<img>>jebiContainer.children;
  [...jebies].forEach((jebi) => {
    jebi.className = 'jebi-unopened';
    jebi.src = imgJebi;
  });
  ailen = randint(1, n);
  dog = 0;
}

/* [+] 버튼 클릭 */
function jebiPlus() {
  n++;
  reset();
  const newJebi = <img>jebiContainer.children[0].cloneNode();
  newJebi.id = String(n);
  jebiContainer.appendChild(newJebi);
  jebiNum.innerText = String(n);
  if (n === 3) {
    btnMinus.disabled = false;
  }
}

/* [-] 버튼 클릭 */
function jebiMinus() {
  n--;
  reset();
  jebiContainer.children[n].remove();
  jebiNum.innerText = String(n);
  if (n === 2) {
    btnMinus.disabled = true;
  }
}

/* 제비 클릭, 결과 보여주기 */
function jebiOpen(jebi: img) {
  if (parseInt(jebi.id) === ailen) {
    jebi.src = imgAilen;
    toastShow();
  } else {
    dog++;
    jebi.src = imgHaHa;
  }
  jebi.removeAttribute('class');
}

/* 랭킹 보여주기 */
function toastShow() {
  fetch('/jebi/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ n, dog }),
  })
  .then<ResJebiSubmit>((res) => res.json())
  .then(({ success, data }) => {
    if (!success) throw new Error('fetch failed');
    const { rank, total, top } = data;
    setTimeout(() => {
      toastText.innerHTML = `${total}회 중 <b>${rank}</b>위 (상위 <b>${top}%</b>)`;
    }, 150);
    toast.show();
  })
  .catch((err) => {
    console.error(err);
  });
}

/* live eventListener for '.jebi-unopened' */
document.addEventListener('mouseover', (e) => {
  if (!(e.target instanceof Image)) return;
  if (e.target.className === 'jebi-unopened') {
    e.target.src = imgJebiHover;
  }
});
document.addEventListener('mouseout', (e) => {
  if (!(e.target instanceof Image)) return;
  if (e.target.className === 'jebi-unopened') {
    e.target.src = imgJebi;
  }
});
document.addEventListener('click', (e) => {
  if (!(e.target instanceof Image)) return;
  if (e.target.className === 'jebi-unopened') {
    jebiOpen(e.target);
  }
});

global.jebiMinus = jebiMinus;
global.jebiPlus = jebiPlus;
global.reset = reset;
