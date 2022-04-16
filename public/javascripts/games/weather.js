const userNums = [0, 2, 2, 2, 2, 2, 2, 2];
const regNums = [0, 0, 0, 0, 0, 0, 0, 0];
const regNames = ['서울', '부산', '대구', '인천', '대전', '광주', '울산'];

function swalError(text, callback) {
  Swal.fire({
    icon: 'error',
    title: 'Fail',
    text: text,
    customClass: 'swal'
  }).then(callback);
}

function getTab(i) {
  return document.getElementById(`tab${i}`);
}

function userPlus(i) {
  const tab = getTab(i);
  const userContainer = tab.getElementsByClassName('user-container')[0];
  const userList = userContainer.children;
  const newUser = userList[0].cloneNode(true);
  newUser.removeAttribute('style');
  tab.getElementsByClassName('user-num')[0].innerText = ++userNums[i];
  userContainer.insertBefore(newUser, userList[userNums[i]]);
  if (userNums[i] === 2) {
    tab.getElementsByClassName('btn-user-minus')[0].disabled = false;
  }
}

function userMinus(i) {
  const tab = getTab(i);
  tab.getElementsByClassName('user-num')[0].innerText = --userNums[i];
  tab.getElementsByClassName('user-container')[0].children[userNums[i] + 1].remove();
  if (userNums[i] === 1) {
    tab.getElementsByClassName('btn-user-minus')[0].disabled = true;
  }
}

function regSet(i, n) {
  regNums[i] = n;
  const btnText = getTab(i).getElementsByClassName('btn-text')[0];
  btnText.innerText = regNames[n - 1];
}

function start(i) {
  let url, formdata;
  const tab = getTab(i);
  const btnStart = tab.getElementsByClassName('btn-start')[0];

  if (i <= 4) {
    const nx = Math.round(tab.getElementsByClassName('input-nx')[0].value);
    const ny = Math.round(tab.getElementsByClassName('input-ny')[0].value);
    if (!nx) {
      swalError('nx를 입력해주세요.');
      return;
    }
    if (nx < 1 || 149 < nx) {
      swalError('nx는 1 ~ 149 내의 숫자로 입력해주세요.');
      return;
    }
    if (!ny) {
      swalError('ny를 입력해주세요.');
      return;
    }
    if (ny < 1 || 253 < ny) {
      swalError('ny는 1 ~ 253 내의 숫자로 입력해주세요.');
      return;
    }
    url = '/weather/getWeatherDay';
    formdata = {
      idx: i,
      nx: nx,
      ny: ny
    };
  } else {
    if (!regNums[i]) {
      swalError('지역을 선택해주세요.');
      return;
    }
    url = `/weather/getWeather${i <= 6 ? 'Ta' : 'Ml'}`;
    formdata = {
      idx: i,
      reg: regNums[i]
    };
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
  .then((data) => {
    const userContainer = tab.getElementsByClassName('user-container')[0];
    const anss = userContainer.getElementsByClassName('item-answer');
    const userList = userContainer.children;
    const colors = ['#3c73ff', 'black', '#ff413b'];
    for (let j = 1; j < userList.length - 1; j++) {
      const inputs = userList[j].getElementsByClassName('item-input');
      const diffs = userList[j].getElementsByClassName('item-result');
      const score = userList[j].getElementsByClassName('item-result-total')[0];
      let total = 0;
      for (let k = 0; k < 7; k++) {
        if (inputs[k].value) {
          const diff = parseInt(inputs[k].value) - data[k];
          diffs[k].innerText = diff;
          diffs[k].style.color = colors[(diff > 0) - (diff < 0) + 1];
          total += diff;
        }
      }
      score.innerText = total;
      score.style.color = colors[(total > 0) - (total < 0) + 1];
    }
    for (let j = 0; j < 7; j++) {
      anss[j].value = data[j];
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
window.onload = () => {
  const userContainer = document.getElementsByClassName('user-container');
  [...userContainer].forEach((container) => {
    container.children[0].style.display = 'none';
  });
};
