/*
 * form.js
 */

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */

const _ = require('lodash');

'use strict';

var Form = {
  create: function(client, domainId, formData) {
    var proto = {
      getClient: function() {
        return client;
      },

      getDomainId: function() {
        return domainId;
      },

      getCollectionId: function() {
        return ".forms";
      },

      saveAs: function() {
        var id, title, newForm = _.cloneDeep(this);

        if (arguments.length == 1 && typeof arguments[0] == 'function') {
          id = uuidv4();
          title = newForm.title;
          callback = arguments[0];
        } else if (arguments.length == 2 && typeof arguments[1] == 'function') {
          id = arguments[0];
          title = newForm.title;
          callback = arguments[1];
        } else if (arguments.length == 3 && typeof arguments[2] == 'function') {
          id = arguments[0];
          title = arguments[1];
          callback = arguments[2];
        } else {
          throw new Error('Number or type of Arguments is not correct!');
        }

        newForm.title = title;
        delete newForm.id;
        client.emit('createForm', domainId, id, newForm, function(err, formData) {
          callback(err, err ? null : Form.create(client, domainId, formData));
        });
      },

      replace: function(formRaw, callback) {
        const self = this;
        client.emit('replaceForm', domainId, this.id, formRaw, function(err, formData) {
          if (err)
            return callback(err);

          for (var key in self) {
            if (self.hasOwnProperty(key) && !_.isFunction(self[key]))
              try {
                delete self[key];
              } catch (e) {}
          }

          _.merge(self, formData);
          callback(null, true);
        });
      },

      patch: function(patch, callback) {
        const self = this;
        client.emit('patchForm', domainId, this.id, patch, function(err, formData) {
          if (err)
            return callback(err);

          for (var key in self) {
            if (self.hasOwnProperty(key) && !_.isFunction(self[key]))
              try {
                delete self[key];
              } catch (e) {}
          }

          _.merge(self, formData);
          callback(null, true);
        });
      },

      remove: function(callback) {
        client.emit('removeForm', domainId, this.id, function(err, result) {
          callback(err, result);
        });
      },

      getACL: function(callback) {
        client.emit('getFormACL', domainId, this.id, function(err, acl) {
          callback(err, acl);
        });
      },

      replaceACL: function(acl, callback) {
        client.emit('replaceFormACL', domainId, this.id, acl, function(err, result) {
          callback(err, result);
        });
      },

      patchACL: function(aclPatch, callback) {
        client.emit('patchFormACL', domainId, this.id, aclPatch, function(err, result) {
          callback(err, result);
        });
      },

      removePermissionSubject: function(acl, callback) {
        client.emit('removeFormPermissionSubject', domainId, this.id, acl, function(err, result) {
          callback(err, result);
        });
      },

      getFormId: function() {
        return this._metadata.formId;
      }

    };

    function constructor() {}
    ;_.merge(constructor.prototype, proto);
    return _.merge(new constructor(), formData);
  }
};

module.exports = Form;
