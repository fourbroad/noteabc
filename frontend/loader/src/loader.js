
var  
  identity, load;

identity = function(name) {
  return '_' + name.replace(/[\.,@,/,-]/g,'_');
};

load = function(uri, name, callback){
  const _identity = identity(name);
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = uri;
  script.onload = function () {
    document.head.removeChild(script);
    callback && callback(window[_identity]);
    delete window[_identity];
  }
  document.head.appendChild(script);
};

export default {
  load: load
}