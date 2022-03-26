$(() => {

  /* 난수 생성 */
  function randint(n) {
    const num = Math.ceil(Math.random() * n);
    console.log(`외계인: ${num}`);  // 주작 방지용으로 미리 번호 확인 가능
    return num;
  }

  /* 제비 초기화 */
  function reset(n) {
    container.empty();
    for (let i = 1; i <= n; i++) {
      let newjebi = newjebi_elem.clone();
      newjebi.attr('id', i);
      container.append(newjebi);
    }
    ailen = randint(n);
  }

  const container = $('.container-fluid');
  const newjebi_elem = $('<img class="jebi-unopened" src="/images/games/jebi/jebi.png">');
  const btn_plus = $('#jebiPlus');
  const btn_minus = $('#jebiMinus');
  const btn_reset = $('#jebiReset');
  const jebi_num = $('#jebiNum');
  let n = 5;
  let ailen = randint(n);

  /* [+] 버튼 클릭 */
  btn_plus.click(() => {
    let newjebi = newjebi_elem.clone();
    newjebi.attr('id', ++n);
    container.append(newjebi);
    jebi_num.text(n);
    ailen = randint(n);
    reset(n);
    if (n === 3) {
      btn_minus.attr('disabled', false);
    }
  });

  /* [-] 버튼 클릭 */
  btn_minus.click(() => {
    container.children('img:last').remove();
    jebi_num.text(--n);
    ailen = randint(n);
    reset(n);
    if (n === 2) {
      btn_minus.attr('disabled', true);
    }
  });

  /* 초기화 버튼 클릭 */
  btn_reset.click(() => reset(n));

  /* hover 이벤트 구현 */
  $(document).on('mouseenter', '.jebi-unopened', function () {
    $(this).attr('src', '/images/games/jebi/jebi_hover.png');
  });
  $(document).on('mouseleave', '.jebi-unopened', function () {
    $(this).attr('src', '/images/games/jebi/jebi.png');
  });

  /* 제비 클릭, 결과 보여주기 */
  $(document).on('click', '.jebi-unopened', function () {
    if (parseInt($(this).attr('id')) === ailen) {
      $(this).attr('src', '/images/games/jebi/ailen.jpg');
    } else {
      $(this).attr('src', '/images/games/jebi/haha.jpg');
    }
    $(this).removeClass();
  });
});
