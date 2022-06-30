declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      MONGOOSE_AUTH: number;
      MONGOOSE_ID: string;
      MONGOOSE_PW: string;
      YOUTUBE_DATA_API_V3_KEY: string;
      WEATHER_KEY: string;
    }
  }
  type li = HTMLLIElement;
  type div = HTMLDivElement;
  type img = HTMLImageElement;
  type span = HTMLSpanElement;
  type input = HTMLInputElement;
  type button = HTMLButtonElement;
  type template = HTMLTemplateElement;
  type p = HTMLParagraphElement;
}

export {};
