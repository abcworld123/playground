import type { Mutex } from 'async-mutex';

export interface ReqMolePlayboard {
  params: {
    roomname: string;
  };
}

export interface PlayerInfo {
  id: string;
  score: number;
}

export interface MoleInfo {
  x: number;
  y: number;
  w: number;
}

export interface GameInfo {
  moles: Map<number, MoleInfo>;
  moleCnt: number;
  deleteCnt: number;
  isEnd: boolean;
  time: number;
  timer: NodeJS.Timer;
  timeouts: NodeJS.Timeout[];
  mutex: Mutex;
}

export interface PlayBoard {
  p1: PlayerInfo;
  p2: PlayerInfo;
  info: GameInfo;
  board: Cell[][];
}

export enum Cell {
  NONE = 0,
  MOLE_PLUS = 1,
  MOLE_MINUS = 2,
  MOLE_BLIND = 3,
  DEAD = -1,
}
