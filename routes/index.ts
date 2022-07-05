import express from 'express';
import { jebi, random, weather, wordle, youtube } from './games';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('home');
});

router.use('/jebi', jebi);
router.use('/random', random);
router.use('/weather', weather);
router.use('/wordle', wordle);
router.use('/youtube', youtube);

export default router;
