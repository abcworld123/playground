import Swal from 'sweetalert2';

export function alertSuccess(title: string) {
  return Swal.fire({
    icon: 'success',
    title,
  });
}

export function alertError(title: string) {
  return Swal.fire({
    icon: 'error',
    title,
  });
}

export function alertWarn(title: string) {
  return Swal.fire({
    icon: 'warning',
    title,
  });
}

export function shakeOutsideClick() {
  const popup = Swal.getPopup();
  popup.classList.remove('swal2-show');
  setTimeout(() => {
    popup.classList.add('animate__animated', 'animate__headShake');
  });
  setTimeout(() => {
    popup.classList.remove('animate__animated', 'animate__headShake');
  }, 500);
  return false;
}
