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
import Document from './document';

'use strict';

var View = {
  create: function(socket, domainId, viewData) {
    var view = {
      replace: function(viewRaw, callback) {
	    const self = this;
	    socket.emit('replaceView', domainId, this.id, viewRaw, function(err, viewData) {
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
	    socket.emit('patchView', domainId, this.id, patch, function(err, viewData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, viewData);
	      callback(null, true);
	    });
      },
  
      remove: function(callback) {
        socket.emit('removeView', domainId, this.id, function(err, result) {
	      callback(err, result);	  
         });
      },

      getACL: function(callback) {
	    socket.emit('getViewACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },
  
      replaceACL: function(acl, callback) {
	    socket.emit('replaceViewACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
  
      patchACL: function(aclPatch, callback) {
	    socket.emit('patchViewACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeViewPermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },
  
      findDocuments: function(query, callback) {
        const viewId = this.id;
	    socket.emit('findViewDocuments', domainId, viewId, query, function(err, docsData) {
          if(err) return callback(err);

          var documents = _.map(docsData.hits.hits, function(docData){
      	    return Document.create(socket, domainId, viewId, docData._source);
          });

	      callback(null, {total:docsData.hits.total, documents: documents});
	    });
      },

      refresh: function(callback) {
        socket.emit('refreshView', domainId, this.id, function(err, result) {
	      callback(err, result);
	    });
      }  	
    };

    _.merge(view, viewData);

    return view;
  }
};

export {View as default};