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

var Profile = {
  create: function(socket, domainId, profileData) {
    var profile = {
      replace: function(profileRaw, callback) {
	    const self = this;
	    socket.emit('replaceProfile', domainId, this.id, profileRaw, function(err, profileData) {
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
	    socket.emit('patchProfile', domainId, this.id, patch, function(err, profileData) {
	      if(err) return callback(err);
				  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, profileData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    socket.emit('removeProfile', domainId, this.id, function(err, result) {
	      callback(err, result);	  
	    });
      },
  
      getACL: function(callback) {
	    socket.emit('getProfileACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    socket.emit('replaceProfileACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
	    socket.emit('patchProfileACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeProfilePermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      }
    };

    _.merge(profile, profileData);

    return profile;
  }
};

export {Profile as default};
