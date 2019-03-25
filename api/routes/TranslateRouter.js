//UserRouter.js - router for user resources

var express = require('express'),
    router = express.Router(),
    TransLang = require('../controllers/TransLang.js');

router.get('/', TransLang.translate);

module.exports = router;
