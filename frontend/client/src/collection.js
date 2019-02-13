/*
 * collection.js - module to provide document collection capabilities
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

const
  Document = require('./document'),
  Form = require('./form'),
  uuidv4 = require('uuid/v4'),
  _ = require('lodash');

'use strict';

var Collection = {
  create : function(client, domainId, collectionData) {
    var proto = {
      getClient: function(){
      	return client;
      },

      getDomainId: function(){
      	return domainId;
      },

      getCollectionId: function(){
      	return ".collections";
      },

      saveAs: function(){
      	var id, title, newCollection = _.cloneDeep(this);

	    if(arguments.length == 1 && typeof arguments[0] == 'function'){
	      id = uuidv4();
	      title = newCollection.title;
	      callback = arguments[0];
	    } else if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      id = arguments[0];
	      title = newCollection.title;
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      id = arguments[0];
	      title = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }

      	newCollection.title = title;
      	delete newCollection.id;
	   	
	    client.emit('createCollection', domainId, id, newCollection, function(err, collectionData){
	      callback(err, err ? null : Collection.create(client, domainId, collectionData));
	    });
      },

      createDocument: function() {
	    const collectionId = this.id;
	    var docId, docRaw, callback;

	    if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      docId = uuidv4();
	      docRaw = arguments[0];
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      docId = arguments[0];
	      docRaw = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }

	    client.emit('createDocument', domainId, collectionId, docId, docRaw, function(err, docData) {
	      callback(err, err ? null : Document.create(client, domainId, collectionId, docData));
	    });
      },
  
      getDocument: function(docId, callback) {
	    const collectionId = this.id;
	    client.emit('getDocument', domainId, collectionId, docId, function(err, docData) {
	      callback(err, err ? null : Document.create(client, domainId, collectionId, docData));
	    });
      },

      replace: function(collectionRaw, callback) {
	    const self = this, collectionId = this.id;
	    client.emit('replaceCollection', domainId, collectionId, collectionRaw, function(err, cd) {
	      if(err) return callback(err);
		  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, cd);
	      callback(null, true);	  
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this, collectionId = this.id;
	    client.emit('patchCollection', domainId, collectionId, patch, function(err, cd) {
	      if(err) return callback(err);
			  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

  	      _.merge(self, cd);
	    
	      callback(null, true);
        });
      },

      remove: function(callback) {
	    client.emit('removeCollection', domainId, this.id, function(err, result){
	      callback(err, result);
	    });
      },

      getACL: function(callback) {
	    client.emit('getCollectionACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },
  
      replaceACL: function(acl, callback) {
	    client.emit('replaceCollectionACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
	  
      patchACL: function(aclPatch, callback) {
	    client.emit('patchCollectionACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    client.emit('removeCollectionPermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      findDocuments: function(query, callback) {
        const collectionId = this.id;
	    client.emit('findCollectionDocuments', domainId, collectionId, query, function(err, docsData) {
          if(err) return callback(err);

          var documents = _.map(docsData.hits.hits, function(docData){
      	    return Document.create(client, domainId, collectionId, docData._source);
          });

	      callback(null, {total:docsData.hits.total, documents: documents});
	    });
      },

      findForms: function(query, callback){
        const collectionId = this.id;
        client.emit('findCollectionFoms', domainId, collectionId, query, function(err, formInfos){
          if(err) return callback(err);
          var forms = _.map(formInfos.hits.hits, function(formInfo){
      	    return Form.create(client, domainId, formInfo._source);
          });
	      callback(null, {total:formInfos.hits.total, forms: forms});
	    });
      },

      refresh: function(callback) {
	    client.emit('refreshCollection', domainId, this.id, function(err, result){
	      callback(err, result);	  
	    });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }
    };

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), collectionData);
  }
};

module.exports = Collection;