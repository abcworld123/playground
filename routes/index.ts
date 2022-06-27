import express from 'express';
import { jebi, random, weather, wordle, youtube } from './games';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/jebi', jebi);
router.use('/random', random);
router.use('/weather', weather);
router.use('/wordle', wordle);
router.use('/youtube', youtube);

router.use((req, res, next) => {
  res.status(404).render('cannotAccess');
  console.warn(`not exists: ${req.url}`);
});

export default router;
