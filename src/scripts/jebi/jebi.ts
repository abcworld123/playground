import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/jebi/jebi.scss';
import { imgAilen, imgHaHa, imgJebi, imgJebiHover } from 'images/games/jebi';
import { randSample } from 'utils/tools';

const jebiContainer = <div>document.getElementById('jebiContainer');
const jebiHahaNum = <span>document.getElementById('hahaNum');
const jebiAilenNum = <span>document.getElementById('ailenNum');
const btnHahaPlus = <button>document.getElementById('hahaPlus');
const btnHahaMinus = <button>document.getElementById('hahaMinus');
const btnAilenPlus = <button>document.getElementById('ailenPlus');
const btnAilenMinus = <button>document.getElementById('ailenMinus');
const btnReset = <button>document.getElementById('jebiReset');
const btnShowAilen = <button>document.getElementById('showAilen');
const btnShowSettings = <img>document.getElementById('showSettings');
const settings = <div>document.getElementById('settings');

let dog = 4, ailen = 1;
let openedAilen = 0;
let ailens = randSample(1, dog + ailen, ailen);
const jebies = <HTMLCollectionOf<img>>jebiContainer.children;

/* 제비 초기화 */
function reset() {
  for (const jebi of jebies) {
    jebi.className = 'jebi-unopened';
    jebi.src = imgJebi;
  }
  ailens = randSample(1, dog + ailen, ailen);
  btnShowAilen.disabled = false;
  openedAilen = 0;
}

/* 제비 1개 추가 */
function jebiPlus(n: number, numText: span, btnMinus: button) {
  reset();
  const newJebi = <img>jebies[0].cloneNode();
  newJebi.id = String(dog + ailen);
  jebiContainer.appendChild(newJebi);
  numText.innerText = String(n);
  if (n === 2) {
    btnMinus.disabled = false;
  }
}

/* 제비 1개 제거 */
function jebiMinus(n: number, numText: span, btnMinus: button) {
  reset();
  jebies[dog + ailen].remove();
  numText.innerText = String(n);
  if (n === 1) {
    btnMinus.disabled = true;
  }
}

/* 개그림 [+] 버튼 클릭 */
function hahaPlus() {
  jebiPlus(++dog, jebiHahaNum, btnHahaMinus);
}

/* 개그림 [-] 버튼 클릭 */
function hahaMinus() {
  jebiMinus(--dog, jebiHahaNum, btnHahaMinus);
}

/* 외계인 [+] 버튼 클릭 */
function ailenPlus() {
  jebiPlus(++ailen, jebiAilenNum, btnAilenMinus);
}

/* 외계인 [-] 버튼 클릭 */
function ailenMinus() {
  jebiMinus(--ailen, jebiAilenNum, btnAilenMinus);
}

/* 제비 클릭, 결과 보여주기 */
function jebiOpen(jebi: img) {
  if (ailens.includes(parseInt(jebi.id))) {
    openedAilen++;
    jebi.src = imgAilen;
    if (openedAilen === ailen) btnShowAilen.disabled = true;
  } else {
    jebi.src = imgHaHa;
  }
  jebi.removeAttribute('class');
}

/* 꽝 확인 */
function showAilen(show: boolean) {
  for (const i of ailens) {
    if (jebies[i - 1].className === 'jebi-unopened') {
      jebies[i - 1].src = show ? imgAilen : imgJebi;
    }
  }
}

/* 설정 열기 (모바일) */
function showSettings() {
  if (settings.style.display === '') {
    settings.style.display = 'flex';
  } else {
    settings.style.display = '';
  }
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

btnHahaMinus.addEventListener('pointerup', hahaMinus);
btnHahaPlus.addEventListener('pointerup', hahaPlus);
btnAilenMinus.addEventListener('pointerup', ailenMinus);
btnAilenPlus.addEventListener('pointerup', ailenPlus);
btnReset.addEventListener('pointerup', reset);
btnShowAilen.addEventListener('pointerdown', () => showAilen(true));
btnShowAilen.addEventListener('pointerup', () => showAilen(false));
btnShowSettings.addEventListener('pointerup', showSettings);
