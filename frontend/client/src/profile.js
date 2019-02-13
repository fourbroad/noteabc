/*
 * notes.js - module to provide CRUD db capabilities
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */


const _ = require('lodash');

'use strict';

var Profile = {
  create: function(client, domainId, profileData) {
    var proto = {
      getClient: function(){
      	return client;
      },
          	
      getDomainId: function(){
      	return domainId;
      },

      getCollectionId: function(){
      	return ".profiles";
      },

      replace: function(profileRaw, callback) {
	    const self = this;
	    client.emit('replaceProfile', domainId, this.id, profileRaw, function(err, profileData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, profileData);
	      callback(null, true);	  
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this;
	    client.emit('patchProfile', domainId, this.id, patch, function(err, profileData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, profileData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    client.emit('removeProfile', domainId, this.id, function(err, result) {
	      callback(err, result);	  
	    });
      },
  
      getACL: function(callback) {
	    client.emit('getProfileACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    client.emit('replaceProfileACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
	    client.emit('patchProfileACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    client.emit('removeProfilePermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }

    };

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), profileData);
  }
};

module.exports = Profile;
