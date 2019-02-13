/*
 * User.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */

const _ = require('lodash');

'use strict';

var User = {
  create: function(client, userData) {
    var proto = {
      getClient: function(){
      	return client;
      },
          	
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
	    client.emit('replaceUser', this.id, userRaw, function(err, userData) {
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
	    client.emit('patchUser', this.id, patch, function(err, userData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, userData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    client.emit('removeUser', this.id, function(err, result) {
	      callback(err, result);	  
	    });
      },
  
      resetPassword: function(newPassword, callback) {
	    client.emit('resetPassword', this.id, newPassword, function(err, result) {
	      callback(err, result);
	    });
      },
  
      getACL: function(callback) {
	    client.emit('getUserACL', this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    client.emit('replaceUserACL', this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
	    client.emit('patchUserACL', this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    client.emit('removeUserPermissionSubject', this.id, acl, function(err, result) {
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

module.exports = User;