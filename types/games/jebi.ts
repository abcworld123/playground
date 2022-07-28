import type { ResDefault } from 'types/apis';

export interface ReqJebiSubmit {
  body: {
    n: number;
    dog: number;
  };
}

export interface ResJebiSubmit extends ResDefault {
  data?: {
    rank: number;
    total: number;
    top: number;
  };
}
