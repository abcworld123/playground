var express = require('express');
var router = express.Router();
const youtube = require('../../modules/games/youtube');

router.get('/', (req, res, next) => {
    res.render('games/youtube');
});

router.post('/result', (req, res, next) => {
    youtube.getResult(req,res,function (callback){
        res.send(callback)
    })
});

module.exports = router;
