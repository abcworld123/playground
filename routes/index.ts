import express from 'express';
import { homeController } from 'controllers';
import { hockey, jebi, random, weather, wordle, youtube } from './games';

const router = express.Router();

router.get('/', homeController.render);

router.use('/hockey', hockey);
router.use('/jebi', jebi);
router.use('/random', random);
router.use('/weather', weather);
router.use('/wordle', wordle);
router.use('/youtube', youtube);

export default router;
