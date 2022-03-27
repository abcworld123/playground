var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('games/weather');
});

router.post('/getWeather', (req, res, next) => {
  let sec = (new Date().getTime() + 36000000);
  sec += -sec % 10800000 + 7200000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '');
  const date = now.substring(0, 8);
  const time = now.substring(8, 12);
  const category = ['', 'TMP', 'REH', 'WSD'];
  const idx = req.body.idx;
  let arr = [];

  request.get({
    url: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
    qs: {
      serviceKey: process.env.WEATHER_KEY,
      pageNo: 1,
      numOfRows: 84,
      dataType: 'json',
      base_date: date,
      base_time: time,
      nx: req.body.nx,
      ny: req.body.ny
    },
    json: true
  }, (error, response, body) => {
    if (error) res.status(500).send('getWeather: error');
    const data = body.response.body.items.item;
    data.forEach((x) => {
      if (x.category === category[idx]) {
        arr.push(parseInt(x.fcstValue));
      }
    })
    res.send(arr);
  });
});

module.exports = router;
