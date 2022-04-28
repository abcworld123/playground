const express = require('express');
const router = express.Router();
const youtube = require('#modules/youtube/m_youtube');

router.get('/', (req, res, next) => {
  res.render('youtube/youtube');
});

router.post('/result', (req, res, next) => {
  youtube.getResult(req, res, function (callback) {
    res.send(callback);
  });
});

module.exports = router;
