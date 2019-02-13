var client = require('./src/client');

function initViewView(domain) {
  console.log("=============initViewView================Begin");
  domain.getView(".views", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Collections',
        name: 'collections',
        data: 'collections',
        sortable: false
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Collections',
        name: 'collections',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }]
    }, {
      op: 'add',
      path: '/order',
      value: '[[6,"desc"],[5,"desc"]]'
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initViewView================End");
    });
  });
}

function initFormView(domain) {
  console.log("=============initFormView================Begin");
  domain.getView(".forms", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }, ]
    }, {
      op: 'add',
      path: '/order',
      value: '[[5,"desc"],[4,"desc"]]'
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initFormView================End");
    });
  });
}

function initProfileView(domain) {
  console.log("=============initProfileView================Begin");
  domain.getView(".profiles", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }, ]
    }, {
      op: 'add',
      path: '/order',
      value: '[[5,"desc"],[4,"desc"]]'
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initProfileView================End");
    });
  });
}

function initRoleView(domain) {
  console.log("=============initRoleView================Begin");
  domain.getView(".roles", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }, ]
    }, {
      op: 'add',
      path: '/order',
      value: '[[5,"desc"],[4,"desc"]]'
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initRoleView================End");
    });
  });
}

function initUserView(domain) {
  console.log("=============initUserView================Begin");
  domain.getView(".users", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }, ]
    }, {
      op: 'add',
      path: '/order',
      value: '[[5,"desc"],[4,"desc"]]'
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initUserView================End");
    });
  });
}

function initDomainView(domain) {
  console.log("=============initDomainView================Begin");
  domain.getView(".domains", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }, ]
    }, {
      op: 'add',
      path: '/order',
      value: '[[5,"desc"],[4,"desc"]]'
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initDomainView================End");
    });
  });
}

function initFileView(domain) {
  console.log("=============initFileView================Begin");
  domain.getView(".files", function(err, view) {
    view.patch([{
      op: 'add',
      path: '/columns',
      value: [{
        title: 'Id',
        name: 'id',
        data: 'id',
        className: 'id'
      }, {
        title: 'Title',
        name: 'title',
        data: 'title',
        className: 'title'
      }, {
        title: 'Author',
        name: '_metadata.author',
        data: '_metadata.author'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        data: '_metadata.revision'
      }, {
        title: 'Created',
        name: '_metadata.created',
        data: '_metadata.created',
        className: 'datetime'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        data: '_metadata.updated',
        className: 'datetime'
      }, {
        sortable: false
      }]
    }, {
      op: 'add',
      path: '/searchColumns',
      value: [{
        title: 'Id',
        name: 'id',
        type: 'keywords'
      }, {
        title: 'Title',
        name: 'title',
        type: 'keywords'
      }, {
        title: 'Author',
        name: '_metadata.author',
        type: 'keywords'
      }, {
        title: 'Revision',
        name: '_metadata.revision',
        type: 'numericRange'
      }, {
        title: 'Created',
        name: '_metadata.created',
        type: 'datetimeRange'
      }, {
        title: 'Updated',
        name: '_metadata.updated',
        type: 'datetimeRange'
      }]
    }, {
      op: 'add',
      path: '/order',
      value: '[[5,"desc"],[4,"desc"]]'
    }, {
      op: 'add',
      path: '/actions',
      value: [{
        label: 'Upload Files',
        plugin: {
          name: 'uploadfiles',
          js: '@notesabc/upload-files/upload-files.bundle.js',
          css: '@notesabc/upload-files/upload-files.bundle.css'
        }
      }]
    }], function(err, result) {
      console.log(arguments);
      console.log("=============initFileView================End");
    });
  });
}

function initViewSearch(domain) {
  console.log("=============initViewSearch================Begin");
  domain.getCollection('.views', function(err1, viewCollection) {
    if (err1)
      return console.log(err1);
    viewCollection.findDocuments({}, function(err, views) {
      views.documents.forEach(function(view) {
        view.patch([{
          op: 'add',
          path: '/search',
          value: {
            names: ['id.keyword', 'title.keyword', 'collections.keyword', '_metadata.author.keyword']
          }
        }], function(err, result) {
          console.log(arguments);
          console.log("=============initViewSearch================End");
        });
      });
    });
  });
}

function initForm(domain) {
  console.log("=============initForm================Begin");
  domain.createForm('form', {
    title: 'Form',
    plugin: {
      name: '@notesabc/form',
      js: '@notesabc/form/form.bundle.js',
      css: '@notesabc/form/form.bundle.css'
    }
  }, function(err, form) {
    console.log(arguments);
  console.log("=============initForm================End");    
  });
}

client.login('administrator', '!QAZ)OKM', function(err, client) {
  if (err)
    return console.log(err);
  
  client.getDomain('localhost', function(err, domain) {
    if (err)
      return console.log(err);

    initViewView(domain);
    initFormView(domain);
    initProfileView(domain);
    initRoleView(domain);
    initUserView(domain);
    initDomainView(domain);
    initFileView(domain);

    initViewSearch(domain);
    initForm(domain);
  });
});
