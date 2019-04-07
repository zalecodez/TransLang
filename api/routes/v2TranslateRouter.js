'use strict';

var express = require('express'),
    router = express.Router(),
    TransLang = require('../controllers/TransLang.js'),
    multer = require('multer');

var upload = multer({dest: 'tmp/'});

router.post('/', (req, res, next)=>{console.log(req); next();}, upload.single('speechInput'), TransLang.translateV2);

module.exports = router;
