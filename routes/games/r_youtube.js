const express = require('express');
const router = express.Router();
const r_youtube = require('#modules/youtube/m_youtube');

router.get('/', (req, res, next) => {
  res.render('youtube/youtube');
});

router.post('/result', (req, res, next) => {
  r_youtube.getResult(req, res, function (callback) {
    res.send(callback);
  });
});

module.exports = router;
