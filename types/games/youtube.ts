import type { ResDefault } from 'types/apis';

export interface YoutubeItemInfo {
  viewCount: number;
  likeCount: number;
  commentCount: number;
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
