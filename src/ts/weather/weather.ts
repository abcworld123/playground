import 'bootstrap3/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@css/weather/weather.css';
import Swal from 'sweetalert2';

type li = HTMLLIElement;
type div = HTMLDivElement;
type span = HTMLSpanElement;
type button = HTMLButtonElement;
type input = HTMLInputElement;

const userNums = [0, 2, 2, 2, 2, 2, 2, 2];
const regNums = [0, 0, 0, 0, 0, 0, 0, 0];
const regNames = ['서울', '부산', '대구', '인천', '대전', '광주', '울산'];
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const tab = document.querySelectorAll<div>('.tab-game');
const userContainer = document.querySelectorAll<div>('.user-container');
const dropdown = document.querySelectorAll<li>('.dropdown');
let curTab = <div>document.getElementById('tab0');

function alertError(text: string) {
  return Swal.fire({
    icon: 'error',
    title: text,
  });
}

function userPlus(i: number) {
  const idx = i - 1;
  const userList = userContainer[idx].children;
  const newUser = <div>userList[0].cloneNode(true);
  newUser.removeAttribute('style');
  tab[idx].querySelector<span>('.user-num').innerText = String(++userNums[i]);
  userContainer[idx].insertBefore(newUser, userList[userNums[i]]);
  if (userNums[i] === 2) {
    tab[idx].querySelector<button>('.btn-user-minus').disabled = false;
  }
}

function userMinus(i: number) {
  const idx = i - 1;
  tab[idx].querySelector<span>('.user-num').innerText = String(--userNums[i]);
  tab[idx].querySelector<div>('.user-container').children[userNums[i] + 1].remove();
  if (userNums[i] === 1) {
    tab[idx].querySelector<button>('.btn-user-minus').disabled = true;
  }
}

function regSet(i: number, n: number) {
  regNums[i] = n;
  const btnReg = tab[i - 1].querySelector<span>(`#btnReg${i}`);
  btnReg.innerHTML = `${regNames[n - 1]} <span class="caret"></span>`;
}

function start(i: number) {
  let url: string, formdata: Record<string, any>;
  const idx = i - 1;
  const btnStart = tab[idx].querySelector<button>('.btn-start');

  if (i <= 4) {
    const nx = parseInt(tab[idx].querySelector<input>('.input-nx').value);
    const ny = parseInt(tab[idx].querySelector<input>('.input-ny').value);
    if (!nx) {
      alertError('nx를 입력해주세요.');
      return;
    }
    if (nx < 1 || 149 < nx) {
      alertError('nx는 1 ~ 149 내의 숫자로 입력해주세요.');
      return;
    }
    if (!ny) {
      alertError('ny를 입력해주세요.');
      return;
    }
    if (ny < 1 || 253 < ny) {
      alertError('ny는 1 ~ 253 내의 숫자로 입력해주세요.');
      return;
    }
    url = '/weather/getWeatherDay';
    formdata = { idx: i, nx, ny };
  } else {
    if (!regNums[i]) {
      alertError('지역을 선택해주세요.');
      return;
    }
    url = `/weather/getWeather${i <= 6 ? 'Ta' : 'Ml'}`;
    formdata = { idx: i, reg: regNums[i] };
  }
  
  btnStart.disabled = true;
  btnStart.classList.replace('btn-success', 'btn-warning');
  btnStart.innerHTML = '<i class="fa-solid fa-hourglass"></i>';
  
  fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formdata),
  })
  .then((res) => res.json())
  .then((data: number[]) => {
    const userContainer = tab[idx].querySelector<div>('.user-container');
    const anss = userContainer.querySelectorAll<input>('.item-answer');
    const userList = userContainer.children;
    const colors = ['#3c73ff', 'black', '#ff413b'];
    for (let j = 1; j < userList.length - 1; j++) {
      const inputs = userList[j].querySelectorAll<input>('.item-input');
      const diffs = userList[j].querySelectorAll<span>('.item-result');
      const score = userList[j].querySelector<span>('.item-result-total');
      let total = 0;
      for (let k = 0; k < 7; k++) {
        if (inputs[k].value) {
          const diff = parseInt(inputs[k].value) - data[k];
          diffs[k].innerText = String(diff);
          diffs[k].style.color = colors[+(diff > 0) - +(diff < 0) + 1];
          total += diff;
        }
      }
      score.innerText = String(total);
      score.style.color = colors[+(total > 0) - +(total < 0) + 1];
    }
    for (let j = 0; j < 7; j++) {
      anss[j].value = String(data[j]);
    }
  })
  .catch((err) => {
    console.error('오류인');
    console.error(err);
  })
  .finally(() => {
    btnStart.disabled = false;
    btnStart.classList.replace('btn-warning', 'btn-success');
    btnStart.innerText = '시작!';
  });
}

// hide clone templates
userContainer.forEach((container) => {
  (<div>container.children[0]).style.display = 'none';
});

// dropdown click event
document.addEventListener('click', (_e) => {
  const e = _e.target;
  if (!(e instanceof HTMLElement)) return;
  
  const flag = e.parentElement?.classList.contains('closed');
  dropdown.forEach(e => e.classList.replace('open', 'closed'));
  if (flag) e.parentElement.classList.replace('closed', 'open');
});

// tab visibility
for (let i = 1; i <= 7; i++) {
  const menu = document.getElementById(`menu${i}`);
  menu.addEventListener('click', async (e) => {
    curTab.classList.remove('in');
    await sleep(75);
    curTab.classList.remove('active');
    curTab = tab[i - 1];
    curTab.classList.add('active');
    await sleep(75);
    curTab.classList.add('in');
  });
}


global.userMinus = userMinus;
global.userPlus = userPlus;
global.regSet = regSet;
global.start = start;
