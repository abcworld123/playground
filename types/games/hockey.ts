export interface PlayerInfo {
  _id: string;
  x: number;
  y: number;
  dy: number;
  ySpeed: number;
  score: number;
}

export interface BallInfo {
  x: number;
  y: number;
  dx: number;
  dy: number;
  pause: number;
}

export interface GameInfo {
  time: number;
  left_time: number;
}

export interface PlayBoard {
  p1: PlayerInfo;
  p2: PlayerInfo;
  ball: BallInfo;
  info: GameInfo;
  gameBoard?: NodeJS.Timer;
}
