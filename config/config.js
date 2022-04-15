const path = require('path')
require('dotenv').config({path:path.join('.','.env')});

module.exports = {
    youtube: {
        key: process.env.YOUTUBE_DATA_API_V3_KEY
    },
    database:{
        mongooseAUTH: process.env.MONGOOSE_AUTH,
        mongooseID: process.env.MONGOOSE_ID,
        mongoosePW: process.env.MONGOOSE_PW,
        serverURL: process.env.DATABASE_URL
    },
}
