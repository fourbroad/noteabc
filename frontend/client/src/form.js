/*
 * form.js
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */


import _ from 'lodash';

'use strict';

var Form = {
  create: function(socket, domainId, formData) {
    var form = {
      replace: function(formRaw, callback) {
	    const self = this;
	    socket.emit('replaceForm', domainId, this.id, formRaw, function(err, formData) {
	      if(err) return callback(err);
			  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, formData);
	      callback(null, true);	  
	    });
      },
  
      patch: function(patch, callback) {
	    const self = this;
	    socket.emit('patchForm', domainId, this.id, patch, function(err, formData) {
	      if(err) return callback(err);
				  
	      for(var key in self) {
		    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
	      }

	      _.merge(self, formData);
	      callback(null, true);	  
	    });
      },
  
      remove: function(callback) {
	    socket.emit('removeForm', domainId, this.id, function(err, result) {
	      callback(err, result);
	    });
      },
  
      getACL: function(callback) {
	    socket.emit('getFormACL', domainId, this.id, function(err, acl) {
	      callback(err, acl);
	    });
      },

      replaceACL: function(acl, callback) {
	    socket.emit('replaceFormACL', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      },

      patchACL: function(aclPatch, callback) {
  	    socket.emit('patchFormACL', domainId, this.id, aclPatch, function(err, result) {
	      callback(err, result);
	    });
      },
  
      removePermissionSubject: function(acl, callback) {
	    socket.emit('removeFormPermissionSubject', domainId, this.id, acl, function(err, result) {
	      callback(err, result);
	    });
      }
    };

    _.merge(form, formData);

    return form;
  }
};

export { Form as default};