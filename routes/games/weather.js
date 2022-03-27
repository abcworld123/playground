var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('games/weather');
});

router.post('/getWeatherDay', (req, res, next) => {
  let sec = (new Date().getTime() + 25200000);
  sec += -sec % 10800000 + 7200000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '');
  const date = now.substring(0, 8);
  const time = now.substring(8, 12);
  const category = ['', 'TMP', 'REH', 'WSD', 'SKY'];
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

router.post('/getWeatherWeek', (req, res, next) => {
  let sec = (new Date().getTime() + 10800000);
  sec += -sec % 43200000 + 21600000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '').substring(0, 12);
  const regId = ['', '11B10101', '11H20201', '11H10701', '11B20201', '11C20401', '11F20501', '11H20101'];
  const regIdx = req.body.reg;
  const idx = req.body.idx;
  const taTarget = ['taMax', 'taMin'][idx - 5];
  let arr = [];

  request.get({
    url: 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa',
    qs: {
      serviceKey: process.env.WEATHER_KEY,
      dataType: 'json',
      regId: regId[regIdx],
      tmFc: now
    },
    json: true
  }, (error, response, body) => {
    if (error) res.status(500).send('getWeather: error');
    const data = body.response.body.items.item[0];
    for (let i = 3; i < 10; i++) {
      arr.push(data[`${taTarget}${i}`]);
    }
    res.send(arr);
  });
});

module.exports = router;
