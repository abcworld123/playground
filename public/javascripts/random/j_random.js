function start() {
  const range = document.getElementById('range');
  const randint = document.getElementById('randint');
  const n = range.value;
  if (!n) alertError();
  else randint.innerText = Math.floor(Math.random() * (parseInt(n) + 1));
}

function alertError() {
  Swal.fire({
    icon: 'error',
    title: 'N을 입력해주세요.'
  });
}
