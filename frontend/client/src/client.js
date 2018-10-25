/*
 * client.js
 * Frontend client module
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
 */

import io from 'socket.io-client';
import Domain from './domain';
import User from './user';
import _ from 'lodash';

'use strict';

var _createClient, login, connect;

_createClient = function(token, socket, currentUser){
  var client = {
  	getCurrentUser: function(){
  	  return currentUser;
  	},

  	getToken: function(){
  	  return token;  		
  	},

  	registerUser: function(userInfo, callback){
  	  socket.emit('registerUser', userInfo, callback);
    },

    createUser: function(userRaw, callback) {
      socket.emit('createUser', userRaw, function(err, userData) {
        callback(err, err ? null : User.create(socket, userData));
      });
    },

    getUser: function(userId, callback) {
      socket.emit('getUser', userId, function(err, userData) {
        callback(err, err ? null : User.create(socket, userData));
      });
    },

    logout: function(callback){
      socket.emit('logout', function(err, result){
   	    socket.disconnect();
        if(callback) callback(err, result);
      });
    },

    joinDomain: function(domainId, userId, permission, callback){
      socket.emit('joinDomain', domainId, userId, permission, callback);
    },

    quitDomain:function(domainId, userId, callback){
      socket.emit('quitDomain', domainId, userId, permission, callback);
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

    disconnect: function(){
      socket.disconnect();
    }  	
  };

  return client;
};

login = function(){
  var userId, password, callback, socket;
  if(arguments.length == 1 && typeof arguments[0] == 'function'){
    callback = arguments[0];
  } else if(arguments.length == 3 && typeof arguments[2] == 'function'){
    userId = arguments[0];
	password = arguments[1];
	callback = arguments[2];
  } else {
    throw new Error('Number or type of arguments is not correct!');
  }

  socket = io.connect('http://localhost:8000/domains');
  socket.on('connect', function(){
    if(!userId){
      callback(null, _createClient(null, socket, User.create(socket, {id: 'anonymous', name: 'Anonymous'})));
	  socket.disconnect();
    }else {
      socket.emit('login', userId, password, function(err, token, userData){
	    var newSocket;
        if(err) return callback(err);
        newSocket = io.connect('http://localhost:8000/domains?token=' + token)
        newSocket.on('connect', function(){
          callback(null, _createClient(token, newSocket, User.create(newSocket, userData)));
        });
        socket.disconnect();
      });
    }
  });
};

connect = function(token, callback){
  var socket = io.connect('http://localhost:8000/domains?token=' + token);
  socket.on('connect', function(){
    socket.emit('getUser', function(err, userData){
	  callback(err, err ? null : _createClient(token, socket, User.create(socket, userData), _clientProto));
    });
  });
};

export default {
  login   : login,
  connect : connect
};