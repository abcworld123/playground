declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      DATABASE_URL: string;
      MONGOOSE_AUTH: number;
      MONGOOSE_ID: string;
      MONGOOSE_PW: string;
      YOUTUBE_DATA_API_V3_KEY: string;
      WEATHER_KEY: string;
    }
  }
}

export {};
