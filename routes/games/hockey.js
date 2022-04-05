var express = require('express');
var router = express.Router();
const hockey = require('../../modules/games/hockey');

router.get('/', (req, res, next) => {
    res.render('games/hockey');
});

module.exports = router;
