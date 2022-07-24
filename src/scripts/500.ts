import Swal from 'sweetalert2';
import { imgSandsand } from 'images/common';

Swal.fire({
  imageUrl: imgSandsand,
  imageWidth: 300,
  imageHeight: 300,
  confirmButtonText: '따걍',
}).then(() => history.back());
