import express from 'express';
import { hockey, jebi, mole, random, weather, wordle, youtube } from './games';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('home');
});

router.use('/hockey', hockey);
router.use('/jebi', jebi);
router.use('/mole', mole);
router.use('/random', random);
router.use('/weather', weather);
router.use('/wordle', wordle);
router.use('/youtube', youtube);

export default router;
