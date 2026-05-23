import type { RequestData, ResponseData } from './apis';
import type { Request, Response, NextFunction } from 'express';

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
  type ExpressRequest<T extends RequestData = any> = Request<T['params'], null, T['body'], T['query']>;
  type ExpressResponse<T extends ResponseData = any> = Response<T>;
  type ExpressNextFunction = NextFunction;
}
