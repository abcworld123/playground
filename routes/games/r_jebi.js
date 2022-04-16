const express = require('express');
const router = express.Router();
const r_jebi = require('#modules/jebi/m_jebi');

router.get('/', (req, res, next) => {
  res.render('jebi/jebi');
});

router.post('/ranking', async (req, res, next) => {
  r_jebi.submitRanking(req, res, next);
});

module.exports = router;
