const mongoose = require('mongoose');
const { mongooseAUTH, mongooseID, mongoosePW, serverURL } = require('#config').database;

const mongooseOption = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  auth: {
    authdb: mongooseAUTH,
    username: mongooseID,
    password: mongoosePW,
  },
};

module.exports = () => {
  mongoose.connect(`mongodb://${serverURL}/${mongooseAUTH}`, mongooseOption, function (err) {
    err ? console.error(err) : console.info('\x1B[36mData DB Connected.\x1B[0m');
  });
};
