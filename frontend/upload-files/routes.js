/*
 * routes.js - module to provide routing
*/

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */

'use strict';
var router = require('express').Router();
var inspect = require('util').inspect;
var Busboy = require('busboy');
var path = require('path');
var os = require('os');
var fs = require('fs');

router.post('/files', function(request, response) {
  var busboy = new Busboy({
    headers: request.headers
  });
  var files = new Array();
  var size = 0;

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var f = "/files/" + filename;
    var saveTo = path.join(__dirname, f);
    file.pipe(fs.createWriteStream(saveTo));
    file.on('end', () => {
      var stats = fs.statSync(saveTo);
      files.push({
        name: filename,
        size: stats.size,
        mimetype: mimetype,
        url: f,
        thumbnailUrl: f,
        deleteUrl: f,
        deleteType: 'DELETE'
      });
    });
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  });

  busboy.on('finish', function() {
    response.send({
      files: files
    });
  });

  request.pipe(busboy);
});

router.delete('/files/:filename', function(request, response){
  var file = path.join(__dirname, "/files/" + request.params.filename);
  var result = {};
  if(fs.existsSync(file)){
    fs.unlinkSync(file);
    result[request.params.filename] = true;
  }  
  response.send(result);
});

router.get('/files', function(request, response){
  var p = path.join(__dirname, "/files/");
  var fileInfos = [];
  if(fs.existsSync(p)){
    var files = fs.readdirSync(p);
    files.forEach(function(index, file){
      fileInfos.push({
        name: file
      });
    });
  }
  response.send({files: fileInfos});
});

router.get('/', function(request, response) {
  response.redirect('/index.html');
});

router.all('/:obj_type/*?', function(request, response, next) {
  response.contentType('json');
  next();
});

router.get('/:obj_type/list', function(request, response) {
  crud.read(request.params.obj_type, {}, {}, function(map_list) {
    response.send(map_list);
  });
});

router.post('/:obj_type/create', function(request, response) {
  crud.construct(request.params.obj_type, request.body, function(result_map) {
    response.send(result_map);
  });
});

router.get('/:obj_type/read/:id', function(request, response) {
  crud.read(request.params.obj_type, {
    _id: makeMongoId(request.params.id)
  }, {}, function(map_list) {
    response.send(map_list);
  });
});

router.post('/:obj_type/update/:id', function(request, response) {
  crud.update(request.params.obj_type, {
    _id: makeMongoId(request.params.id)
  }, request.body, function(result_map) {
    response.send(result_map);
  });
});

router.get('/:obj_type/delete/:id', function(request, response) {
  crud.destroy(request.params.obj_type, {
    _id: makeMongoId(request.params.id)
  }, function(result_map) {
    response.send(result_map);
  });
});

module.exports = router;
