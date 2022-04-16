let n = 2;

function start() {
  const range = document.getElementById('range');
  const randint = document.getElementById('randint');
  n = parseInt(range.value) + 1;
  randint.innerText = Math.floor(Math.random() * n);
}
