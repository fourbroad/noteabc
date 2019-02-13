import './index.scss';

import Loader from '@notesabc/loader';
import Client from '@notesabc/frontend-client'

// import 'form';

$('body').css({
  position: 'absolute',
  height: '100%',
  width: '100%',
  margin: 0
});

Client.login("administrator","!QAZ)OKM", function(err1, client){
  if(err1) return console.log(err1);  
  window.client = client;
  client.getDomain('localhost',function(err2, domain){
    if(err2) return console.log(err2);
    window.currentDomain = domain;
    domain.getForm('form', function(err3, doc){
      if(err3) return console.log(err3);
      var formId = doc.getFormId()||'form';
      domain.getForm(formId, function(err4, form){
        if(err4) return console.log(err4);
        Loader.load(form.plugin, function(module){
//           var JsonForm = module.default;
          $('<div/>').appendTo('body').form({
            client: client,
            form: form,
            document: doc
          }).on('remove', function(){
            console.log(arguments);
          });
//           $('body').empty();
        });
      });
    });
  });
});

