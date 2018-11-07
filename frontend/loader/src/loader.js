
var  
  identity, load;

identity = function(name) {
  return '_' + name.replace(/[\.,@,/,-]/g,'_');
};

load = function(plugin, callback){
  const _identity = identity(plugin.name);

  if(plugin.css){
    $("<link>").attr({type: "text/css",rel: "stylesheet",href: plugin.css}).appendTo("head");
  }

  $.getScript(plugin.js).done(function(){
    callback && callback(window[_identity]);
    delete window[_identity];
  });

};

export default {
  load: load
}