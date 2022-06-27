import express from 'express';
import { getWeatherDay, getWeatherMl, getWeatherTa } from 'modules/games/m_weather';
import type { ReqWeatherDay, ReqWeatherWeek, ResWeather } from 'types/games/weather';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('weather/weather');
});

router.post<null, ResWeather, ReqWeatherDay>('/weatherday', async (req, res, next) => {
  const { idx, nx, ny } = req.body;
  const data = await getWeatherDay(idx, nx, ny);
  res.json(data);
});

router.post<null, ResWeather, ReqWeatherWeek>('/weatherta', async (req, res, next) => {
  const { idx, reg } = req.body;
  const data = await getWeatherTa(idx, reg);
  res.json(data);
});

router.post<null, ResWeather, ReqWeatherWeek>('/weatherml', async (req, res, next) => {
  const { idx, reg } = req.body;
  const data = await getWeatherMl(idx, reg);
  res.json(data);
});

export default router;
