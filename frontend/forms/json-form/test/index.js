import './index.scss';
import 'bootstrap';

var pluginIdent, pluginChunk, loadPlugin;

pluginIdent = function(pluginUri) {
  return '_' + pluginUri.replace(/[\.,-]/g,'_');
};

pluginChunk = function(pluginUri, name) {
  return '/' + name + '.bundle.js'
};

loadPlugin = function(pluginUri, name, callback) {
  var script = document.createElement('script');
  var _pluginIdent = pluginIdent(pluginUri);
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = pluginChunk(pluginUri, name);
  script.onload = function () {
    document.head.removeChild(script);
    callback && callback(window[_pluginIdent]);
    delete window[_pluginIdent];
  }
  document.head.appendChild(script);
};

$('body').css({
  position: 'absolute',
  height: '100%',
  width: '100%',
  margin: 0
});

loadPlugin("notesabc-forms-json-form", "json-form", function(module){
  var Json = module.default;
  Json.create({
    $container:$('body'),
    form: null,
    document: {
      title: 'Hello world!',
      'array': [1, 2, 3],
      'boolean': true,
      'color': '#82b92c',
      'null': null,
      'number': 123,
      'object': {'a': 'b', 'c': 'd'},
      'string': 'Hello World'
    }
  });
});