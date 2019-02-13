import Cookies from 'js-cookie';
import Client from '@notesabc/frontend-client'
import loader from '@notesabc/loader'

import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/data';
import 'jquery.urianchor';


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


$.widget('nm.runtime',{
  options:{
    uriAnchor: {}
  },

  _create: function(){
    var o = this.options, self = this;

    

    this._on(window, {hashchange: this._onHashchange});
  },

  _setAchor: function(anchor){
    var o = this.options;
    o.uriAnchor = anchor;
    $.uriAnchor.setAnchor(anchor, null, true);
  },

  _changeAnchorPart: function(argMap){
    var o = this.options, anchorRevised = $.extend( true, {}, o.uriAnchor), result = true, keyName, keyNameDep;
    for(keyName in argMap){
      if(argMap.hasOwnProperty(keyName) && keyName.indexOf('_') !== 0){
        // update independent key value
        anchorRevised[keyName] = argMap[keyName];

        // update matching dependent key
        keyNameDep = '_' + keyName;
        if(argMap[keyNameDep]){
          anchorRevised[keyNameDep] = argMap[keyNameDep];
        } else {
          delete anchorRevised[keyNameDep];
          delete anchorRevised['_s' + keyNameDep];
        }
      }
    }

    // Attempt to update URI; revert if not successful
    try {
      $.uriAnchor.setAnchor(anchorRevised);
    } catch(error) {
      // replace URI with existing state
      $.uriAnchor.setAnchor(o.uriAnchor, null, true);
      result = false;
    }

    return result;
  },

  _onHashchange: function(event){
    var o = this.options, self = this, anchorProposed, anchorPrevious = $.extend(true, {}, o.uriAnchor), 
        domProposed, colProposed, docProposed, actProposed, isOk = true, errorCallback;

    errorCallback = function(){
      self._setAchor(anchorPrevious)
    };
  
    try {
      anchorProposed = $.uriAnchor.makeAnchorMap(); 
    } catch(error) {
      $.uriAnchor.setAnchor(anchorPrevious, null, true);
      return false;
    }
    o.uriAnchor = anchorProposed;

    domProposed = anchorProposed.dom;
    colProposed = anchorProposed.col;
    docProposed = anchorProposed.doc;
    actProposed = anchorProposed.act;
    if(anchorPrevious !== anchorProposed){
      var opts = {error: errorCallback};
      if(".views" === colProposed){
        switch(docProposed){
          case 'signup':
            this._loadSignUp(opts);
            break;
          case 'dashboard':
            this._loadDashboard(opts);
            break;
          case 'email':
            this._loadEmail(opts);
            break;
          case 'calendar':
            this._loadCalendar(opts);
            break;
          case 'chat':
            this._loadChat(opts);
            break;
          default:            
            opts.domain = o.domain;
            this._loadView(o.domain, docProposed, actProposed, opts);
            break;
        }
      } else {
          opts.domain = o.domain;
          opts.domainId = domProposed;
          opts.collectionId = colProposed;
          opts.documentId = docProposed;
          this._loadDocument(opts);
        }
    }

    return false;
  }



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