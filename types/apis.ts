export interface RequestData {
  params?: any;
  body?: any;
  query?: any;
}

export interface ResponseData {
  data?: any;
}

export interface ResDefault {
  success: boolean;
  data?: any;
}
