import express from 'express';
import { hockeyController } from 'controllers/games';

const router = express.Router();

router.get('/', hockeyController.renderLobby);
router.get('/:roomname', hockeyController.renderPlayboard);

export default router;
