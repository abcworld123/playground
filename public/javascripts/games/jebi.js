let jebiContainer, btnMinus, jebiNum;
let n = 5;
let ailen = randint(n);

/* 난수 생성 */
function randint(n) {
  const num = Math.ceil(Math.random() * n);
  console.log(`외계인: ${num}`);  // 주작 방지용으로 미리 번호 확인 가능
  return num;
}
 
/* 제비 초기화 */
function reset() {
  const jebies = jebiContainer.children;
  [...jebies].forEach((jebi) => {
    jebi.className = 'jebi-unopened';
    jebi.src = '/images/games/jebi/jebi.png';
  });
  ailen = randint(n);
}

/* [+] 버튼 클릭 */
function jebiPlus() {
  n++;
  reset();
  const newJebi = jebiContainer.children[0].cloneNode();
  newJebi.id = n;
  jebiContainer.appendChild(newJebi);
  jebiNum.innerText = n;
  if (n === 3) {
    btnMinus.disabled = false;
  }
}

/* [-] 버튼 클릭 */
function jebiMinus() {
  n--;
  reset();
  jebiContainer.children[n].remove();
  jebiNum.innerText = n;
  if (n === 2) {
    btnMinus.disabled = true;
  }
}

/* 제비 클릭, 결과 보여주기 */
function jebiOpen(jebi) {
  if (parseInt(jebi.id) === ailen) {
    jebi.src = '/images/games/jebi/ailen.jpg';
  } else {
    jebi.src = '/images/games/jebi/haha.jpg';
  }
  jebi.removeAttribute('class');
}

/* live eventListener for '.jebi-unopened' */
document.addEventListener('mouseover', (e) => {
  if (e.target.className === 'jebi-unopened') {
    e.target.src = '/images/games/jebi/jebi_hover.png';
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.className === 'jebi-unopened') {
    e.target.src = '/images/games/jebi/jebi.png';
  }
});
document.addEventListener('click', (e) => {
  if (e.target.className === 'jebi-unopened') {
    jebiOpen(e.target);
  }
});

/* onload */
window.onload = () => {
  jebiContainer = document.getElementById('jebiContainer');
  btnMinus = document.getElementById('jebiMinus');
  jebiNum = document.getElementById('jebiNum');
};
