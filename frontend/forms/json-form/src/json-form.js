import * as $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';

import validate from "validate.js";
import jsonPatch from "fast-json-patch";
import uuidv4 from 'uuid/v4';
import JSONEditor from 'jsoneditor/dist/jsoneditor';

import Select from '@notesabc/select'

import './json-form.scss';
import jsonFormHtml from './json-form.html';

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
    $saveAsModel = $('#save-as', $jsonFormHeader),
    $titleInput = $('input[name="title"]', $saveAsModel),
    $form = $('form.save-as', $saveAsModel),
    $domain = $('div.domain', $saveAsModel),
    $collection = $('div.collection', $saveAsModel),
    $id = $('input[name="id"]', $saveAsModel),
    $title = $('input[name="title"]', $saveAsModel),
    $submitBtn = $('.btn.submit', $saveAsModel),
    $toolbox = $('.json-form-toolbox', $jsonForm),
    constraints = {};

  var
    client = opts.client, document = opts.document, newDocument = _.cloneDeep(document), jsonEditor, observer,
    domainSelect, collectionSelect,
    _init, _initToolbox, _onChange, _isDirty, _refreshHeader, _onSubmit, save, saveAs, onDiscard;

  _refreshHeader = function(){
    $jsonFormTitle.html(newDocument.title||newDocument.id);      
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
    return jsonPatch.compare(document, newDocument).length > 0;
  };

  save = function(){
    if(_isDirty()){
      document.patch(jsonPatch.compare(document, newDocument), function(err, result){
        if(err) return console.log(err);
        newDocument = _.cloneDeep(document)        
        _refreshHeader();
      });
    }
  };

  saveAs = function(){
    var errors = validate($form, constraints);
    if (errors) {
      console.log(errors);
    } else {
      var values = validate.collectFormValues($form, {trim: true}), 
          docInfo = _.cloneDeep(newDocument),
          domainId = domainSelect.getSelectedItems()[0].value, 
          collectionId = collectionSelect.getSelectedItems()[0].value;
      client.getDomain(domainId, function(err1, domain){
        domain.getCollection(collectionId, function(err2, collection){
          delete docInfo.id;
          docInfo.title = values.title;
          collection.createDocument(values.id, docInfo, function(err3, doc){
            if(err3) return console.log(err3);
            $saveAsModel.modal('toggle');
            document = doc;
            newDocument = _.cloneDeep(document);
            jsonEditor.set(newDocument);
            _refreshHeader();
          });
        });
      });
    }
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

    saveAs();
  };

  _initToolbox = function(){

  };

  _init = function(doc){
    $jsonForm.appendTo($container.empty());
    $jsonFormTitle.html(newDocument.title||newDocument.id);
    jsonEditor = new JSONEditor($jsonFormContent.get(0), {
      mode: 'tree',
      modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
      onEditable: function (node) {
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

    $saveAsModel.on('show.bs.modal', function () {
      domainSelect = Select.create({
        $container: $domain,
        title: 'domain',
        mode: 'single',
        menuItems: function(filter, callback){
          client.findDomains({}, function(err, domains){
            if(err) return console.log(err);
            var items = _.map(domains.domains, function(domain){
              return {label:domain['title']||domain['id'], value:domain['id']};
            });
            callback(items);
          });
        },
        onValueChanged: function(){
          collectionSelect.reset();
        }
      });
      
      collectionSelect = Select.create({
        $container: $collection,
        title: 'collection',
        mode: 'single',
        menuItems: function(filter, callback){
          var selectedDomains = domainSelect.getSelectedItems();
          if(selectedDomains[0]){
            client.getDomain(selectedDomains[0].value, function(err, domain){
              domain.findCollections({}, function(err, collections){
                if(err) return console.log(err);
                var items = _.map(collections.collections, function(collection){
                  return {label:collection['title']||collection['id'], value:collection['id']};
                });
                callback(items);
              });
            });
          }else{
            callback([]);
          }
        }
      });

      $id.val(uuidv4());
    });

    $saveAsModel.on('shown.bs.modal', function () {
      $titleInput.val('');
      $titleInput.trigger('focus')
    });

    $saveBtn.on('click', save);
    $itemSaveAs.on('click', function(){
      $saveAsModel.modal('toggle');
    });
    $itemDiscard.on('click', onDiscard);
    $submitBtn.on('click', _onSubmit);
    $form.bind('submit', _onSubmit);

  };

  _init(newDocument);

}

export default {
  create: create
}