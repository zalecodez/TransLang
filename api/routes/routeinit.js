var express = require('express'),
    router = express.Router(),
    indexRouter = require('./IndexRouter'),
    translateRouter = require('./TranslateRouter');
    v2TranslateRouter = require('./v2TranslateRouter');

module.exports = function(server){
    server.use('/', indexRouter);
    server.use('/api/translate', translateRouter);
    server.use('/api/v2', v2TranslateRouter);
};


