let userNums = [0, 2, 2, 2, 2, 2, 2, 2, 2, 2];

//  children(3) -> 3th child.

function swalError(text, callback) {
  Swal.fire({
    icon: 'error',
    title: 'Fail',
    text: text,
    customClass: 'swal'
  }).then(callback);
}

function userPlus(i) {
  $(`#userNum${i}`).text(++userNums[i]);
  $(`#userContainer${i}`).append($(`#userContainer${i}`).children('div:first').clone());
  if (userNums[i] === 2) {
    $(`#userMinus${i}`).attr('disabled', false);
  }
}

function userMinus(i) {
  $(`#userNum${i}`).text(--userNums[i]);
  $(`#userContainer${i}`).children('div:last').remove();
  if (userNums[i] === 1) {
    $(`#userMinus${i}`).attr('disabled', true);
  }

}


function start(i) {
  console.log(i);
  const nx = $(`#nx${i}`).val();
  const ny = $(`#ny${i}`).val();
  if (!nx) {
    swalError('nx를 입력해주세요.');
    return;
  }
  if (!ny) {  // todo 범위 체크
    swalError('ny를 입력해주세요.');
    return;
  }
  $.ajax({
    url: '/weather/getWeather',
    dataType: 'json',
    type: 'POST',
    data: {
      idx: i,
      nx: nx,
      ny: ny
    },
    success: function (success) {
      if (success) resultAlert('Deleted');
      else errorAlert();
    }
  });
}

$(() => {
  // 디버깅용
  $('#tab0').removeClass('in');
  $('#tab0').removeClass('active');
  $('#tab1').addClass('in');
  $('#tab1').addClass('active');

  $('.btn').click(function () {
    console.log(`${$(this).attr('id')} clicked.`);
  })
})
