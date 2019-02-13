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

const io = require('socket.io-client')
  , Domain = require('./domain')
  , User = require('./user')
  , _ = require('lodash');

'use strict';

var _createClient, login, connect;

_createClient = function(token, socket, currentUser) {
  var client = {
    getCurrentUser: function() {
      return currentUser;
    },

    getToken: function() {
      return token;
    },

    emit: function() {
      socket.emit.apply(socket, arguments);
    },

    registerUser: function(userInfo, callback) {
      client.emit('registerUser', userInfo, callback);
    },

    createUser: function(userRaw, callback) {
      client.emit('createUser', userRaw, function(err, userData) {
        callback(err, err ? null : User.create(client, userData));
      });
    },

    getUser: function(userId, callback) {
      client.emit('getUser', userId, function(err, userData) {
        callback(err, err ? null : User.create(client, userData));
      });
    },

    logout: function(callback) {
      client.emit('logout', function(err, result) {
        client.disconnect();
        if (callback)
          callback(err, result);
      });
    },

    joinDomain: function(domainId, userId, permission, callback) {
      client.emit('joinDomain', domainId, userId, permission, callback);
    },

    quitDomain: function(domainId, userId, callback) {
      client.emit('quitDomain', domainId, userId, permission, callback);
    },

    createDomain: function(domainId, domainRaw, callback) {
      client.emit('createDomain', domainId, domainRaw, function(err, domainData) {
        callback(err, err ? null : Domain.create(client, domainData));
      });
    },

    getDomain: function() {
      var domainId, callback;
      if (arguments.length == 1 && typeof arguments[0] == 'function') {
        domainId = document.domain;
        callback = arguments[0];
      } else if (arguments.length == 2 && typeof arguments[1] == 'function') {
        domainId = arguments[0];
        callback = arguments[1];
      } else {
        throw utils.makeError('Error', 'Number or type of arguments is not correct!', arguments);
      }

      client.emit('getDomain', domainId, function(err, domainData) {
        callback(err, err ? null : Domain.create(client, domainData));
      });
    },

    findDomains: function(query, callback) {
      client.emit('findDomains', query, function(err, domainInfos) {
        if (err)
          return callback(err);
        var domains = _.map(domainInfos.hits.hits, function(domainInfo) {
          return Domain.create(client, domainInfo._source);
        })

        callback(null, {
          total: domainInfos.hits.total,
          domains: domains
        });
      });
    },

    distinctQueryDomains: function(field, wildcard, callback) {
      var query = {
        collapse: {
          field: field + '.keyword'
        },
        aggs: {
          itemCount: {
            cardinality: {
              field: field + '.keyword'
            }
          }
        }//        _source:[field]
      };

      if (wildcard) {
        query.query = {
          wildcard: {}
        };
        query.query.wildcard[field + ".keyword"] = wildcard;
      }

      this.findDomains(query, callback);
    },

    disconnect: function() {
      socket.disconnect();
    }
  };

  return client;
}
;

login = function() {
  var userId, password, callback, socket;
  if (arguments.length == 1 && typeof arguments[0] == 'function') {
    callback = arguments[0];
  } else if (arguments.length == 3 && typeof arguments[2] == 'function') {
    userId = arguments[0];
    password = arguments[1];
    callback = arguments[2];
  } else {
    throw new Error('Number or type of arguments is not correct!');
  }

  socket = io.connect('http://localhost:8000/domains');
  socket.on('connect', function() {
    if (!userId) {
      callback(null, _createClient(null, socket, User.create(socket, {
        id: 'anonymous',
        name: 'Anonymous'
      })));
    } else {
      socket.emit('login', userId, password, function(err, token, userData) {
        var newSocket;
        if (err)
          return callback(err);
        newSocket = io.connect('http://localhost:8000/domains?token=' + token)
        newSocket.on('connect', function() {
          callback(null, _createClient(token, newSocket, User.create(newSocket, userData)));
        });
        socket.disconnect();
      });
    }
  });
}
;

connect = function(token, callback) {
  var socket = io.connect('http://localhost:8000/domains?token=' + token);
  socket.on('connect', function() {
    socket.emit('getUser', function(err, userData) {
      callback(err, err ? null : _createClient(token, socket, User.create(socket, userData)));
    });
  });
}
;

module.exports = {
  login: login,
  connect: connect
};
