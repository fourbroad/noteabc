/*
 * collection.js - module to provide document collection capabilities
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

import Document from './document';
import Form from './form';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';

'use strict';

var Collection = {
  create : function(socket, domainId, collectionData) {
    var collection = {
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
	  	
	    socket.emit('createDocument', domainId, collectionId, docId, docRaw, function(err, docData) {
	      callback(err, err ? null : Document.create(socket, domainId, collectionId, docData));
	    });
      },
  
      getDocument: function(docId, callback) {
	    const collectionId = this.id;
	    socket.emit('getDocument', domainId, collectionId, docId, function(err, docData) {
	      callback(err, err ? null : Document.create(socket, domainId, collectionId, docData));
	    });
      },

      replace: function(collectionRaw, callback) {
	    const self = this, collectionId = this.id;
	    socket.emit('replaceCollection', domainId, collectionId, collectionRaw, function(err, cd) {
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
	    socket.emit('patchCollection', domainId, collectionId, patch, function(err, cd) {
	      if(err) return callback(err);
			  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

  	      _.merge(self, cd);
	    
	      callback(null, true);
        });
      },

      remove: function(callback) {
	    socket.emit('removeCollection', domainId, this.id, function(err, result){
	      callback(err, result);
	    });
      },

      getACL: function(callback) {
	    socket.emit('getCollectionACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },
  
      replaceACL: function(acl, callback) {
	    socket.emit('replaceCollectionACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
	  
      patchACL: function(aclPatch, callback) {
	    socket.emit('patchCollectionACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeCollectionPermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      findDocuments: function(query, callback) {
        const collectionId = this.id;
	    socket.emit('findCollectionDocuments', domainId, collectionId, query, function(err, docsData) {
          if(err) return callback(err);

          var documents = _.map(docsData.hits.hits, function(docData){
      	    return Document.create(socket, domainId, collectionId, docData._source);
          });

	      callback(null, {total:docsData.hits.total, documents: documents});
	    });
      },

      findForms: function(query, callback){
        const collectionId = this.id;
        socket.emit('findCollectionFoms', domainId, collectionId, query, function(err, formInfos){
          if(err) return callback(err);
          var forms = _.map(formInfos.hits.hits, function(formInfo){
      	    return Form.create(socket, domainId, formInfo._source);
          });
	      callback(null, {total:formInfos.hits.total, forms: forms});
	    });
      },

      refresh: function(callback) {
	    socket.emit('refreshCollection', domainId, this.id, function(err, result){
	      callback(err, result);	  
	    });
      }
    };

    _.merge(collection, collectionData);

    return collection;
  }
};

export { Collection as default};