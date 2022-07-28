import { getWeatherDay, getWeatherMl, getWeatherTa } from 'modules/games/m_weather';
import type { NextFunction, Request, Response } from 'types/apis';
import type { ReqWeatherDay, ReqWeatherWeek, ResWeather } from 'types/games/weather';

export function render(req: Request, res: Response, next: NextFunction) {
  res.render('weather/weather');
}

export async function getDay(req: Request<ReqWeatherDay>, res: Response<ResWeather>, next: NextFunction) {
  const { idx, nx, ny } = req.body;
  const data = await getWeatherDay(idx, nx, ny);
  res.json(data);
}

export async function getWeekTemp(req: Request<ReqWeatherWeek>, res: Response<ResWeather>, next: NextFunction) {
  const { idx, reg } = req.body;
  const data = await getWeatherTa(idx, reg);
  res.json(data);
}

export async function getWeekLand(req: Request<ReqWeatherWeek>, res: Response<ResWeather>, next: NextFunction) {
  const { idx, reg } = req.body;
  const data = await getWeatherMl(idx, reg);
  res.json(data);
}
