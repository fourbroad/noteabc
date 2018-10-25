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

var Role = {
  create: function(socket, domainId, roleData) {
    var role = {
      replace: function(roleRaw, callback) {
	    const self = this;
	    socket.emit('replaceRole', domainId, this.id, roleRaw, function(err, roleData) {
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
	    socket.emit('patchRole', domainId, this.id, patch, function(err, roleData) {
	      if(err) return callback(err);
				  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, roleData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    socket.emit('removeRole', domainId, this.id, function(err, result) {
	      callback(err, result);
	    });
      },
  
      getACL: function(callback) {
	    socket.emit('getRoleACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    socket.emit('replaceRoleACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
	    socket.emit('patchRoleACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeRolePermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      }
    };

    _.merge(role, roleData);

    return role;
  }
};

export {Role as default};