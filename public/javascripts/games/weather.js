
let userNums = [0, 2, 2, 2, 2, 2, 2, 2, 2, 2];
const user_template =

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
  const new_user = $(`#userContainer${i}`).children('div:first').clone();
  new_user.show();
  $(`#userContainer${i}`).append(new_user);
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
  const btn_start = $(`#start${i}`);
  if (!nx) {
    swalError('nx를 입력해주세요.');
    return;
  }
  if (!ny) {  // todo 범위 체크
    swalError('ny를 입력해주세요.');
    return;
  }
  btn_start.attr('disabled', true);
  btn_start.html('<i class="fa-solid fa-hourglass"></i>');

  $.ajax({
    url: '/weather/getWeather',
    dataType: 'json',
    type: 'POST',
    data: {
      idx: i,
      nx: nx,
      ny: ny
    },
    success: (data) => {
      const users = $(`#userContainer${i}`).children();
      users.each(function (j) {
        const inputs = $(this).find('.item-input');
        const diffs = $(this).find('.item-result');
        const score = $(this).find('.item-result-total');
        let total = 0;
        for (let k = 0; k < 7; k++) {
          if ($(inputs[k]).val()) {
            const diff = parseInt($(inputs[k]).val()) - data[k];
            $(diffs[k]).text(diff);
            if (diff > 0) {
              $(diffs[k]).css('color', '#ff413b');
            } else if (diff < 0) {
              $(diffs[k]).css('color', '#3c73ff');
            }
            total += diff;
          }
        }
        score.text(total);
        if (total > 0) {
          score.css('color', '#ff413b');
        } else if (total < 0) {
          score.css('color', '#3c73ff');
        }
        console.log('end');
      })
      console.log(data);


    },
    error: (error) => {
      console.error(error);
    },
    complete: () => {
      btn_start.attr('disabled', false);
      btn_start.text('시작!');
    }
  });
}

$(() => {
  // 디버깅용
  $('#tab0').removeClass('in');
  $('#tab0').removeClass('active');
  $('#tab1').addClass('in');
  $('#tab1').addClass('active');

  for (let i = 1; i <= 9; i++) {
    $(`#userContainer${i}`).children('div:first').hide();
  }
  $('.btn').click(function () {
    console.log(`${$(this).attr('id')} clicked.`);
  })
})
