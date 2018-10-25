import './index.scss';
import 'bootstrap';
import loader from 'loader';

$('body').css({
  position: 'absolute',
  height: '100%',
  width: '100%',
  margin: 0
});

loader.load("http://localhost:8088/@notesabc/json-form/json-form.bundle.js", "@notesabc/json-form", function(module){
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