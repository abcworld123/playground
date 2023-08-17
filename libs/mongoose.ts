import mongoose from 'mongoose';
import config from 'config';

const { host, authdb, user, pass } = config.database;

export async function dbConnect() {
  try {
    await mongoose.connect(`mongodb://${host}/${authdb}`, { user, pass });
  } catch (err) {
    console.error(err);
    return;
  }
  console.info('\x1B[36mDB Connected.\x1B[0m');
}
