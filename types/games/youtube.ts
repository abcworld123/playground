import type { ResDefault } from '../apis';

export interface YoutubeItemInfo {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  title: string;
  thumbnails: string;
  word: string;
}

export interface ReqYoutubeSubmit {
  body: {
    keywords: string[];
  };
}

export interface ResYoutubeSubmit extends ResDefault {
  data?: YoutubeItemInfo[];
}
