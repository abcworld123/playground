import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom',
  iconColor: 'white',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export function toastSuccess(title: string) {
  return Toast.fire({
    icon: 'success',
    title,
  });
}

export function toastError(title: string) {
  return Toast.fire({
    icon: 'error',
    title,
  });
}

export function toastWarning(title: string) {
  return Toast.fire({
    icon: 'warning',
    title,
  });
}

export function toastInfo(title: string) {
  return Toast.fire({
    icon: 'info',
    title,
  });
}

export function toastQuestion(title: string) {
  return Toast.fire({
    icon: 'question',
    title,
  });
}
