import mongoose from 'mongoose';
import config from 'config';

const { host, authdb, user, pass } = config.database;

export function dbConnect() {
  mongoose.connect(`mongodb://${host}/${authdb}`, { user, pass }, (err) => {
    err ? console.error(err) : console.info('\x1B[36mDB Connected.\x1B[0m');
  });
}
