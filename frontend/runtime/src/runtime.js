import Cookies from 'js-cookie';
import Client from '@notesabc/frontend-client'
import loader from '@notesabc/loader'

/**
 * NOTE: Register resize event for Masonry layout
 */
const EVENT = document.createEvent('UIEvents');
window.EVENT = EVENT;
EVENT.initUIEvent('resize', true, false, window, 0);

// Trigger window resize event after page load for recalculation of masonry layout.
window.addEventListener('load', ()=>{
  window.dispatchEvent(EVENT);
});

// Trigger resize on any element click
document.addEventListener('click', ()=>{
  window.dispatchEvent(window.EVENT);
});

function createDomain(client, $container){
  client.getDomain(document.domain, function(err, domain) {
    if (err) return console.log(err);
    window.currentDomain = domain;
    loader.load({
      name: domain.plugin && domain.plugin.name || "@notesabc/domain", 
      js: domain.plugin && domain.plugin.js || "@notesabc/domain/domain.bundle.js",
      css: domain.plugin && domain.plugin.css || '@notesabc/domain/domain.bundle.css'
    }, function(Domain){
      $container.domain({
        domain: domain,
        client: client
      });      
    });
  });
}

// Cookies.set('userName', 'administrator');
// Cookies.set('password', '!QAZ)OKM');

function init($container){
  var token = Cookies.get('token') || localStorage.token;
  var userName = Cookies.get('userName') || localStorage.userName;
  var password = Cookies.get('password') || localStorage.password;
  var anonymous = Cookies.get('anonymous') || localStorage.anonymous || true;

  if(token){
    Client.connect(token, function(err, client){
      if(err) return console.log(err);
      window.client = client;
      createDomain(client, $container);
    });
  } else if(userName && password) {
    Client.login(userName, password, function(err, client){
      if(err) return console.log(err);
      window.client = client;
      createDomain(client, $container);
    });
  } else if(anonymous){
    Client.login(function(err, client){
      if(err) return console.log(err);
      window.client = client;
      createDomain(client, $container);
    });
  } else {
    console.log("***************************************************************************************************************");
    console.log("* Please setup userName and password using Cookies.set('userName','XXXX') and Cookies.set('password','XXXX'). *");
    console.log("***************************************************************************************************************");
  }
}

export default {
  init: init  
}