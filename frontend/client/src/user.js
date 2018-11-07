/*
 * User.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */

import _ from 'lodash';

'use strict';

var User = {
  create: function(socket, userData) {
    var proto = {
      getDomainId: function(){
      	return "localhost";
      },

      getCollectionId: function(){
      	return ".users";
      },
    	
      isAnonymous: function(){
  	    return this.id === 'anonymous';
      },

      replace: function(userRaw, callback) {
	    const self = this;
	    socket.emit('replaceUser', this.id, userRaw, function(err, userData) {
	      if(err) return callback(err);
			  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, userData);
	      callback(null, true);	  
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this;
	    socket.emit('patchUser', this.id, patch, function(err, userData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, userData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    socket.emit('removeUser', this.id, function(err, result) {
	      callback(err, result);	  
	    });
      },
  
      resetPassword: function(newPassword, callback) {
	    socket.emit('resetPassword', this.id, newPassword, function(err, result) {
	      callback(err, result);
	    });
      },
  
      getACL: function(callback) {
	    socket.emit('getUserACL', this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    socket.emit('replaceUserACL', this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
	    socket.emit('patchUserACL', this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeUserPermissionSubject', this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }
        	
    };

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), userData);
  }
};

export {User as default};