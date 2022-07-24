import Swal from 'sweetalert2';
import { imgAilen } from 'images/common';

Swal.fire({
  imageUrl: imgAilen,
  imageWidth: 300,
  imageHeight: 300,
  confirmButtonText: '따걍',
}).then(() => history.back());
