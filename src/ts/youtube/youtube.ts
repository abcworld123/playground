import '@css/youtube/youtube.scss';

interface response {
  viewCount: string,
  likeCount: string,
  commentCount: string,
  title: string,
  thumbnails: string,
  word: string,
}

const g_youtubeRotation = ['조회수', '좋아요', '댓글수', '제목길이'];
const g_youtubeResultCheck: Array<number[]> = [];
let g_youtubeResultCount = 0;
let g_youtubeResult: response[] = [];

document.getElementsByClassName('youtube_btn')[0].addEventListener('click', addMember);
document.getElementsByClassName('youtube_btn')[1].addEventListener('click', rotationCategory);
document.getElementsByClassName('youtube_submit_btn')[0].addEventListener('click', getResult);

// 참가자 추가
function addMember() {
  const youtubeInput = document.querySelector<div>('.youtube_input_area');
  const newInput = document.createElement('input');
  newInput.className = 'youtube_input_text';
  youtubeInput.appendChild(newInput);
}

// 게임 종목 변경
function rotationCategory() {
  const youtubeCategory = document.querySelectorAll<div>('.youtube_btn')[1];
  const category = youtubeCategory.innerHTML.trim();

  youtubeCategory.innerHTML = g_youtubeRotation[(g_youtubeRotation.indexOf(category) + 1) % 4];
}

// 결과 창 변경
function getResult() {
  const youtubeCategory = document.getElementsByClassName('youtube_btn')[1].innerHTML.trim();
  const youtubeInputArea = document.querySelector<div>('.youtube_input_area');
  const youtubeInput = youtubeInputArea.querySelectorAll('input');
  const word = [];
  let individuallyWord = '';

  for (let x = 0; x < youtubeInput.length; x++) {
    individuallyWord = youtubeInput[x].value.trim();
    if (individuallyWord.length === 0) {
      alert('빈 값이 존재합니다.');
      return;
    }

    word.push(individuallyWord);
  }
  document.querySelector<div>('.youtube_loading_modal').style.display = 'flex';

  // 유튜브 api로 결과를 받아온다
  fetch('/youtube/result', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      word: word,
      type: youtubeCategory,
    }),
  })
  .then(res => res.json())
  .then((result: response[]) => {
    g_youtubeResult = result;
    document.querySelector<div>('.youtube_loading_modal').style.display = 'none';
    document.querySelector<div>('.youtube_contain').style.display = 'none';
    document.querySelector<div>('.youtube_result_body').style.display = 'block';

    let resultHtml = '';
    for (let x = 0; x < result.length; x++) {
      resultHtml += `
        <div class="youtube_result_one_list">
          <div class="youtube_result_word">
            ${result[x].word}
          </div>
          <div class="youtube_result_thumbnails_area">
            <div class="youtube_result_hidden_area">
              썸네일 ?
            </div>
          </div>
          <div>
            <div class="youtube_result_title_area">
              <div class="youtube_result_hidden_area">
                제목 ?
              </div>
            </div>
            <div class="youtube_result_info_area">
              <div class="youtube_result_views_area">
                <div class="youtube_result_hidden_area">
                  조회수 ?
                </div>
              </div>
              <div class="youtube_result_comment_area">
                <div class="youtube_result_hidden_area">
                  댓글 ?
                </div>
              </div>
              <div class="youtube_result_like_area">
                <div class="youtube_result_hidden_area">
                  좋아요 ?
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>`;
      g_youtubeResultCheck.push([0, 0, 0, 0, 0]);
    }
    resultHtml += `
      <div class="youtube_result_submit">
        결과 보기
      </div>`;

    document.querySelector<div>('.youtube_result_body').innerHTML = resultHtml;
    const thumbnails_area = document.querySelectorAll<div>('.youtube_result_thumbnails_area');
    const title_area = document.querySelectorAll<div>('.youtube_result_title_area');
    const views_area = document.querySelectorAll<div>('.youtube_result_views_area');
    const comment_area = document.querySelectorAll<div>('.youtube_result_comment_area');
    const like_area = document.querySelectorAll<div>('.youtube_result_like_area');
    
    for (let x = 0; x < result.length; x++) {
      thumbnails_area[x].addEventListener('click', clickHiddenThumbnails.bind(this, x));
      title_area[x].addEventListener('click', clickHiddenTitle.bind(this, x));
      views_area[x].addEventListener('click', clickHiddenViews.bind(this, x));
      comment_area[x].addEventListener('click', clickHiddenComment.bind(this, x));
      like_area[x].addEventListener('click', clickHiddenLike.bind(this, x));
    }
    document.getElementsByClassName('youtube_result_submit')[0].addEventListener('click', clickResultSubmit);
  });
}

// 썸네일 박스를 누를 때 동작
function clickHiddenThumbnails(num: number) {
  if (g_youtubeResultCheck[num][0] === 0) {
    g_youtubeResultCheck[num][0] = 1;
    g_youtubeResultCount += 1;

    const imgTag = `<img class="youtube_result_show_thumbnails" src="${g_youtubeResult[num].thumbnails}">`;

    document.getElementsByClassName('youtube_result_thumbnails_area')[num].innerHTML = imgTag;
  }
}

// 제목 박스를 누를 때 동작
function clickHiddenTitle(num: number) {
  if (g_youtubeResultCheck[num][1] === 0) {
    g_youtubeResultCheck[num][1] = 1;
    g_youtubeResultCount += 1;

    const titleTag = `
      <div title="${g_youtubeResult[num].title.length}" class="youtube_result_title">
        ${g_youtubeResult[num].title}
      </div>`;

    document.getElementsByClassName('youtube_result_title_area')[num].innerHTML = titleTag;

    allChecked();
  }
}

// 조회수 박스를 누를 때 동작
function clickHiddenViews(num: number) {
  if (g_youtubeResultCheck[num][2] === 0) {
    g_youtubeResultCheck[num][2] = 1;
    g_youtubeResultCount += 1;

    const viewsTag = `
      <div class="youtube_result_small_text">
        조회수 : ${g_youtubeResult[num].viewCount}
      </div>`;

    document.getElementsByClassName('youtube_result_views_area')[num].innerHTML = viewsTag;

    allChecked();
  }
}

// 댓글 박스를 누를 때 동작
function clickHiddenComment(num: number) {
  if (g_youtubeResultCheck[num][3] === 0) {
    g_youtubeResultCheck[num][3] = 1;
    g_youtubeResultCount += 1;

    const commentTag = `
      <div class="youtube_result_small_text">
        댓글수 : ${g_youtubeResult[num].commentCount}
      </div>`;

    document.getElementsByClassName('youtube_result_comment_area')[num].innerHTML = commentTag;

    allChecked();
  }
}

// 좋아요 박스를 누를 때 동작
function clickHiddenLike(num: number) {
  if (g_youtubeResultCheck[num][4] === 0) {
    g_youtubeResultCheck[num][4] = 1;
    g_youtubeResultCount += 1;

    const likeTag = `
      <div class="youtube_result_small_text">
        좋아요 : ${g_youtubeResult[num].likeCount}
      </div>`;

    document.getElementsByClassName('youtube_result_like_area')[num].innerHTML = likeTag;

    allChecked();
  }
}

// 결과창 표시 (순위를 보여준다)
function clickResultSubmit() {
  const arr: div[] = [];
  for (const word of ['thumbnails', 'title', 'views', 'comment', 'like']) {
    arr.push(...document.querySelectorAll<div>(`.youtube_result_${word}_area`));
  }
  arr.forEach(x => x.click());

  const youtubeCategory = document.getElementsByClassName('youtube_btn')[1];
  const category = youtubeCategory.innerHTML.trim();
  let resultHtml = '';

  if (category === '조회수') {
    g_youtubeResult.sort(arrOrder('viewCount'));
  } else if (category === '좋아요') {
    g_youtubeResult.sort(arrOrder('likeCount'));
  } else if (category === '댓글수') {
    g_youtubeResult.sort(arrOrder('commentCount'));
  } else if (category === '제목길이') {
    g_youtubeResult.sort(arrTitleOrder('title'));
  }

  document.querySelector<div>('.modal').style.display = 'block';

  resultHtml += `
    <div class="youtube_modal_result_list">
      <div class="youtube_modal_result">
        <div class="youtube_modal_rank">
          <img class="youtube_modal_rank" src="/images/youtube/1st.png">
        </div>"
        <div class="youtube_modal_info">
          ${g_youtubeResult[0].word}
        </div>
      </div>
    </div>`;

  for (let x = 1; x < g_youtubeResult.length - 1; x++) {

    resultHtml += `
      <div class="youtube_modal_result_list">
        <div class="youtube_modal_result">
          <div class="youtube_modal_rank">
            ${x + 1}
          </div>
          <div class="youtube_modal_info">
            ${g_youtubeResult[x].word}
            </div>
        </div>
      </div>`;
  }

  resultHtml += `
    <div class="youtube_modal_result_list">
      <div class="youtube_modal_result">
        <div class="youtube_modal_rank">
          <img class="youtube_modal_rank" src="/images/youtube/haha.png">
        </div>
        <div class="youtube_modal_info">
          ${g_youtubeResult[g_youtubeResult.length - 1].word}
         </div>
      </div>
    </div>`;

  document.getElementsByClassName('youtube_modal')[0].innerHTML = resultHtml;
}

// 정렬 알고리즘
function arrOrder(key: string) {
  return function (a: response, b: response) {
    if (Number(a[key]) > Number(b[key])) {
      return -1;
    } else if (Number(a[key]) < Number(b[key])) {
      return 1;
    }

    return 0;
  };
}

// 정렬 알고리즘 (세부)
function arrTitleOrder(key: string) {
  return function (a: response, b: response) {
    if (a[key].length > b[key].length) {
      return -1;
    } else if (a[key].length < b[key].length) {
      return 1;
    }
    return 0;
  };
}

// 결과창의 모든 박스가 열렸는지 확인
function allChecked() {
  if (g_youtubeResultCount >= 5 * g_youtubeResult.length) {
    clickResultSubmit();
  }
}
