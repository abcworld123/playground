import type { ResDefault } from 'types/apis';

export interface ResJebiSubmit extends ResDefault {
  data?: {
    rank: number;
    total: number;
    top: number;
  };
}
