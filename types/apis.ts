import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';

export interface ResDefault {
  success: boolean;
  data?: any;
}

interface RequestData {
  params?: any;
  body?: any;
  query?: any;
}

interface ResponseData {
  data?: any;
}

export type Request<T extends RequestData = any> = ExpressRequest<T['params'], null, T['body'], T['query']>;
export type Response<T extends ResponseData = any> = ExpressResponse<T>;
export type NextFunction = ExpressNextFunction;
