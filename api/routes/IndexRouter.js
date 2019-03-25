'use strict';

var express = require('express'),
    router = express.Router();

//TODO create documentation and return here
router.get('/', function(req, res){
    res.status(200).send({
        endpoints: ['/api/translate'],
    });
});

module.exports = router;

