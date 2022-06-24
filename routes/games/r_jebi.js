const express = require('express');
const jebi = require('#modules/jebi/m_jebi');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('jebi/jebi');
});

router.post('/ranking', (req, res, next) => {
  jebi.submitRanking(req, res, next);
});

module.exports = router;
