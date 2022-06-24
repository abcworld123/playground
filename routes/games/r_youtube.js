const express = require('express');
const { getResult } = require('#modules/youtube/m_youtube');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('youtube/youtube');
});

router.post('/result', async (req, res, next) => {
  const keywords = req.body.word;
  const data = await getResult(keywords);
  res.send(data);
});

module.exports = router;
