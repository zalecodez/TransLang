var express = require('express'),
    router = express.Router(),
    indexRouter = require('./IndexRouter'),
    translateRouter = require('./TranslateRouter');

module.exports = function(server){
    server.use('/', indexRouter);
    server.use('/api/translate', translateRouter);
};


