'use strict';
var spawn = require('child_process').spawn,
  Helper = require('./helper'),
  formidable = require('formidable'),
  multer = require('multer'),
  fs = require('fs'),
  path = require('path');

exports.translate = function(req, res){
  const text = req.query.text;
  if(!text){
    return Helper.send400(res, "Usage: /api/translate?text=sentence to translate");
  }

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

exports.translateV2 = function(req,res){
  var input = req.file;
  var inlang = req.body.inlang || 'en-US';
  var outlang = req.body.outlang || 'es-US';

  console.log(req.body);
  console.log(input);

  if(!input){
    return Helper.send400(res, "Usage: /api/translate?text=sentence to translate");
  }



  const inputPath = path.join(__dirname, '../../', input.path);
  const newInputPath = path.join(path.dirname(inputPath), 'in.flac');

  console.log(`About to call ffmpeg -i ${inputPath} -f flac ${newInputPath}`);
  const convertProcess = spawn('ffmpeg', ['-i', inputPath, '-f', 'flac', newInputPath], {cwd: __dirname});
  convertProcess.on('error', function(err){
    console.log(err);
  });

  convertProcess.on('close', function(code){
    console.log('Convert Exit Code', code);
    if(code != 0){
      Helper.send500(res, "File Conversion Error");
    }
    else{

      console.log(`About to call python TransLang_v2.py ${newInputPath} ${inlang} ${outlang}`);
      const pythonProcess = spawn('python', ['../../TransLang_v2.py', newInputPath, inlang, outlang], {cwd: __dirname});

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
          res.redirect('/output.mp3');
          //res.status(200).sendFile(path.join(__dirname, '../../public', 'output.mp3'))
        }
        else{
          Helper.send500(res, "Internal Server Error");
        }
        fs.unlink(newInputPath, (err) => {
          if(err) throw err;
          console.log('input file deleted');
        });
      });
    }
    //fs.unlink(inputPath, (err) => {
    //  if(err) throw err;
    //  console.log('old input file deleted');
    //});
  });

};

