import { imgAilen } from 'images/common';
import Swal from 'sweetalert2';

Swal.fire({
  imageUrl: imgAilen,
  imageWidth: 300,
  imageHeight: 300,
  confirmButtonText: '따걍',
}).then(() => history.back());
