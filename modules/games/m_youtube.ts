import config from 'config';
import { google } from 'googleapis';
import response from 'modules/response';

const service = google.youtube('v3');

export async function getResult(keywords: string[]) {
  try {
    const resultList = keywords.map((keyword) => getInfo(keyword));
    const result = await Promise.all(resultList);
    return response(true, result);
  } catch (err) {
    console.error(err);
    return response(false);
  }
}

async function getInfo(keyword: string) {
  const search = await service.search.list({
    key: config.youtube.key,
    part: ['snippet'],
    type: ['video'],
    maxResults: 1,
    q: keyword,
  });
  const video = await service.videos.list({
    key: config.youtube.key,
    part: ['snippet', 'statistics'],
    id: [search.data.items[0].id.videoId],
  });
  const { statistics, snippet } = video.data.items[0];
  return {
    viewCount: statistics.viewCount,
    likeCount: statistics.likeCount,
    commentCount: statistics.commentCount,
    title: snippet.title,
    thumbnails: snippet.thumbnails.high.url,
    word: keyword,
  };
}
