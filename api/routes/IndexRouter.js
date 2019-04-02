'use strict';

var express = require('express'),
    router = express.Router();

//TODO create documentation and return here
router.get('/', function(req, res){
    res.status(200).redirect('/client.html');
});

module.exports = router;

