$(() => {
  const randint = $('#randint');
  const range = $('#range');
  const btn_start = $('#start');
  let n = 2;

  range.change(() => {
    n = parseInt(range.val()) + 1;
  });

  btn_start.click(() => {
    randint.text(Math.floor(Math.random() * n));
  })
});
