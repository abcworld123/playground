var axios = require('axios').default;
var config = require('../../config/config');

exports.getResult = async function (req, res, callback) {
  const dataList = req.body.word;
  let resultData = dataList.map((data) => getInfo(data));
  resultData = await Promise.all(resultData);
  return callback(resultData);
};

function getInfo(keyword) {
  return new Promise(async function (resolve, reject) {
    let response;
    const urlSearch = 'https://www.googleapis.com/youtube/v3/search';
    const urlGetVideo = 'https://www.googleapis.com/youtube/v3/videos';
    const qsGetVideo = { key: config.youtube.key, part: 'snippet,statistics' };
    const qsSearch = {
      part: 'snippet',
      type: 'video',
      maxResults: '1',
      q: keyword,
      key: config.youtube.key,
    };
    try {
      response = await axios.get(urlSearch, { params: qsSearch });
      qsGetVideo.id = response.data.items[0].id.videoId;
      response = await axios.get(urlGetVideo, { params: qsGetVideo });
      const { statistics, snippet } = response.data.items[0];
      resolve({
        viewCount: statistics.viewCount,
        likeCount: statistics.likeCount,
        commentCount: statistics.commentCount,
        title: snippet.title,
        thumbnails: snippet.thumbnails.high.url,
        word: keyword,
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
