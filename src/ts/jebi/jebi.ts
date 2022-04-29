import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@css/jebi/jebi.scss';
import Toast from 'bootstrap/js/dist/toast.js';

type div = HTMLDivElement;
type img = HTMLImageElement;
type span = HTMLSpanElement;
type button = HTMLButtonElement;

const toast = new Toast(document.getElementById('toast'));
const jebiContainer = <div>document.getElementById('jebiContainer');
const btnMinus = <button>document.getElementById('jebiMinus');
const jebiNum = <span>document.getElementById('jebiNum');
const toastText = <span>document.getElementById('toastText');

let n = 5, dog = 0;
let ailen = randint(n);

/* 난수 생성 */
function randint(n: number) {
  const num = Math.ceil(Math.random() * n);
  console.log(`외계인: ${num}`);  // 주작 방지용으로 미리 번호 확인 가능
  return num;
}

/* 제비 초기화 */
function reset() {
  const jebies = <HTMLCollectionOf<img>>jebiContainer.children;
  [...jebies].forEach((jebi) => {
    jebi.className = 'jebi-unopened';
    jebi.src = '/images/jebi/jebi.png';
  });
  ailen = randint(n);
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
    jebi.src = '/images/jebi/ailen.jpg';
    toastShow();
  } else {
    dog++;
    jebi.src = '/images/jebi/haha.jpg';
  }
  jebi.removeAttribute('class');
}

/* 랭킹 보여주기 */
function toastShow() {
  fetch('/jebi/ranking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ n, dog }),
  })
  .then((res) => res.json())
  .then(({ success, body }) => {
    if (!success) throw new Error('fetch failed');
    const { rank, total, top } = body;
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
    e.target.src = '/images/jebi/jebi_hover.png';
  }
});
document.addEventListener('mouseout', (e) => {
  if (!(e.target instanceof Image)) return;
  if (e.target.className === 'jebi-unopened') {
    e.target.src = '/images/jebi/jebi.png';
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
