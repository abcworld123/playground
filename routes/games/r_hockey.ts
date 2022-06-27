import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('hockey/lobby');
});

router.get('/:roomname', (req, res, next) => {
  res.render('hockey/playboard');
});

export default router;
