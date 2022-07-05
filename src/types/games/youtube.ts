import type { ResDefault } from 'types/apis';

export interface ResYoutubeSubmit extends ResDefault {
  data?: YoutubeItemInfo[];
}

export interface YoutubeItemInfo {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  title: string;
  thumbnails: string;
  word: string;
}
