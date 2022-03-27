let userNums = [0, 2, 2, 2, 2, 2, 2, 2];
let regNums = [0, 0, 0, 0, 0, 0, 0, 0];
const regNames = ['서울', '부산', '대구', '인천', '대전', '광주', '울산'];


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
  new_user.find('.item-result-total').text('');
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

function regSet(i, n) {
  regNums[i] = n;
  $(`#btnReg${i}`).html(`${regNames[n - 1]} <span class="caret"></span>`);

}

function start(i) {
  let url, formdata;
  const btn_start = $(`#start${i}`);

  if (i <= 4) {
    const nx = $(`#nx${i}`).val();
    const ny = $(`#ny${i}`).val();
    if (!nx) {
      swalError('nx를 입력해주세요.');
      return;
    }
    if (!ny) {
      swalError('ny를 입력해주세요.');
      return;
    }
    if (nx < 1 || 149 < nx) {
      swalError('nx는 1 ~ 149 내의 숫자로 입력해주세요.');
      return;
    }
    if (ny < 1 || 253 < ny) {
      swalError('ny는 1 ~ 253 내의 숫자로 입력해주세요.');
      return;
    }
    url = '/weather/getWeatherDay';
    formdata = {
      idx: i,
      nx: nx,
      ny: ny
    };
  } else {
    if (!regNums[i]) {
      swalError('지역을 선택해주세요.');
      return;
    }
    url = `/weather/getWeather${i <= 6 ? 'Ta' : 'Ml'}`;
    formdata = {
      idx: i,
      reg: regNums[i]
    };
  }

  btn_start.attr('disabled', true);
  btn_start.removeClass('btn-success').addClass('btn-warning');
  btn_start.html('<i class="fa-solid fa-hourglass"></i>');

  $.ajax({
    url: url,
    dataType: 'json',
    type: 'POST',
    data: formdata,
    success: (data) => {
      console.log(data);
      const users = $(`#userContainer${i}`).children();
      users.each(function () {
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
      });
      const anss = $(`#ansContainer${i}`).find('.item-answer');
      for (let j = 0; j < 7; j++) {
        $(anss[j]).val(data[j]);
      }


    },
    error: (error) => {
      console.error('오류인');
      console.error(error);
    },
    complete: () => {
      btn_start.attr('disabled', false);
      btn_start.removeClass('btn-warning').addClass('btn-success');
      btn_start.text('시작!');
    }
  });
}

// hide clone templates
$(() => {
  for (let i = 1; i <= 9; i++) {
    $(`#userContainer${i}`).children('div:first').hide();
  }
})
