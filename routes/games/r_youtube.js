const express = require('express');
const youtube = require('#modules/youtube/m_youtube');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('youtube/youtube');
});

router.post('/result', (req, res, next) => {
  youtube.getResult(req, res, function (callback) {
    res.send(callback);
  });
});

module.exports = router;
