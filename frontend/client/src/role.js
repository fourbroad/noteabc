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

var Role = {
  create: function(client, domainId, roleData) {
    var proto = {
      getClient: function(){
      	return client;
      },
          	
      getDomainId: function(){
      	return domainId;
      },

      getCollectionId: function(){
      	return ".roles";
      },

      saveAs: function(id, title, callback){
      	var newRole =  _.cloneDeep(this);
      	newRole.title = title;
      	delete newRole.id;
	    client.emit('createRole', domainId, id, newRole, function(err, roleData){
	      callback(err, err ? null : Role.create(client, domainId, roleData));	  
	    });
      },

      replace: function(roleRaw, callback) {
	    const self = this;
	    client.emit('replaceRole', domainId, this.id, roleRaw, function(err, roleData) {
	      if(err) return callback(err);

	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, roleData);
	      callback(null, true);
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this;
	    client.emit('patchRole', domainId, this.id, patch, function(err, roleData) {
	      if(err) return callback(err);
				  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, roleData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    client.emit('removeRole', domainId, this.id, function(err, result) {
	      callback(err, result);
	    });
      },
  
      getACL: function(callback) {
	    client.emit('getRoleACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    client.emit('replaceRoleACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
	    client.emit('patchRoleACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    client.emit('removeRolePermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }
      
    };

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), roleData);
  }
};

module.exports = Role;