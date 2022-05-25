const mongoose = require('mongoose');
const { host, authdb, user, pass } = require('#config').database;

module.exports = () => {
  mongoose.connect(`mongodb://${host}/${authdb}`, { user, pass }, (err) => {
    err ? console.error(err) : console.info('\x1B[36mDB Connected.\x1B[0m');
  });
};
