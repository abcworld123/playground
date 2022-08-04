import type { RequestData, ResponseData } from './apis';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';

declare global {
  // env
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DATABASE_URL: string;
      MONGOOSE_AUTH: string;
      MONGOOSE_ID: string;
      MONGOOSE_PW: string;
      YOUTUBE_DATA_API_V3_KEY: string;
      WEATHER_KEY: string;
    }
  }
  // express
  type Request<T extends RequestData = any> = ExpressRequest<T['params'], null, T['body'], T['query']>;
  type Response<T extends ResponseData = any> = ExpressResponse<T>;
  type NextFunction = ExpressNextFunction;
}
