require('dotenv').config();

var express = require('express'),
    server = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    Helper = require('./api/controllers/helper');


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

var routes = require('./api/routes/routeinit');
routes(server);

server.use(function(req, res){
    Helper.send404(res, "You Lost Bro");
});

server.listen(port);
console.log("TransLang API Server started on port " + port);


