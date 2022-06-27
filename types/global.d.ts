declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: number;
      DB_DATABASE: string;
      DB_USER: string;
      DB_PASS: string;
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
