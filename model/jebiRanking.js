const mongoose = require('mongoose');
const Ranking = mongoose.model('Ranking', {
  n: Number,
  count: [Number],
  total: Number,
});
module.exports = Ranking;
