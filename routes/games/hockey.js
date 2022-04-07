var express = require('express');
var router = express.Router();
const hockey = require('../../modules/games/hockey');

router.get('/', (req, res, next) => {
    res.render('games/hockey/lobby');
});

router.get('/:roomname', (req, res, next) => {
    res.render('games/hockey/playboard');
});

module.exports = router;
