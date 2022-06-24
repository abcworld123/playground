const express = require('express');
const { getWeatherDay, getWeatherTa, getWeatherMl } = require('#modules/weather/m_weather');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('weather/weather');
});

router.post('/getWeatherDay', async (req, res, next) => {
  const { idx, nx, ny } = req.body;
  const data = await getWeatherDay(idx, nx, ny);
  res.json(data);
});

router.post('/getWeatherTa', async (req, res, next) => {
  const { idx, reg } = req.body;
  const data = await getWeatherTa(idx, reg);
  res.json(data);
});

router.post('/getWeatherMl', async (req, res, next) => {
  const { idx, reg } = req.body;
  const data = await getWeatherMl(idx, reg);
  res.json(data);
});

module.exports = router;
