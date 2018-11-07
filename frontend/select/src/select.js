import * as $ from 'jquery';
import _ from 'lodash';
import 'bootstrap';

import './select.scss';
import selectHtml from './select.html';

function create(opts) {
  var
    title, selectedItems, mode,
    $container, $selectBtn, $dropdownMenu, $itemContainer, $input, $inputIcon, $clearLink,
    changeCallback, _armItem, _armItems, _refresh, _refreshButton, _refreshClearLink, 
    _setSearchIcon, _setClearIcon, _fetchMenuItems, _defaultRender, _notifyChanged, 
    getSelectedItems, reset;

  _setSearchIcon = function(){
    $inputIcon.removeClass('fa-times');
    $inputIcon.addClass('fa-search');
  };

  _setClearIcon = function(){
    $inputIcon.removeClass('fa-search');
    $inputIcon.addClass('fa-times');
  };

  _refreshClearLink = function(){
    var filter = $input.val();
    if(filter.trim() == ''){
      $clearLink.show();
      if(selectedItems.length > 0){
        $clearLink.removeClass('disabled');      
      }else{
        $clearLink.addClass('disabled');
      }
    }else{
      $clearLink.hide();
    }
  };

  _fetchMenuItems = function(){
    var filter = $input.val().trim();
    filter = filter == "" ? '*' : '*'+filter+'*';
    opts.menuItems(filter, function(items){
      _refreshClearLink();
      _armItems(items);
    });
  };

  _armItem = function(label, value, checked){
    var itemHtml, 
        icon = mode == 'multi' ? 'fa-square' : 'fa-circle',
        iconCheck = mode == 'multi' ? 'fa-check-square' : 'fa-check-circle';
    if(checked){
      itemHtml = '<li><i class="fa-li fa ' + iconCheck + '"></i>' + label + '</li>';
    }else{
      itemHtml = '<li><i class="fa-li fa ' + icon + '"></i>' + label + '</li>';
    }
    return itemHtml;
  };

  _armItems = function(items){
    $itemContainer.empty();

    _.each(_.intersectionWith(items, selectedItems, _.isEqual), function(item){
      $(_armItem(item.label, item.value, true)).data('item', item).appendTo($itemContainer);
    });

    $.each(_.differenceWith(items, selectedItems, _.isEqual), function(index, item){
      $(_armItem(item.label, item.value)).data('item', item).appendTo($itemContainer);
    });
  };

  _defaultRender = function(selectedItems){
    var label = _.reduce(selectedItems, function(text, item) {
      return text == '' ? item.label : text + ',' + item.label;
    }, '');
  
    return label == '' ? "Please select a " + title : label;
  };

  _refreshButton = function(){
    var render = opts.render || _defaultRender;
    $selectBtn.html(render(selectedItems));
  };

  _notifyChanged = function(){
    if(opts.onValueChanged){
      opts.onValueChanged({selectedItems:selectedItems});
    }
    $itemContainer.trigger('valueChanged', {selectedItems:selectedItems});
  };

  _refresh = function(){
    _refreshClearLink();
    _refreshButton();
  };

  title = opts.title;
  mode = opts.mode || 'single';
  selectedItems = opts.selectedItems||[];
  $container = opts.$container;
  $container.html(selectHtml).addClass('select dropdown btn-group');
  $selectBtn = $container.children('button');
  $dropdownMenu = $('.dropdown-menu', $container);
  $clearLink = $('.clear-selected-items', $container);
  $itemContainer = $('.item-container', $container);
  $input = $('input', $container);
  $inputIcon = $('.input-group-text>i', $container);

  _refreshButton();

  $input.on('keyup change', function(){
    var filter = $input.val();
    if(filter != ''){
      _setClearIcon();
    }else{
      _setSearchIcon();
    }

    _fetchMenuItems();
  });

  $inputIcon.on('click', function(){
    var filter = $input.val(), rearm = filter.trim() != '';
    $input.val('');
    _setSearchIcon();    
    if(rearm){
      _fetchMenuItems();
    } 
  });

  $clearLink.on('click', function(){
    if(!$clearLink.hasClass('disabled') && selectedItems.length > 0){
      if(mode=='multi'){
        $('li>.fa-li.fa-check-square', $itemContainer).removeClass('fa-check-square').addClass('fa-square');
      }else{
        $('li>.fa-li.fa-check-circle', $itemContainer).removeClass('fa-check-circle').addClass('fa-circle');
      }
      selectedItems = [];
      _refresh();
      _fetchMenuItems();
      _notifyChanged();      
    }
  });

  $container.on('show.bs.dropdown', function () {
    $input.val('');
    _setSearchIcon();
     _fetchMenuItems();
  });

  $dropdownMenu.on('click', function(e){
    e.stopImmediatePropagation();
  });

  $itemContainer.on('click','li', function(e){
    var $target = $(e.target), $i = $('i.fa-li', $target), item = $target.data('item');
    if(mode == 'multi'){
      if($i.hasClass('fa-check-square')){
        $i.removeClass('fa-check-square').addClass('fa-square');
        selectedItems = _.differenceWith(selectedItems, [item], _.isEqual);
      }else if($i.hasClass('fa-square')){
        $i.removeClass('fa-square').addClass('fa-check-square');
        selectedItems = _.unionWith(selectedItems, [item], _.isEqual);
      }
    } else {
      if($i.hasClass('fa-check-circle')){
        $i.removeClass('fa-check-circle').addClass('fa-circle');
        selectedItems = [];
      }else if($i.hasClass('fa-circle')){
        $('li>.fa-li.fa-check-circle', $itemContainer).removeClass('fa-check-circle').addClass('fa-circle');
        $i.removeClass('fa-circle').addClass('fa-check-circle');
        selectedItems = [item];
      }
    }
    _refresh();
    _notifyChanged();
  });

  $itemContainer.on('click','li>i.fa-li', function(e){
    $(e.target).parent('li').click();    
  });

  getSelectedItems = function(){
    return selectedItems;
  };

  reset = function(){
    selectedItems = [];
    _refresh();
  };

  return {
    reset: reset,
    getSelectedItems: getSelectedItems    
  };
};

export default {
  create: create
}