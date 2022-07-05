import { imgSandsand } from 'images/common';
import Swal from 'sweetalert2';

Swal.fire({
  imageUrl: imgSandsand,
  imageWidth: 300,
  imageHeight: 300,
  confirmButtonText: '따걍',
}).then(() => history.back());
