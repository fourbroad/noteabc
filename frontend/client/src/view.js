/*
 * notes.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */

const _ = require('lodash'), Document = require('./document');

'use strict';

var View = {
  create: function(client, domainId, viewData) {
    var proto = {
      getClient: function(){
      	return client;
      },
          	
      getDomainId: function(){
      	return domainId;
      },

      getCollectionId: function(){
      	return ".views";
      },

      saveAs: function(){
      	var id, title, newView =  _.cloneDeep(this);

	    if(arguments.length == 1 && typeof arguments[0] == 'function'){
	      id = uuidv4();
	      title = newView.title;
	      callback = arguments[0];
	    } else if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      id = arguments[0];
	      title = newView.title;
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      id = arguments[0];
	      title = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }

      	newView.title = title;
      	delete newView.id;
    	client.emit('createView', domainId, id, newView, function(err, viewData){
    	  callback(err, err ? null : View.create(client, domainId, viewData));
    	});
      },

      replace: function(viewRaw, callback) {
	    const self = this;
	    client.emit('replaceView', domainId, this.id, viewRaw, function(err, viewData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, viewData);
	      callback(null, true);	  
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this;
	    client.emit('patchView', domainId, this.id, patch, function(err, viewData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, viewData);
	      callback(null, true);
	    });
      },
  
      remove: function(callback) {
        client.emit('removeView', domainId, this.id, function(err, result) {
	      callback(err, result);	  
         });
      },

      getACL: function(callback) {
	    client.emit('getViewACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },
  
      replaceACL: function(acl, callback) {
	    client.emit('replaceViewACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
  
      patchACL: function(aclPatch, callback) {
	    client.emit('patchViewACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    client.emit('removeViewPermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      findDocuments: function(query, callback) {
        const viewId = this.id;
	    client.emit('findViewDocuments', domainId, viewId, query, function(err, docsData) {
          if(err) return callback(err);

          var documents = _.map(docsData.hits.hits, function(docData){
      	    return Document.create(client, domainId, docData._index.split('~')[1], docData._source);
          });

	      callback(null, {total:docsData.hits.total, documents: documents});
	    });
      },

      distinctQuery: function(field, wildcard, callback){
      	var query = {
      	  collapse:{field: field + '.keyword'},
      	  aggs:{itemCount:{cardinality:{field: field+'.keyword'}}},
      	  _source:[field]
      	};

        if(wildcard){
       	  query.query = {wildcard:{}};
       	  query.query.wildcard[field+".keyword"] = wildcard;
        }

        this.findDocuments(query, callback);
      },

      refresh: function(callback) {
        client.emit('refreshView', domainId, this.id, function(err, result) {
	      callback(err, result);
	    });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }
      
    };

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), viewData);
  }
};

module.exports = View;