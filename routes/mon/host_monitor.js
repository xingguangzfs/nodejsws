/**
 * Created by fushou on 2019/7/2.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index', { title: 'host monitor' });
});

module.exports = router;
