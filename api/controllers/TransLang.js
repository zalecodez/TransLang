'use strict';
const spawn = require('child_process').spawn,
  Helper = require('./helper'),
  path = require('path');

exports.translate = function(req, res){
  const text = req.query.text;
  console.log(req.query);
  console.log(`About to call python TransLang.py ${text}`);

  const pythonProcess = spawn('python', ['../../TransLang.py', text], {cwd: __dirname});

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
      res.status(200).sendFile(path.join(__dirname, '../../public', 'output.mp3'))
    }
    else{
      Helper.send500(res, "Internal Server Error");
    }
  });

};

