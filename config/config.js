const path = require('path')
require('dotenv').config({path:path.join('.','.env')});

module.exports = {
    youtube: {
        key: process.env.YOUTUBE_DATA_API_V3_KEY
    }
}
