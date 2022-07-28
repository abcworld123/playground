import type { NextFunction, Request, Response } from 'types/apis';

export function render(req: Request, res: Response, next: NextFunction) {
  res.render('random/random');
}
