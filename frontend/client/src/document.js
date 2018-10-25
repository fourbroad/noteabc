/*
 * notes.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

import _ from 'lodash';

'use strict';

var Document = {
  create: function(socket, domainId, collectionId, docData) {
    var document = {
      replace: function(docRaw, callback) {
	    const self = this;
	    socket.emit('replaceDocument', domainId, collectionId, this.id, docRaw, function(err, docData) {
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
	    socket.emit('patchDocument', domainId, collectionId, this.id, patch, function(err, docData) {
	      if(err) return callback(err);

	      for(var key in self) {
  		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, docData);
	      callback(null, true);
	    });
      },
  
      remove: function(callback) {
	    socket.emit('removeDocument', domainId, collectionId, this.id, function(err, result) {
	      callback(err, result);	  
	    });
      },

      getACL: function(callback) {
   	    socket.emit('getDocumentACL', domainId, collectionId, this.id, function(err, acl) {
 	      callback(err, acl);
	    });
      },
  
      replaceACL: function(acl, callback) {
	    socket.emit('replaceDocumentACL', domainId, collectionId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
  
      patchACL: function(aclPatch, callback) {
	    socket.emit('patchDocumentACL', domainId, collectionId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeDocumentPermissionSubject', domainId, collectionId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      }
    };

    _.merge(document, docData);

    return document;
  }	
};

export { Document as default};