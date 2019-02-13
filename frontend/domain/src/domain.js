import * as $ from 'jquery';
import 'bootstrap';
import _ from 'lodash';
import moment from 'moment';

import 'font-awesome/scss/font-awesome.scss';

import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/data';
import 'jquery.event.gevent';
import 'jquery.event.ue';
import 'jquery.urianchor';

import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

import '@notesabc/account';
import Loader from '@notesabc/loader';
import Client from '@notesabc/frontend-client';

import './domain.scss';
import domainHtml from './domain.html';


$.widget('nm.domain',{
  options:{
    uriAnchor: {}
  },

  _create: function(){
    var o = this.options, self = this;

    this._addClass("nm-domain");
    this.element.html(domainHtml);

    this.$mainContent = $("#mainContent", this.element);

    this.$viewList = $('.favorite-views', this.element);
    this.$newDocumentBtn = $('li.new-document', this.element);

    $('<li/>').appendTo($('.page-container .nav-right', this.element)).account({client: o.client});

    this._on(this.$newDocumentBtn, {click: this._loadNewDialog});
    this._on({
      'click .search-toggle': function(e){
        $('.search-box, .search-input', self.element).toggleClass('active');
        $('.search-input input', self.element).focus();
        e.preventDefault();
      }
    });

    // Sidebar links
    $('.sidebar .sidebar-menu', this.element).on('click','li>a', function () {
      const $this = $(this), $parent = $this.parent(), id = $parent.attr('id');
      if ($parent.hasClass('open')) {
        $parent.children('.dropdown-menu').slideUp(200, () => {
          $parent.removeClass('open');
        });
      } else {
        $parent.parent().children('li.open').children('.dropdown-menu').slideUp(200);
        $parent.parent().children('li.open').children('a').removeClass('open');
        $parent.parent().children('li.open').removeClass('open');
        $parent.children('.dropdown-menu').slideDown(200, () => {
          $parent.addClass('open');
        });
      }

      $('.sidebar').find('.sidebar-link').removeClass('active');
      $this.addClass('active');

      if('views' == id){
        self._changeAnchorPart({
          col: '.views',
          doc: '.views'
        });
      }else if($parent.hasClass('view')){
        self._changeAnchorPart({
          col: '.views',
          doc: $parent.attr('id')
        });
      }else if(id){
        self._changeAnchorPart({
          col: '.views',
          doc: id
        });
      }
    });

    // ٍSidebar Toggle
    $('.sidebar-toggle', this.element).on('click', e => {
      self.element.toggleClass('is-collapsed');
      e.preventDefault();
    });

    /**
     * Wait untill sidebar fully toggled (animated in/out)
     * then trigger window resize event in order to recalculate
     * masonry layout widths and gutters.
     */
    $('#sidebar-toggle', this.element).click(e => {
      e.preventDefault();
      setTimeout(() => {
        window.dispatchEvent(window.EVENT);
      }, 300);
    });

//   $.uriAnchor.configModule({
//     schema_map : {
//       module: ['signup','dashboard', 'email', 'compose', 'calendar', 'chat', 'view', 'document', 'charts', 'forms'],
//       _module:{ id: true, formId:true, type:true }
//     }
//   });

    $.gevent.subscribe(this.element, 'clientChanged',  $.proxy(this._onClientChanged, this));
//     $(window).on("hashchange", $.proxy(this._onHashchange, this));
    this._on(window, {hashchange: this._onHashchange});

    o.domain.findViews({}, function(err, views){
      if(err) return console.log(err);
      _.each(views.views, function(view){
        $(self._armViewListItem(view.title||view.id)).data('item', view).appendTo(self.$viewList);
      });
          
      $(window).trigger('hashchange');
    });
  },

  _armViewListItem: function(name){
    var item = String() + '<li id="' + name + '" class="view nav-item"><a class="sidebar-link">' + name + '</a></li>'
    return item;
  },

  _setAchor: function(anchor){
    var o = this.options;
    o.uriAnchor = anchor;
    $.uriAnchor.setAnchor(anchor, null, true);
  },

  _changeAnchorPart: function(argMap){
    var o = this.options, anchorRevised = $.extend( true, {}, o.uriAnchor), result = true, keyName, keyNameDep;
    for(keyName in argMap){
      if(argMap.hasOwnProperty(keyName) && keyName.indexOf('_') !== 0){
        // update independent key value
        anchorRevised[keyName] = argMap[keyName];

        // update matching dependent key
        keyNameDep = '_' + keyName;
        if(argMap[keyNameDep]){
          anchorRevised[keyNameDep] = argMap[keyNameDep];
        } else {
          delete anchorRevised[keyNameDep];
          delete anchorRevised['_s' + keyNameDep];
        }
      }
    }

    // Attempt to update URI; revert if not successful
    try {
      $.uriAnchor.setAnchor(anchorRevised);
    } catch(error) {
      // replace URI with existing state
      $.uriAnchor.setAnchor(o.uriAnchor, null, true);
      result = false;
    }

    return result;
  },

  _onHashchange: function(event){
    var o = this.options, self = this, anchorProposed, anchorPrevious = $.extend(true, {}, o.uriAnchor), 
        domProposed, colProposed, docProposed, actProposed, isOk = true, errorCallback;

    errorCallback = function(){
      self._setAchor(anchorPrevious)
    };
  
    try {
      anchorProposed = $.uriAnchor.makeAnchorMap(); 
    } catch(error) {
      $.uriAnchor.setAnchor(anchorPrevious, null, true);
      return false;
    }
    o.uriAnchor = anchorProposed;

    domProposed = anchorProposed.dom;
    colProposed = anchorProposed.col;
    docProposed = anchorProposed.doc;
    actProposed = anchorProposed.act;
    if(anchorPrevious !== anchorProposed){
      var opts = {error: errorCallback};
      if(".views" === colProposed){
        switch(docProposed){
          case 'signup':
            this._loadSignUp(opts);
            break;
          case 'dashboard':
            this._loadDashboard(opts);
            break;
          case 'email':
            this._loadEmail(opts);
            break;
          case 'calendar':
            this._loadCalendar(opts);
            break;
          case 'chat':
            this._loadChat(opts);
            break;
          default:            
            opts.domain = o.domain;
            this._loadView(o.domain, docProposed, actProposed, opts);
            break;
        }
      } else {
          opts.domain = o.domain;
          opts.domainId = domProposed;
          opts.collectionId = colProposed;
          opts.documentId = docProposed;
          this._loadDocument(opts);
        }
    }

    return false;
  },

  _loadNewDialog: function(){
    var self = this;
    import(/* webpackChunkName: "new-dialog" */ '@notesabc/new-dialog').then(({default: nd}) => {
      $('<div/>').newdialog({
        $container: self.$mainContent.empty(),
        domain: currentDomain
      }).newdialog('show');
    });
  },

  _loadSignUp: function(opts){
    import(/* webpackChunkName: "signup" */ '@notesabc/signup').then(({default: signUp}) => {
      signUp.init(opts);
    });
  },

  _loadDashboard: function(opts){
    var self = this;
    import(/* webpackChunkName: "dashboard" */ '@notesabc/dashboard').then(() => {
      $('<div/>').appendTo(self.$mainContent.empty()).dashboard(opts);

      $('.scrollable').each((index, el) => {
        new PerfectScrollbar(el,{suppressScrollX:true, wheelPropagation: true});
      });
    });
  },

  _loadEmail: function(opts){
    var self = this;
    import(/* webpackChunkName: "email" */ '@notesabc/email').then(() => {
      $('<div/>').appendTo(self.$mainContent.empty()).email(opts);
    });
  },

  _loadCalendar: function(opts){
    var self = this;
    import(/* webpackChunkName: "calendar" */ '@notesabc/calendar').then(() => {
      $('<div/>').appendTo(self.$mainContent.empty()).calendar(opts);
    });
  },

  _loadChat: function(opts){
    var self = this;
    import(/* webpackChunkName: "chat" */ '@notesabc/chat').then(() => {
      $('<div/>').appendTo(self.$mainContent.empty()).chat(opts);
    });
  },

  _loadView: function(domain, viewId, actId, opts){
    var o = this.options, self = this;
    domain.getView(viewId, function(err, view){
      if(actId){
        var action = _.find(view.actions, function(act){return act.plugin.name == actId});
        Loader.load(action.plugin, function(){
          $('<div/>').appendTo(self.$mainContent.empty())[action.plugin.name]({
            view: view,
            token: o.domain.getClient().getToken(),
            url: "http://localhost:8000/upload-files/"
          });
        });
      } else {
        import(/* webpackChunkName: "view" */ '@notesabc/view').then(() => {
          $("<div/>").appendTo(self.$mainContent.empty()).view({
            domain: domain,
            view: view
          });
        });
      }
    });
  },

  _loadDocument: function(opts){
    var o = this.options, self = this;
    o.domain.getDocument(opts.collectionId, opts.documentId, function(err1, doc){
      if(err1) return console.log(err1);
      var formId = doc.getFormId()||'form';
      o.domain.getForm(formId, function(err2, form){
        if(err2) return console.log(err2);
        Loader.load(form.plugin, function(module){
          $('<div/>').appendTo(self.$mainContent.empty()).form({
            client: o.client,
            form: form,
            document: doc
          });
        });
      });
    });
  },

  _onClientChanged: function(event, client){
    this.option('client', client);
  },

  _setOption: function(key, value){
    if(key === 'client'){
      var client = value;
      if(client.getCurrentUser().isAnonymous()){
        localStorage.removeItem('token');
      }else{
        localStorage.setItem('token', client.getToken());
      }
    }
    this._super(key, value);
  }
});
