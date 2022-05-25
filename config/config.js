require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DATABASE_URL,
    authdb: process.env.MONGOOSE_AUTH,
    user: process.env.MONGOOSE_ID,
    pass: process.env.MONGOOSE_PW,
  },
  youtube: {
    key: process.env.YOUTUBE_DATA_API_V3_KEY,
  },
  weather: {
    key: process.env.WEATHER_KEY,
  },
};
