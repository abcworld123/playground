const g_youtubeRotation = ['조회수', '좋아요', '댓글수', '제목길이']
let g_youtubeResultCheck = []
let g_youtubeResultCount = 0
let g_youtubeResult = []

window.addEventListener("load", function() {
  document.getElementsByClassName('youtube_btn')[0].addEventListener('click', addMember)
  document.getElementsByClassName('youtube_btn')[1].addEventListener('click', rotationCategory)
  document.getElementsByClassName('youtube_submit_btn')[0].addEventListener('click', getResult)
});

// 참가자 추가
function addMember() {
  const youtubeInput = document.getElementsByClassName('youtube_input_area')[0]

  youtubeInput.innerHTML = youtubeInput.innerHTML + "<input class=\"youtube_input_text\">"
}

// 게임 종목 변경
function rotationCategory() {
  const youtubeCategory = document.getElementsByClassName('youtube_btn')[1]
  const category = youtubeCategory.innerHTML.trim()

  youtubeCategory.innerHTML = g_youtubeRotation[(g_youtubeRotation.indexOf(category) + 1) % 4]
}

// 결과 창 변경
async function getResult() {
  document.getElementsByClassName('youtube_loading_modal')[0].style.display = 'flex'

  const youtubeCategory = document.getElementsByClassName('youtube_btn')[1].innerHTML.trim()
  const youtubeInputArea = document.getElementsByClassName('youtube_input_area')[0]
  const youtubeInput = youtubeInputArea.getElementsByTagName('input')
  let word = []
  let individuallyWord = ""

  for(let x = 0; x < youtubeInput.length; x++){
    individuallyWord = youtubeInput[x].value.trim()
    if(individuallyWord.length === 0){
      alert("빈 값이 존재합니다.")
      return
    }

    word.push(individuallyWord)
  }

  // 유튜브 api로 결과를 받아온다
  $.ajax({
    url: "/youtube/result",
    type: "POST",
    datatype: 'json',
    traditional: true,
    data: {
      word: word,
      type: youtubeCategory
    },
    async: true,
    success: function (result) {
      document.getElementsByClassName('youtube_loading_modal')[0].style.display = 'none'
      g_youtubeResult = result

      document.getElementsByClassName('youtube_contain')[0].style.display = 'none'
      document.getElementsByClassName('youtube_result_body')[0].style.display = 'block'

      let resultHtml = ""
      for (let x = 0; x < result.length; x++){
        resultHtml+=`<div class="youtube_result_one_list">
                       <div class="youtube_result_word">` +
                         result[x].word +
                     ` </div>
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
                     <hr>`
        g_youtubeResultCheck.push([0, 0, 0, 0, 0])
      }
      resultHtml +=`<div class="youtube_result_submit">
                      결과 보기
                    </div>`

      document.getElementsByClassName('youtube_result_body')[0].innerHTML = resultHtml

      for(let x = 0; x < result.length; x++){
        document.getElementsByClassName('youtube_result_thumbnails_area')[x].addEventListener('click',clickHiddenThumbnails.bind(this, x))
        document.getElementsByClassName('youtube_result_title_area')[x].addEventListener('click',clickHiddenTitle.bind(this, x))
        document.getElementsByClassName('youtube_result_views_area')[x].addEventListener('click',clickHiddenViews.bind(this, x))
        document.getElementsByClassName('youtube_result_comment_area')[x].addEventListener('click',clickHiddenComment.bind(this, x))
        document.getElementsByClassName('youtube_result_like_area')[x].addEventListener('click',clickHiddenLike.bind(this, x))
      }
      document.getElementsByClassName('youtube_result_submit')[0].addEventListener('click', clickResultSubmit)
    }
  });
}

// 썸네일 박스를 누를 때 동작
function clickHiddenThumbnails(num) {
  if(g_youtubeResultCheck[num][0] === 0){
    g_youtubeResultCheck[num][0] = 1
    g_youtubeResultCount += 1

    let imgTag = "<img class=\"youtube_result_show_thumbnails\" src=\"" + g_youtubeResult[num].thumbnails + "\">"

    document.getElementsByClassName('youtube_result_thumbnails_area')[num].innerHTML = imgTag

  }
}

// 제목 박스를 누를 때 동작
function clickHiddenTitle(num) {
  if(g_youtubeResultCheck[num][1] === 0){
    g_youtubeResultCheck[num][1] = 1
    g_youtubeResultCount += 1

    let titleTag = "<div title='" + g_youtubeResult[num].title.length + "' class=\"youtube_result_title\">"
    titleTag += g_youtubeResult[num].title
    titleTag += "</div>"

    document.getElementsByClassName('youtube_result_title_area')[num].innerHTML = titleTag

    allChecked()
  }
}

// 조회수 박스를 누를 때 동작
function clickHiddenViews(num) {
  if(g_youtubeResultCheck[num][2] === 0){
    g_youtubeResultCheck[num][2] = 1
    g_youtubeResultCount += 1

    let viewsTag = "<div class=\"youtube_result_small_text\">"
    viewsTag +="조회수 : " + g_youtubeResult[num].viewCount
    viewsTag += "</div>"

    document.getElementsByClassName('youtube_result_views_area')[num].innerHTML = viewsTag

    allChecked()
  }
}

// 댓글 박스를 누를 때 동작
function clickHiddenComment(num) {
  if(g_youtubeResultCheck[num][3] === 0){
    g_youtubeResultCheck[num][3] = 1
    g_youtubeResultCount += 1

    let commentTag = "<div class=\"youtube_result_small_text\">"
    commentTag +="댓글수 : " + g_youtubeResult[num].commentCount
    commentTag += "</div>"

    document.getElementsByClassName('youtube_result_comment_area')[num].innerHTML = commentTag

    allChecked()
  }
}

// 좋아요 박스를 누를 때 동작
function clickHiddenLike(num) {
  if(g_youtubeResultCheck[num][4] === 0){
    g_youtubeResultCheck[num][4] = 1
    g_youtubeResultCount += 1

    let likeTag = "<div class=\"youtube_result_small_text\">"
    likeTag +="좋아요 : " + g_youtubeResult[num].likeCount
    likeTag += "</div>"

    document.getElementsByClassName('youtube_result_like_area')[num].innerHTML = likeTag

    allChecked()
  }
}

// 결과창 표시 (순위를 보여준다)
function clickResultSubmit(){
  for(let x = 0; x < g_youtubeResult.length; x++){
    document.getElementsByClassName('youtube_result_thumbnails_area')[x].click()
    document.getElementsByClassName('youtube_result_title_area')[x].click()
    document.getElementsByClassName('youtube_result_views_area')[x].click()
    document.getElementsByClassName('youtube_result_comment_area')[x].click()
    document.getElementsByClassName('youtube_result_like_area')[x].click()
  }

  const youtubeCategory = document.getElementsByClassName('youtube_btn')[1]
  const category = youtubeCategory.innerHTML.trim()
  let resultHtml = ""

  if(category === "조회수"){
    g_youtubeResult.sort(arrOrder("viewCount"));
  }else if(category === "좋아요"){
    g_youtubeResult.sort(arrOrder("likeCount"));
  }else if(category === "댓글수"){
    g_youtubeResult.sort(arrOrder("commentCount"));
  }else if(category === "제목길이"){
    g_youtubeResult.sort(arrTitleOrder("title"));
  }

  document.getElementsByClassName('modal')[0].style.display = 'block'

  resultHtml +=`<div class="youtube_modal_result_list">
                  <div class="youtube_modal_result">
                    <div class="youtube_modal_rank">
                      <img class="youtube_modal_rank" src="/icon/1st.png">
                    </div>"
                    <div class="youtube_modal_info">` +
                      g_youtubeResult[0].word +
                `   </div>
                  </div>
                </div>`

  for (let x = 1; x < g_youtubeResult.length - 1 ; x++){

    resultHtml +=`<div class="youtube_modal_result_list">
                    <div class="youtube_modal_result">
                      <div class="youtube_modal_rank">
                        String(x + 1)
                      </div>
                      <div class="youtube_modal_info">` +
                        g_youtubeResult[x].word +
                      `</div>
                    </div>
                  </div>`
  }

  resultHtml +=`<div class="youtube_modal_result_list">
                  <div class="youtube_modal_result">
                    <div class="youtube_modal_rank">
                      <img class="youtube_modal_rank" src="/icon/haha.png">
                    </div>
                    <div class="youtube_modal_info">` +
                      g_youtubeResult[g_youtubeResult.length - 1].word +
                   `</div>
                  </div>
                </div>`

  document.getElementsByClassName('youtube_modal')[0].innerHTML = resultHtml
}

// 정렬 알고리즘
function arrOrder(key) {
  return function(a, b) {
    if (Number(a[key]) > Number(b[key])) {
      return -1;
    } else if (Number(a[key]) < Number(b[key])) {
      return 1;
    }

    return 0;
  }
}

// 정렬 알고리즘 (세부)
function arrTitleOrder(key) {
  return function(a, b) {
    if (a[key].length > b[key].length) {
      return -1;
    } else if (a[key].length < b[key].length) {
      return 1;
    }
    return 0;
  }
}

// 결과창의 모든 박스가 열렸는지 확인
function allChecked(){
  if(g_youtubeResultCount >= 5 * g_youtubeResult.length){
    clickResultSubmit()
  }
}
