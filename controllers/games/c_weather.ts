import { getWeatherDay, getWeatherMl, getWeatherTa } from 'modules/games/m_weather';
import type { ReqWeatherDay, ReqWeatherWeek, ResWeather } from 'types/games/weather';

export function render(req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) {
  res.render('weather/weather');
}

export async function getDay(req: ExpressRequest<ReqWeatherDay>, res: ExpressResponse<ResWeather>, next: ExpressNextFunction) {
  const { idx, nx, ny } = req.body;
  const data = await getWeatherDay(idx, nx, ny);
  res.json(data);
}

export async function getWeekTemp(req: ExpressRequest<ReqWeatherWeek>, res: ExpressResponse<ResWeather>, next: ExpressNextFunction) {
  const { idx, reg } = req.body;
  const data = await getWeatherTa(idx, reg);
  res.json(data);
}

export async function getWeekLand(req: ExpressRequest<ReqWeatherWeek>, res: ExpressResponse<ResWeather>, next: ExpressNextFunction) {
  const { idx, reg } = req.body;
  const data = await getWeatherMl(idx, reg);
  res.json(data);
}
