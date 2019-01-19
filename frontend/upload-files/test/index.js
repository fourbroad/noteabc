import * as $ from 'jquery';
import 'jquery-ui/ui/widget';
import 'bootstrap';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';
import 'font-awesome/scss/font-awesome.scss';
import 'jquery.event.gevent';
import 'jquery.event.ue';

import 'upload-files';

import './index.scss';

import Client from '@notesabc/frontend-client';

Client.login("administrator","!QAZ)OKM", function(err, client){
  if(err) return console.log(err);

  Cookies.set('token', client.getToken());
  
  $('body').uploadfiles({
    token: client.getToken(),
    url: "http://localhost:8000/upload-files/"
  });

});