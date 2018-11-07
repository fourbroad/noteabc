import * as $ from 'jquery';

//import 'bootstrap';

import Loader from 'loader';
import Client from '@notesabc/frontend-client'

import './index.scss';

$('body').css({
  position: 'absolute',
  height: '100%',
  width: '100%',
  margin: 0
});

window.Loader = Loader;
window.$ = $;

Client.login("administrator","!QAZ)OKM", function(err1, client){
  if(err1) return console.log(err1);  
  window.client = client;
  client.getDomain('localhost',function(err2, domain){
    if(err2) return console.log(err2);
    window.domain = domain;
    domain.getForm('json-form', function(err3, doc){
      if(err3) return console.log(err3);
      var formId = doc.getFormId()||'json-form';
      domain.getForm(formId, function(err4, form){
        if(err4) return console.log(err4);
        window.form = form;
        Loader.load(form.plugin, function(module){
          var JsonForm = module.default;
          JsonForm.create({
            client: client,
            $container:$('body'),
            form: form,
            document: doc
          });
        });
      });
    });
  });
});