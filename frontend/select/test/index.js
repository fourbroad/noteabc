import './index.scss';

import * as $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';

import Client from '@notesabc/frontend-client'
import Select from 'select';

Client.login("administrator","!QAZ)OKM", function(err1, client){
  if(err1) return console.log(err1);  
  window.client = client;
  client.getDomain('localhost',function(err2, domain){
    if(err2) return console.log(err2);
    window.currentDomain = domain;
    domain.getView('.views', function(err3, view){
      if(err3) return console.log(err3);
      Select.create({
        $container: $('#container'),
        title: 'domain',
        mode: 'multi',
        menuItems: function(filter, callback){
          view.distinctQuery('id', filter, function(err4, docs){
            if(err4) return console.log(err4);
            var items = _.map(docs.documents, function(doc){
              return {label:doc['title']||doc['id'], value:doc['id']};
            });
            callback(items);
          });
        }
      });
    });
  });
});