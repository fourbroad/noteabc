// import 'upload-files';
import loader from '@notesabc/loader'

import './index.scss';

import Client from '@notesabc/frontend-client';

Client.login("administrator","!QAZ)OKM", function(err, client){
  if(err) return console.log(err);

  loader.load({
    name: "uploadfiles", 
    js: "@notesabc/upload-files/upload-files.bundle.js",
    css: '@notesabc/upload-files/upload-files.bundle.css'
  }, function(Domain){
    $('body').uploadfiles({
      token: client.getToken(),
      url: "http://localhost:8000/upload-files/"
    });
  });

});