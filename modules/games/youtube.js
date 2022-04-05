var request = require("request");
var config = require('../../config/config');

exports.getResult = async function(req, res, callback){
    const dataList = req.body.word
    let resultData = []

    dataList.forEach((data) => {
        resultData.push(getInfo(data))
    })

    resultData = await Promise.all(resultData)
    return callback(resultData)
}

function getInfo(keyword){
    return new Promise(async function (resolve, reject) {
        let searchUrl
        let videoId
        let videoUrl
        let videoInfo

        searchUrl = {
            uri: "https://www.googleapis.com/youtube/v3/search",
            qs:{
                part:"snippet",
                type:"video",
                maxResults:"1",
                q:keyword,
                key:config.youtube.key,
            }
        }

        videoId = await getVideoId(searchUrl)

        videoUrl = {
            uri: "https://www.googleapis.com/youtube/v3/videos",
            qs:{
                id:videoId,
                key:config.youtube.key,
                part:"snippet,statistics"
            }
        }

        videoInfo = await getVideoInfo(videoUrl, keyword)

        resolve(videoInfo)
    });
}

async function getVideoId(searchUrl) {
    return new Promise(function (resolve, reject) {
        request(searchUrl, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                const obj = JSON.parse(body)
                resolve(obj.items[0].id.videoId)
            } else {
                reject(error);
            }
        });
    });
}

async function getVideoInfo(videoUrl, word) {
    return new Promise(function (resolve, reject) {
        request(videoUrl, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                const obj = JSON.parse(body)
                const videoInfo = obj.items[0]

                resolve({
                    viewCount : videoInfo.statistics.viewCount,
                    likeCount : videoInfo.statistics.likeCount,
                    commentCount : videoInfo.statistics.commentCount,
                    title : videoInfo.snippet.title,
                    thumbnails : videoInfo.snippet.thumbnails.high.url,
                    word : word
                })
            } else {
                reject(error);
            }
        });
    });
}
