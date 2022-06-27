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
