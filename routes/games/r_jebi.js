const express = require('express');
const { submitRanking } = require('#modules/jebi/m_jebi');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('jebi/jebi');
});

router.post('/ranking', async (req, res, next) => {
  const { n, dog } = req.body;
  const data = await submitRanking(n, dog);
  res.json(data);
});

module.exports = router;
