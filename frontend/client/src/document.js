/*
 * notes.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

const 
  _ = require('lodash');

'use strict';

var Document = {
  create: function(client, domainId, collectionId, docData) {
    var proto = {
      getClient: function(){
      	return client;
      },

      getDomainId: function(){
      	return domainId;
      },

      getCollectionId: function(){
      	return collectionId;
      },

      saveAs: function(){
      	var id, title, newDocument = _.cloneDeep(this);

	    if(arguments.length == 1 && typeof arguments[0] == 'function'){
	      id = uuidv4();
	      title = newDocument.title;
	      callback = arguments[0];
	    } else if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      id = arguments[0];
	      title = newDocument.title;
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      id = arguments[0];
	      title = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }

      	newDocument.title = title;
      	delete newDocument.id;
	   	
	    client.emit('createDocument', domainId, collectionId, id, newDocument, function(err, docData) {
	      callback(err, err ? null : Document.create(client, domainId, collectionId, docData));
	    });
	  },

      replace: function(docRaw, callback) {
	    const self = this;
	    client.emit('replaceDocument', domainId, collectionId, this.id, docRaw, function(err, docData) {
	      if(err) return callback(err);
		  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, docData);
	      callback(null, true);	  
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this;
	    client.emit('patchDocument', domainId, collectionId, this.id, patch, function(err, docData) {
	      if(err) return callback(err);

	      for(var key in self) {
  		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, docData);
	      callback(null, true);
	    });
      },
  
      remove: function(callback) {
	    client.emit('removeDocument', domainId, collectionId, this.id, function(err, result) {
	      callback(err, result);	  
	    });
      },

      getACL: function(callback) {
   	    client.emit('getDocumentACL', domainId, collectionId, this.id, function(err, acl) {
 	      callback(err, acl);
	    });
      },
  
      replaceACL: function(acl, callback) {
	    client.emit('replaceDocumentACL', domainId, collectionId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
  
      patchACL: function(aclPatch, callback) {
	    client.emit('patchDocumentACL', domainId, collectionId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    client.emit('removeDocumentPermissionSubject', domainId, collectionId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }
    };

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), docData);
  }	
};

module.exports = Document;