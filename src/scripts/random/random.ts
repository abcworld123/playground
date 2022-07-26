import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/random/random.scss';
import Swal from 'sweetalert2';
import { randint } from 'utils/tools';

const btnStart = document.getElementById('start');

function start() {
  const range = <input>document.getElementById('range');
  const randintText = <p>document.getElementById('randint');
  const n = range.value;
  if (!n) alertError();
  else randintText.innerText = String(randint(0, parseInt(n)));
}

function alertError() {
  return Swal.fire({
    icon: 'error',
    title: 'N을 입력해주세요.',
  });
}

btnStart.addEventListener('pointerup', start);
