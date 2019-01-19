
import Client from '@notesabc/frontend-client'
import newDialog from 'new-dialog'

import './index.scss';

Client.login("administrator","!QAZ)OKM", function(err1, client){
  if(err1) return console.log(err1);
  window.client = client;
  client.getDomain('localhost',function(err2, domain){
    if(err2) return console.log(err2);
    window.currentDomain = domain;
    
  });
});
