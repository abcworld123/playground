import { Schema, model } from 'mongoose';

const rankingSchema = new Schema({
  n: { type: Number, required: true },
  count: { type: [Number], required: true },
  total: { type: Number, required: true },
});

const Ranking = model('Ranking', rankingSchema);

export default Ranking;
