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

var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    server = express(),
    http = require('http').Server(server),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    Helper = require('./api/controllers/helper'),
    io = require('socket.io')(http),
    ss = require('socket.io-stream');

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

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  });

  socket.on('voiceMessage', (data) => {
    //var filename = path.basename(data.name);
    //stream.pipe(fs.createWriteStream(filename));
    console.log(data);

    var bitmap = new Buffer(data.data, 'base64');
    fs.writeFile(data.name, bitmap, (err) => {
      if(err) throw err;
      console.log('Saved!');
    });
  });
});

setInterval(() => {
  io.emit('ping', {data: (new Date())/1});
}, 1000);

http.listen(port, () => {
  console.log("TransLang API Server started on port " + port);
});



//translateV3 = function(){
//  var input = req.file;
//  var inlang = req.body.inlang || 'en-US';
//  var outlang = req.body.outlang || 'es-US';
//
//  console.log(req.body);
//  console.log(input);
//
//  if(!input){
//    return Helper.send400(res, "Usage: /api/translate?text=sentence to translate");
//  }
//
//
//
//  const inputPath = path.join(__dirname, '../../', input.path);
//  const newInputPath = path.join(path.dirname(inputPath), 'in.flac');
//
//  console.log(`About to call ffmpeg -i ${inputPath} -f flac ${newInputPath}`);
//  const convertProcess = spawn('ffmpeg', ['-i', inputPath, '-f', 'flac', newInputPath], {cwd: __dirname});
//  convertProcess.on('error', function(err){
//    console.log(err);
//  });
//
//  convertProcess.on('close', function(code){
//    console.log('Convert Exit Code', code);
//    if(code != 0){
//      Helper.send500(res, "File Conversion Error");
//    }
//    else{
//
//      console.log(`About to call python TransLang_v2.py ${newInputPath} ${inlang} ${outlang}`);
//      const pythonProcess = spawn('python', ['../../TransLang_v2.py', newInputPath, inlang, outlang], {cwd: __dirname});
//
//      pythonProcess.stdout.on('data', (data) => {
//        console.log(`Output: ${data}`);
//      });
//
//      pythonProcess.stderr.on('data', (data) => {
//        console.log(`Error: ${data}`);
//      });
//
//      pythonProcess.on('error', function(err){
//        console.log(err);
//      });
//
//      pythonProcess.on('close', function(code){
//        console.log(`Exit Code: ${code}`);
//        if(code == 0){
//          res.redirect('/output.mp3');
//          //res.status(200).sendFile(path.join(__dirname, '../../public', 'output.mp3'))
//        }
//        else{
//          Helper.send500(res, "Internal Server Error");
//        }
//        fs.unlink(newInputPath, (err) => {
//          if(err) throw err;
//          console.log('input file deleted');
//        });
//      });
//    }
//    fs.unlink(inputPath, (err) => {
//      if(err) throw err;
//      console.log('old input file deleted');
//    });
//  });
//};
//
