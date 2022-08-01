import type { ResDefault } from '../apis';

// backend apis
export interface ReqWeatherDay {
  body: {
    idx: number;
    nx: number;
    ny: number;
  };
}

export interface ReqWeatherWeek {
  body: {
    idx: number;
    reg: number;
  };
}

export interface ResWeather extends ResDefault {
  data?: number[];
}

// 기상청 apis
export type ResKmaWeatherDay = ResKmaApi<KmaDayData>;
export type ResKmaWeatherTa = ResKmaApi<KmaTaData>;
export type ResKmaWeatherMl = ResKmaApi<KmaMlData>;

export interface KmaDayBody {
  serviceKey: string;
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
  pageNo?: 1;
  numOfRows?: 84;
  dataType?: 'json' | 'xml';
}

export interface KmaWeekBody {
  serviceKey: string;
  regId: string;
  tmFc: string;
  dataType?: 'json' | 'xml';
}

interface ResKmaApi<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body?: {
      dataType: 'JSON' | 'XML';
      items: {
        item: T[];
      };
      pageNo: number;
      nomOfRows: number;
      totalCount: number;
    };
  };
}

interface KmaDayData {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

interface KmaTaData {
  regId: string;
  taMin3: number;
  taMin3Low: number;
  taMin3High: number;
  taMax3: number;
  taMax3Low: number;
  taMax3High: number;
  taMin4: number;
  taMin4Low: number;
  taMin4High: number;
  taMax4: number;
  taMax4Low: number;
  taMax4High: number;
  taMin5: number;
  taMin5Low: number;
  taMin5High: number;
  taMax5: number;
  taMax5Low: number;
  taMax5High: number;
  taMin6: number;
  taMin6Low: number;
  taMin6High: number;
  taMax6: number;
  taMax6Low: number;
  taMax6High: number;
  taMin7: number;
  taMin7Low: number;
  taMin7High: number;
  taMax7: number;
  taMax7Low: number;
  taMax7High: number;
  taMin8: number;
  taMin8Low: number;
  taMin8High: number;
  taMax8: number;
  taMax8Low: number;
  taMax8High: number;
  taMin9: number;
  taMin9Low: number;
  taMin9High: number;
  taMax9: number;
  taMax9Low: number;
  taMax9High: number;
  taMin10: number;
  taMin10Low: number;
  taMin10High: number;
  taMax10: number;
  taMax10Low: number;
  taMax10High: number;
}

interface KmaMlData {
  regId: string;
  rnSt3Am: number;
  rnSt3Pm: number;
  rnSt4Am: number;
  rnSt4Pm: number;
  rnSt5Am: number;
  rnSt5Pm: number;
  rnSt6Am: number;
  rnSt6Pm: number;
  rnSt7Am: number;
  rnSt7Pm: number;
  rnSt8: number;
  rnSt9: number;
  rnSt10: number;
  wf3Am: string;
  wf3Pm: string;
  wf4Am: string;
  wf4Pm: string;
  wf5Am: string;
  wf5Pm: string;
  wf6Am: string;
  wf6Pm: string;
  wf7Am: string;
  wf7Pm: string;
  wf8: string;
  wf9: string;
  wf10: string;
}
