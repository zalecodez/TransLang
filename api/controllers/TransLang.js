'use strict';

const spawn = require('child_process').spawn;
var Helper = require('./helper');
var PythonShell = require('python-shell');

exports.translate = function(req, res){
  const text = req.query.text;
  console.log(req.query);
  console.log(`About to call python TransLang.py ${text}`);

  const pythonProcess = spawn('python', ['../../TransLang.py', text], {cwd: __dirname});

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Response: ${data}`);
    res.status(200).sendFile(path.join(__dirname, '../../public', 'output.mp3'))
  });

};

