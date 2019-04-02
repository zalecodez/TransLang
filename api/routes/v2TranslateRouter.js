'use strict';

var express = require('express'),
    router = express.Router(),
    TransLang = require('../controllers/TransLang.js'),
    multer = require('multer');

var upload = multer({dest: 'tmp/'});

router.post('/', upload.single('speechInput'), TransLang.translateV2);

module.exports = router;
