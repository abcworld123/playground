import 'bootstrap/dist/css/bootstrap.min.css';
import '@css/random/random.scss';
import Swal from 'sweetalert2';

type p = HTMLParagraphElement;
type input = HTMLInputElement;

function start() {
  const range = <input>document.getElementById('range');
  const randint = <p>document.getElementById('randint');
  const n = range.value;
  if (!n) alertError();
  else randint.innerText = String(Math.floor(Math.random() * (parseInt(n) + 1)));
}

function alertError() {
  return Swal.fire({
    icon: 'error',
    title: 'N을 입력해주세요.',
  });
}

global.start = start;
