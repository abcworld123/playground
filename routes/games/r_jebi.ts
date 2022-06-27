import express from 'express';
import { submitRanking } from 'modules/games/m_jebi';
import type { ReqJebiSubmit, ResJebiSubmit } from 'types/games/jebi';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('jebi/jebi');
});

router.post<null, ResJebiSubmit, ReqJebiSubmit>('/submit', async (req, res, next) => {
  const { n, dog } = req.body;
  const data = await submitRanking(n, dog);
  res.json(data);
});

export default router;
