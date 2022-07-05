import type { ResDefault } from 'types/apis';

export interface ReqYoutubeSubmit {
  keywords: string[];
}

export interface ResYoutubeSubmit extends ResDefault {
  data?: YoutubeItemInfo[];
}

interface YoutubeItemInfo {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  title: string;
  thumbnails: string;
  word: string;
}
