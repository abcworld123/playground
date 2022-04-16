const axios = require('axios').default;
const config = require('#config');

/* 오늘 날씨 맞히기 */
exports.getWeatherDay = (req, res, next) => {
  const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
  let sec = new Date().getTime() + 25200000;
  sec += -sec % 10800000 + 7200000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '');
  const base_date = now.substring(0, 8);
  const base_time = now.substring(8, 12);
  const category = ['', 'TMP', 'REH', 'WSD', 'SKY'];
  const {idx, nx, ny} = req.body;
  let arr;

  axios.get(url, {
    params: {
      serviceKey: config.weather.key,
      pageNo: 1,
      numOfRows: 84,
      dataType: 'json',
      base_date,
      base_time,
      nx,
      ny
    }
  })
  .then((response) => {
    const data = response.data.response.body.items.item;
    arr = data
      .filter((x) => x.category === category[idx])
      .map((x) => parseInt(x.fcstValue));
    res.send(arr);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('getWeather: error');
  });
};

/* 주간 날씨 맞히기 (최고, 최저 기온) */
exports.getWeatherTa = (req, res, next) => {
  const url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa';
  let sec = new Date().getTime() + 10800000;
  sec += -sec % 43200000 + 21600000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '').substring(0, 12);
  const regCodes = ['', '11B10101', '11H20201', '11H10701', '11B20201', '11C20401', '11F20501', '11H20101'];
  const regIdx = req.body.reg;
  const idx = req.body.idx;
  const taTarget = ['taMax', 'taMin'][idx - 5];
  const arr = [];

  axios.get(url, {
    params: {
      serviceKey: config.weather.key,
      dataType: 'json',
      regId: regCodes[regIdx],
      tmFc: now
    }
  })
  .then((response) => {
    const data = response.data.response.body.items.item[0];
    for (let i = 3; i < 10; i++) {
      arr.push(data[`${taTarget}${i}`]);
    }
    res.send(arr);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('getWeather: error');
  });
};

/* 주간 날씨 맞히기 (강수 확률) */
exports.getWeatherMl = (req, res, next) => {
  const url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
  let sec = new Date().getTime() + 10800000;
  sec += -sec % 43200000 + 21600000;
  const now = new Date(sec).toISOString().replace(/[T\-:]|\..+/g, '').substring(0, 12);
  const regId = ['', '11B00000', '11H20000', '11H10000', '11B00000', '11C20000', '11F20000', '11H20000'];
  const regIdx = req.body.reg;
  let arr = [];

  axios.get(url, {
    params: {
      serviceKey: config.weather.key,
      dataType: 'json',
      regId: regId[regIdx],
      tmFc: now
    }
  })
  .then((response) => {
    const data = response.data.response.body.items.item[0];
    arr = [
      data['rnSt3Pm'],
      data['rnSt4Pm'],
      data['rnSt5Pm'],
      data['rnSt6Pm'],
      data['rnSt7Pm'],
      data['rnSt8'],
      data['rnSt9'],
    ];
    res.send(arr);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('getWeather: error');
  });
};
