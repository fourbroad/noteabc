
import Client from '@notesabc/frontend-client';
import loader from '@notesabc/loader';

import * as Domain2 from '../src/domain';

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

Client.login('administrator', '!QAZ)OKM', function(err, client){
  if(err) return console.log(err);
  window.client = client;
  client.getDomain(document.domain, function(err, domain) {
    if (err) return console.log(err);
    window.currentDomain = domain;
//     loader.load({
//       name: domain.plugin && domain.plugin.name || "@notesabc/domain", 
//       js: domain.plugin && domain.plugin.js || "@notesabc/domain/domain.bundle.js",
//       css: domain.plugin && domain.plugin.css || '@notesabc/domain/domain.bundle.css'
//     }, function(){
      $('<div/>').appendTo('body').domain({
        domain: domain,
        client: client,
        create: function(){setTimeout(function(){window.dispatchEvent(window.EVENT);},500)}
      });

//     });
  });
});


// $(window).on("hashchange", $.proxy(this._onHashchange, this));
