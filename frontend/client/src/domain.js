/*
 * domain.js
 * Domain module
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */

import Document from './document';
import Collection from './collection';
import View from './view';
import Form from './form';
import Profile from './profile';
import Role from './role';
import User from './user';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';

'use strict';

var Domain = {
  create : function(socket, domainData){
  	var proto = {

      getDomainId: function(){
      	return "localhost";
      },

      getCollectionId: function(){
      	return ".domains";
      },

      saveAs: function(){
      	var id, title, newDomain =  _.cloneDeep(this);
        if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      id = arguments[0];
	      title = newDomain.title;
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      id = arguments[0];
	      title = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }

      	newDomain.title = title;
      	delete newDomain.id;
      	socket.emit('createDomain', id, newDomain, function(err, domainData){
      	  callback(err, err ? null : Domain.create(socket, domainData));
      	});      	
      },

      createCollection: function(){
  	    const domainId = this.id;
  	    var collectionId, collectionRaw, callback; 
	   	
	   	if(arguments.length == 2 && typeof arguments[1] == 'function'){
	   	  collectionId = uuidv4();
	   	  collectionRaw = arguments[0];
	   	  callback = arguments[1];
	   	} else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	   	  collectionId = arguments[0];
	      collectionRaw = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }

	    socket.emit('createCollection', domainId, collectionId, collectionRaw, function(err, collectionData){
	      callback(err, err ? null : Collection.create(socket, domainId, collectionData));	  
	    });
	  },

      getCollection: function(collectionId, callback){
        const domainId = this.id;
  	    socket.emit('getCollection', domainId, collectionId, function(err, collectionData){
	      callback(err, err ? null : Collection.create(socket, domainId, collectionData));
	    });
      },

      findCollections: function(query, callback){
        const domainId = this.id;
        socket.emit('findCollections', domainId, query, function(err, collectionInfos){
          if(err) return callback(err);
          var collections = _.map(collectionInfos.hits.hits, function(collectionInfo){
      	    return Collection.create(socket, domainId, collectionInfo._source);
          })

	      callback(null, {total:collectionInfos.hits.total, collections: collections});
	    });
      },

      distinctQueryCollections: function(field, wildcard, callback){
   	    var query = {
          collapse:{field: field + '.keyword'},
          aggs:{itemCount:{cardinality:{field: field+'.keyword'}}}
//          _source:[field]
        };

        if(wildcard){
          query.query = {wildcard:{}};
          query.query.wildcard[field+".keyword"] = wildcard;
        }

        this.findCollections(query, callback);
      },

      getDocument: function(collectionId, documentId, callback){
        const domainId = this.id;
    	socket.emit('getDocument', domainId, collectionId, documentId, function(err, docData) {
          if(err) return callback(err);
    
          switch(docData._metadata.type){
          	case 'domain':
          	  callback(null, Domain.create(socket, docData));
          	  break;
            case 'collection':
              callback(null, Collection.create(socket, domainId, docData));
              break;
            case 'view':
              callback(null, View.create(socket, domainId, docData));
              break;
            case 'form':
              callback(null, Form.create(socket, domainId, docData));
              break;
            case 'role':
              callback(null, Role.create(socket, domainId, docData));
              break;
            case 'profile':
              callback(null, Profile.create(socket, domainId, docData));
              break;
            case 'user':
              callback(null, User.create(socket, docData));
              break;
            default:
              callback(null, Document.create(socket, domainId, collectionId, docData));
              break;
          }      
    	});
      },

      createView: function(){
        const domainId = this.id;
    	var viewId, viewRaw, callback;

    	if(arguments.length == 2 && typeof arguments[1] == 'function'){
    	  viewId = uuidv4();
    	  viewRaw = arguments[0];
    	  callback = arguments[1];
    	} else if(arguments.length == 3 && typeof arguments[2] == 'function'){
    	  viewId = arguments[0];
    	  viewRaw = arguments[1];
    	  callback = arguments[2];
    	} else {
    	  throw new Error('Number or type of Arguments is not correct!');
    	}

    	socket.emit('createView', domainId, viewId, viewRaw, function(err, viewData){
    	  callback(err, err ? null : View.create(socket, domainId, viewData));	  
    	});
      },

      getView: function(viewId, callback){
        const domainId = this.id;
    	socket.emit('getView', domainId, viewId, function(err, viewData){
    	  callback(err, err ? null : View.create(socket, domainId, viewData));
    	});
      },

      findViews: function(query, callback){
        const domainId = this.id;
        socket.emit('findViews', domainId, query, function(err, viewInfos){
          if(err) return callback(err); 
          var views = _.map(viewInfos.hits.hits, function(viewInfo){
          	return View.create(socket, domainId, viewInfo._source);
          })
    	  callback(null, {total:viewInfos.hits.total, views: views});
    	});
      },

      createForm: function(){
        const domainId = this.id;
	    var formId, formRaw, callback;

	    if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      formId = uuidv4();
	      formRaw = arguments[0];
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      formId = arguments[0];
	      formRaw = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }
	    
	    socket.emit('createForm', domainId, formId, formRaw, function(err, formData){
	      callback(err, err ? null : Form.create(socket, domainId, formData));	  
	    });
      },
  
      getForm: function(formId, callback){
        const domainId = this.id;
	    socket.emit('getForm', domainId, formId, function(err, formData){
	      callback(err, err ? null : Form.create(socket, domainId, formData));
	    });
      },

      findForms: function(query, callback){
        const domainId = this.id;
        socket.emit('findForms', domainId, query, function(err, formInfos){
          if(err) return callback(err); 
          var forms = _.map(formInfos.hits.hits, function(formInfo){
          	return Form.create(socket, domainId, formInfo._source);
          })
    	  callback(null, {total:formInfos.hits.total, forms: forms});
    	});
      },

      createRole: function(roleId, roleRaw, callback){
        const domainId = this.id;
	    socket.emit('createRole', domainId, roleId, roleRaw, function(err, roleData){
	      callback(err, err ? null : Role.create(socket, domainId, roleData));	  
	    });
      },

      getRole: function(roleId, callback){
        const domainId = this.id;
	    socket.emit('getRole', domainId, roleId, function(err, roleData){
	      callback(err, err ? null : Role.create(socket, domainId, roleData));
	    });
      },  

      findRoles: function(query, callback){
        const domainId = this.id;
        socket.emit('findRoles', domainId, query, function(err, roleInfos){
          if(err) return callback(err);      	
          var roles = _.map(roleInfos.hits.hits, function(roleInfo){
      	    return Role.create(socket, domainId, roleInfo._source);
          })

	      callback(null, {total:roleInfos.hits.total, roles: roles});
	    });
      },

      createProfile: function(profileId, profileRaw, callback){
        const domainId = this.id;
	    if(arguments.length == 2 && typeof arguments[1] == 'function'){
	      profileId = uuidv4();
	      profileRaw = arguments[0];
	      callback = arguments[1];
	    } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
	      profileId = arguments[0];
	      profileRaw = arguments[1];
	      callback = arguments[2];
	    } else {
	      throw new Error('Number or type of Arguments is not correct!');
	    }
	    
	    socket.emit('createProfile', domainId, profileId, profileRaw, function(err, profileData){
	      callback(err, err ? null : Profile.create(socket, domainId, profileData));	  
	    });
      },

      getProfile: function(profileId, callback){
        const domainId = this.id;
	    socket.emit('getProfile', domainId, profileId, function(err, profileData){
	      callback(err, err ? null : Profile.create(socket, domainId, profileData));
	    });
      },  

      findProfiles: function(query, callback){
        const domainId = this.id;
        socket.emit('findProfiles', domainId, query, function(err, profileInfos){
          if(err) return callback(err);      	
          var profiles = _.map(profileInfos.hits.hits, function(profileInfo){
      	    return Profile.create(socket, domainId, profileInfo._source);
          })

	      callback(null, {total:profileInfos.hits.total, profiles: profiles});
	    });
      },

      createUser: function(userId, userRaw, callback){
	    socket.emit('createUser', userId, userRaw, function(err, userData){
	      callback(err, err ? null : User.create(socket, domainId, userData));	  
	    });
      },

      getUser: function(userId, callback){
    	socket.emit('getUser', userId, function(err, userData){
    	  callback(err, err ? null : User.create(socket, domainId, userData));
    	});
      },  

      findUsers: function(query, callback){
        socket.emit('findUsers', query, function(err, userInfos){
          if(err) return callback(err);      	
          var users = _.map(userInfos.hits.hits, function(userInfo){
          	return User.create(socket, domainId, userInfo._source);
          })

    	  callback(null, {total:profileInfos.hits.total, profiles: profiles});
    	});
      },

      createDomain: function(domainId, domainRaw, callback){
    	socket.emit('createDomain', domainId, domainRaw, function(err, domainData){
    	  callback(err, err ? null : Domain.create(socket, domainData));	  
    	});
      },

      getDomain: function(domainId, callback){
    	socket.emit('getDomain', domainId, function(err, domainData){
    	  callback(err, err ? null : Domain.create(socket, domainData));
    	});
      },  

      findDomains: function(query, callback){
        socket.emit('findDomains', query, function(err, domainInfos){
          if(err) return callback(err);
          var domains = _.map(domainInfos.hits.hits, function(domainInfo){
            return Domain.create(socket, domainInfo._source)
          })
    	  callback(null, {total:domainInfos.hits.total, domains: domains});
    	});
      },

      replace: function(domainRaw, callback){
    	const self = this, domainId = this.id;
    	socket.emit('replaceDomain', domainId, domainRaw, function(err, domainData){
    	  if(err) return callback(err);

    	  for(var key in self) {
    	    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
    	  }
			  
    	  _.merge(self, domainData);
    	  callback(null, true);	  
    	});
      },

      patch: function(patch, callback){
        const self = this, domainId = this.id;
    	socket.emit('patchDomain', domainId, patch, function(err, domainData){
    	  if(err) return callback(err);
			  
    	  for(var key in self) {
    	    if(self.hasOwnProperty(key)&&!_.isFunction(self[key])) try{delete self[key];}catch(e){}
    	  }

    	  _.merge(self, domainData);
    	  callback(null, true);	  
    	});
      },

      remove: function(callback){
        socket.emit('removeDomain', this.id, function(err, result){
    	  callback(err, result);	  
    	});
      },

      getACL: function(callback) {
        socket.emit('getDomainACL', this.id, function(err, acl) {
    	  callback(err, acl);
    	});
      },

      replaceACL : function(acl, callback) {
        socket.emit('replaceDomainACL', this.id, acl, function(err, result) {
      	  callback(err, result);
    	});
      },

      patchACL : function(aclPatch, callback) {
        socket.emit('patchDomainACL',  this.id, aclPatch, function(err, result) {
    	  callback(err, result);
    	});
      },

      garbageCollection: function(callback){
        socket.emit('domainGarbageCollection', this.id, function(err, result){
    	  callback(err, result);	  
        });
      },

      getFormId: function(){
      	return this._metadata.formId;
      }

  	};

  	function constructor(){};
  	_.merge(constructor.prototype, proto);
  	return _.merge(new constructor(), domainData);
  }
};

export { Domain as default};