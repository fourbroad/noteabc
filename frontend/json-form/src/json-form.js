import validate from "validate.js";
import jsonPatch from "fast-json-patch";
import uuidv4 from 'uuid/v4';
import JSONEditor from 'jsoneditor/dist/jsoneditor';

import '@notesabc/select'

import './json-form.scss';
import jsonFormHtml from './json-form.html';

$.widget("nm.jsonform", {
  options:{
    constraints:{}
  },

  _create: function() {
    var o = this.options, self = this;

    this._addClass('nm-jsonform', 'container-fluid');
    this.element.html(jsonFormHtml);

    this.$jsonFormContent = $('.json-form-content', this.element),
    this.$jsonFormHeader = $('.json-form-header', this.element),
    this.$jsonFormTitle = $('h4', this.$jsonFormHeader),
    this.$modified = $('.modified', this.$jsonFormHeader),
    this.$dropdownToggle = $('.dropdown-toggle', this.$jsonFormHeader),
    this.$saveBtn =$('.save.btn', this.$jsonFormHeader),
    this.$itemSaveAs = $('.dropdown-item.save-as', this.$jsonFormHeader),
    this.$itemDiscard = $('.dropdown-item.discard', this.$jsonFormHeader),
    this.$saveAsModel = $('#save-as', this.$jsonFormHeader),
    this.$titleInput = $('input[name="title"]', this.$saveAsModel),
    this.$form = $('form.save-as', this.$saveAsModel),
    this.$domain = $('div.domain', this.$saveAsModel),
    this.$collection = $('div.collection', this.$saveAsModel),
    this.$id = $('input[name="id"]', this.$saveAsModel),
    this.$title = $('input[name="title"]', this.$saveAsModel),
    this.$submitBtn = $('.btn.submit', this.$saveAsModel),
    this.$toolbox = $('.json-form-toolbox', this.$jsonForm),

    this.newDocument = _.cloneDeep(o.document);

    this.$jsonFormTitle.html(this.newDocument.title||this.newDocument.id);
    this.jsonEditor = new JSONEditor(this.$jsonFormContent.get(0), {
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
        self.newDocument = self.jsonEditor.get();
        self._refreshHeader();
      },
      onError: function (err) { console.log(err.toString());},
      onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    }, this.newDocument);

    this._refreshHeader();

    this.$saveAsModel.on('show.bs.modal', function () {
      if(!self.$domain.data("nm-select")){
        self.$domain.select({
          title: 'domain',
          mode: 'single',
          menuItems: function(filter, callback){
            o.client.findDomains({}, function(err, domains){
              if(err) return console.log(err);
              var items = _.map(domains.domains, function(domain){
                return {label:domain['title']||domain['id'], value:domain['id']};
              });
              callback(items);
            });
          },
          onValueChanged: function(){
            self.collectionSelect.reset();
          }
        });
      }
      
      if(!self.$collection.data('nm-select')){
        self.$collection.select({
          title: 'collection',
          mode: 'single',
          menuItems: function(filter, callback){
            var selectedDomains = self.$domain.select('option', 'selectedItems');
            if(selectedDomains[0]){
              o.client.getDomain(selectedDomains[0].value, function(err, domain){
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
      }

      self.$id.val(uuidv4());
    });

    this.$saveAsModel.on('shown.bs.modal', function () {
      self.$titleInput.val('');
      self.$titleInput.trigger('focus')
    });

    this._on(this.$saveBtn, {click: this.save});
    this._on(this.$itemSaveAs, {
      click: function(){
        this.$saveAsModel.modal('toggle');
      }
    });
    this._on(this.$itemDiscard, {click: this.onDiscard});
    this._on(this.$submitBtn, {click: this._onSubmit});
    this._on(this.$form, {submit: this._onSubmit});
  },

  _refreshHeader: function(){
    this.$jsonFormTitle.html(this.newDocument.title||this.newDocument.id);      
    if(this._isDirty()){
      this.$saveBtn.html("Save");
      this.$saveBtn.removeAttr('data-toggle');
      this.$modified.show();
      this.$dropdownToggle.show();
    }else{
      this.$saveBtn.html("Save as ...");
      this.$saveBtn.attr({'data-toggle':'modal'});
      this.$modified.hide();
      this.$dropdownToggle.hide();
    }
  },

  _isDirty: function(){
    var o = this.options;
    return jsonPatch.compare(o.document, this.newDocument).length > 0;
  },

  save: function(){
    var o = this.options, self = this;
    if(this._isDirty()){
      o.document.patch(jsonPatch.compare(o.document, this.newDocument), function(err, result){
        if(err) return console.log(err);
        o.document = _.cloneDeep(self.newDocument);
        self._refreshHeader();
      });
    }
  },

  saveAs: function(){
    var o = this.options, self = this, errors = validate(this.$form, o.constraints);
    if (errors) {
      console.log(errors);
    } else {
      var values = validate.collectFormValues(this.$form, {trim: true}), 
          docInfo = _.cloneDeep(this.newDocument),
          domainId = this.$domain.select('option','selectedItems')[0].value, 
          collectionId = this.$collection.select('option','selectedItems')[0].value;
      o.client.getDomain(domainId, function(err1, domain){
        domain.getCollection(collectionId, function(err2, collection){
          delete docInfo.id;
          docInfo.title = values.title;
          collection.createDocument(values.id, docInfo, function(err3, doc){
            if(err3) return console.log(err3);
            self.$saveAsModel.modal('toggle');
            o.document = doc;
            self.newDocument = _.cloneDeep(o.document);
            self.jsonEditor.set(self.newDocument);
            self._refreshHeader();
          });
        });
      });
    }
  },

  onDiscard: function(){
    var o = this.options;
    this.newDocument = _.cloneDeep(o.document);
    jsonEditor.set(this.newDocument);
        
    this._refreshHeader();
  },

  _onSubmit: function(evt){
    evt.preventDefault();
    evt.stopPropagation();

    this.saveAs();
  },

  _destroy: function(){
    this.element.empty();    
  }
});