function setCurrentDomain(domainId){
  client.getDomain(domainId||document.domain, function(err, domain){
    if(err) return console.log(err);
    console.log('Domain:');
    console.log(domain);
    window.domain = domain;
  });
};

setCurrentDomain();

currentDomain.getView(".views",function(err,view){
  view.patch([{op:'add', path:'/columns', value:[
      {title:'Id', name:'id', data: 'id', className:'id'},
      {title:'Title', name:'title', data: 'title', className:'title'},
      {title:'Collections', name:'collections', data: 'collections', sortable: false},
      {title:'Author', name:'_metadata.author', data:'_metadata.author'},
      {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
      {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
      {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
      {sortable: false}
  ]},{op:'add', path:'/searchColumns', value:[
      {title:'Id', name:'id', type:'keywords'},
      {title:'Title', name: 'title', type:'keywords'},
      {title:'Collections', name:'collections', type:'keywords'},
      {title:'Author', name:'_metadata.author', type:'keywords'},
      {title:'Revision', name:'_metadata.revision', type:'numericRange'},
      {title:'Created', name:'_metadata.created',type:'datetimeRange'},
      {title:'Updated', name: '_metadata.updated', type:'datetimeRange'}
  ]},{op:'add',path:'/order', value:'[[6,"desc"],[5,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".collections",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".forms",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".profiles",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".roles",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".users",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".domains",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});

currentDomain.getView(".files",function(err,view){
  view.patch([{op:'add',path:'/columns', value:[
    {title:'Id', name:'id', data: 'id', className:'id'},
    {title:'Title', name:'title', data: 'title', className:'title'},
    {title:'Author', name:'_metadata.author', data:'_metadata.author'},
    {title:'Revision', name:'_metadata.revision', data:'_metadata.revision'},
    {title:'Created', name:'_metadata.created', data:'_metadata.created', className:'datetime'},
    {title:'Updated', name: '_metadata.updated', data:'_metadata.updated', className:'datetime'},
    {sortable: false}
  ]},{op:'add',path:'/searchColumns', value:[
    {title:'Id', name:'id', type:'keywords'},
    {title:'Title', name: 'title', type:'keywords'},
    {title:'Author', name:'_metadata.author', type:'keywords'},
    {title:'Revision', name:'_metadata.revision', type:'numericRange'},
    {title:'Created', name:'_metadata.created',type:'datetimeRange'},
    {title:'Updated', name: '_metadata.updated', type:'datetimeRange'},
  ]},{op:'add',path:'/order', value:'[[5,"desc"],[4,"desc"]]'
  }], function(err, result){console.log(arguments);});
});


currentDomain.getCollection('.views', function(err1, viewCollection){
  if(err1) return console.log(err1);
  console.log('View Collection:');
  console.log(viewCollection);
  window.viewCollection = viewCollection;
});

viewCollection.findDocuments({}, function(err, views){window.views = views.documents;});

_.each(views, function(view){
  view.patch([{op:'add',path:'/search', value:{names:['id.keyword','title.keyword', 'collections.keyword','_metadata.author.keyword']}}], function(err, result){console.log(arguments);});
});

currentDomain.createForm('form',{
  title: 'Form',
  plugin:{
    name: '@notesabc/form',
    js: '@notesabc/form/form.bundle.js',
    css: '@notesabc/form/form.bundle.css'
  }
},function(err, form){
  console.log(arguments);
});

currentDomain.getView('.files', function(err1, fileView){
  console.log(arguments);
  fileView.patch([{
    op:'add', 
    path:'/actions',
    value:[{
      label:'Upload Files', 
      plugin:{
        name:'uploadfiles',
        js:'@notesabc/upload-files/upload-files.bundle.js',
        css:'@notesabc/upload-files/upload-files.bundle.css'
      }
  }]}], function(err2, result){
    console.log(arguments);
  });
});