// import 'bootstrap';

import './json-form.scss';
import jsonFormHtml from './json-form.html';

import validate from "validate.js";

import 'jsoneditor/dist/jsoneditor.css';
import JSONEditor from 'jsoneditor/dist/jsoneditor';

function create(opts){
  const
    $container = opts.$container,
    $jsonForm = $(jsonFormHtml),
    $jsonFormContent = $('.json-form-content', $jsonForm),
    $jsonFormHeader = $('.json-form-header', $jsonForm),
    $jsonFormTitle = $('h4', $jsonFormHeader),
    $modified = $('.modified', $jsonFormHeader),
    $dropdownToggle = $('.dropdown-toggle', $jsonFormHeader),
    $saveBtn =$('.save.btn', $jsonFormHeader),
    $itemSaveAs = $('.dropdown-item.save-as', $jsonFormHeader),
    $itemDiscard = $('.dropdown-item.discard', $jsonFormHeader),
    $newDocModel = $('#newDoc', $jsonFormHeader),
    $titleInput = $('input[name="title"]', $newDocModel),
    $form = $('form.new-doc', $newDocModel),
    $submitBtn = $('.btn.submit', $newDocModel),
    $toolbox = $('.json-form-toolbox', $jsonForm),
    constraints = {};

  var
    document = opts.document, newDocument = _.cloneDeep(document), jsonEditor,
    _init, _initToolbox, _isDirty, _refreshHeader, _onSubmit, save, saveAs, onDiscard;

  _refreshHeader = function(){
    if(_isDirty()){
      $saveBtn.html("Save");
      $saveBtn.removeAttr('data-toggle');
      $modified.show();
      $dropdownToggle.show();
    }else{
      $saveBtn.html("Save as ...");
      $saveBtn.attr({'data-toggle':'modal'});      
      $modified.hide();
      $dropdownToggle.hide();
    }
  };

  _isDirty = function(){
    return jiff.diff(document, newDocument).length > 0;
  };

  save = function(){
    if(_isDirty()){
      document.patch(jiff.diff(document, newDocument), function(err, result){
        if(err) return console.log(err);
        _refreshHeader();
      });
    }
  };

  saveAs = function(){

  };

  onDiscard = function(){
    newDocument = _.cloneDeep(document);
    jsonEditor.set(newDocument);
        
    _refreshHeader();
    _initToolbox();
  };

  _onSubmit = function(evt){
    evt.preventDefault();
    evt.stopPropagation();

    var errors = validate($form, constraints);
    if (errors) {
//       utils.showErrors($form, errors);
      console.log(errors);
    } else {
      var values = validate.collectFormValues($form, {trim: true}), title = values.title, docInfo = _.cloneDeep(document);
      delete docInfo.id;
      delete docInfo.collectionId;
      delete docInfo.domainId;
      docInfo.title = title;
      currentDomain.createDocument(docInfo, function(err, document){
          $newDocModel.modal('toggle')
      });
//       utils.clearErrors($form);
    }
  };

  _initToolbox = function(){

  };

  _init = function(doc){
    $jsonForm.appendTo($container.empty());

    $jsonFormTitle.html(document.title||document.id);
    jsonEditor = new JSONEditor($jsonFormContent.get(0), {
      mode: 'tree',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      onEditable: function (node) {
        // node is an object like:
        //   {
        //     field: 'FIELD',
        //     value: 'VALUE',
        //     path: ['PATH', 'TO', 'NODE']
        //   }
        switch (node.field) {
          case 'id':
            return false;
          case 'title':
            return {
              field: false,
              value: true
            };
          default:
            return true;
        }
      },
      onChangeText: function (jsonString) {
        newDocument = jsonEditor.get();
        _refreshHeader();
      },
      onError: function (err) { console.log(err.toString());},
      onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    }, newDocument);

    _refreshHeader();
    _initToolbox();

    $newDocModel.on('shown.bs.modal', function () {
      $titleInput.val('');
      $titleInput.trigger('focus')
    })    

    $saveBtn.on('click', save);
    $itemDiscard.on('click', onDiscard);
    $submitBtn.on('click', _onSubmit);
    $form.bind('submit', _onSubmit);

  };

  _init(newDocument);

}

export default {
  create: create
}