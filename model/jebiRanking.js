const { Schema, model } = require('mongoose');

const rankingSchema = new Schema({
  n: { type: Number, required: true },
  count: { type: [Number], required: true },
  total: { type: Number, required: true },
});

const Ranking = model('Ranking', rankingSchema);

module.exports = Ranking;
