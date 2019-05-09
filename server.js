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
    spawn = require('child_process').spawn,
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

  socket.on('textMessage', (data) => {
    translateText(data.inlang, data.outlang, data.text.text)
    .then((outputPath) => {
      console.log(outputPath);
      fs.readFile(outputPath, (err, translation) => {
        const response = {
          inlang: data.inlang, 
          outlang: data.outlang,
          inlangContent: data.text.text,
          outlangContent: translation.toString(),
        };
        socket.emit('textMessage', response);
      });
    });
  });

  socket.on('voiceMessage', (data) => {
    //var filename = path.basename(data.name);
    //stream.pipe(fs.createWriteStream(filename));
    console.log(data);

    var bitmap = new Buffer(data.data, 'base64');
    
    const file = path.join(__dirname, 'tmp/', data.name);
    fs.writeFile(file, bitmap, (err) => {
      if(err) throw err;
      console.log('Saved!');

      translate(data.inlang, data.outlang, file)
      .then((outputPath) => {
        console.log(outputPath);

        fs.readFile(outputPath, (err, translatedData) => {
          var base64Audio = new Buffer(translatedData).toString('base64');
          socket.emit('voiceMessage', {
            inlang: data.inlang,
            outlang: data.outlang,
            inlangAudio: data.data,
            outlangAudio: base64Audio,
          });
        });
      });
    });
  });
});

setInterval(() => {
  io.emit('ping', {data: (new Date())/1});
}, 1000);

http.listen(port, () => {
  console.log("TransLang API Server started on port " + port);
});



const translate = function(inlang, outlang, inputPath){
  return new Promise((resolve, reject) => {
    const newInputPath = path.join(path.dirname(inputPath), 'in.flac');

    console.log(`About to call ffmpeg -i ${inputPath} -f flac ${newInputPath}`);
    const convertProcess = spawn('ffmpeg', ['-i', inputPath, '-f', 'flac', newInputPath], {cwd: __dirname});
    convertProcess.on('error', function(err){
      console.log(err);
      reject(err);
    });

    convertProcess.on('close', function(code){
      console.log('Convert Exit Code', code);
      if(code != 0){
        reject("File Conversion Error");
      }
      else{
        console.log(`About to call python TransLang_v2.py ${newInputPath} ${inlang} ${outlang}`);
        const pythonProcess = spawn('python', ['./TransLang_v2.py', newInputPath, inlang, outlang], {cwd: __dirname});

        pythonProcess.stdout.on('data', (data) => {
          console.log(`Output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
          console.log(`Error: ${data}`);
        });

        pythonProcess.on('error', function(err){
          console.log(err);
          reject(err);
        });

        pythonProcess.on('close', function(code){
          fs.unlink(newInputPath, (err) => {
            if(err) throw err;
            console.log('input file deleted');
          });

          console.log(`Exit Code: ${code}`);
          if(code == 0){
            resolve(path.join(__dirname, 'public/', 'output.mp3'));
          }
          else{
            reject("Python Process Failed");
          }
        });
      }
      fs.unlink(inputPath, (err) => {
        if(err) throw err;
        console.log('old input file deleted');
      });
    });
  });
};

translateText = function(inlang, outlang, input){
  console.log(input);
  return new Promise((resolve, reject) => {
    console.log(`About to call python textTransLang.py ${input} ${inlang} ${outlang}`);
    const pythonProcess = spawn('python', ['textTransLang.py', input, inlang, outlang], {cwd: __dirname});

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Output: ${data}`);

    });

    pythonProcess.stderr.on('data', (data) => {
      console.log(`Error: ${data}`);
    });

    pythonProcess.on('error', function(err){
      console.log(err);
    });

    pythonProcess.on('close', function(code){
      console.log(`Exit Code: ${code}`);
      if(code == 0){
        resolve(path.join(__dirname, 'public/', 'translation.txt'));
      }
      else{
        reject("Internal Server Error");
      }
    });
  });
};

