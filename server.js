//const app = require('express')();
//const http = require('http').createServer(app);
//const io = require('socket.io')(http);
//
//app.get('/', function(req, res){
//  res.sendfile('index.html');
//});
//
//io.on('connection', function(socket){
//  console.log('a user connected');
//});
//
//setInterval(() => {
//  console.log('pinging');
//  io.emit('ping', { data: (new Date())/1});
//}, 1000);
//
//http.listen(3000, function(){
//  console.log('listening on *:3000');
//});



require('dotenv').config();

var express = require('express'),
    server = express(),
    http = require('http').Server(server),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    Helper = require('./api/controllers/helper'),
    io = require('socket.io')(http);

server.use(express.static('public'));

server.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))

var routes = require('./api/routes/routeinit');
routes(server);

server.use(function(req, res){
    Helper.send404(res, "You Lost Bro");
});


io.on('connection', (socket) => {
  console.log('user connected');
});

setInterval(() => {
  io.emit('ping', {data: (new Date())/1});
}, 1000);

http.listen(port, () => {
  console.log("TransLang API Server started on port " + port);
});
