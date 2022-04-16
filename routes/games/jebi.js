var express = require('express');
var router = express.Router();
const jebi = require('#modules/games/jebi');

router.get('/', (req, res, next) => {
  res.render('games/jebi');
});

router.post('/ranking', async (req, res, next) => {
  jebi.submitRanking(req, res, next);
});

module.exports = router;
