var sliderIndex = 0;
var itemIndex = [0];
var currSlider_nr = -1;
var currSlider;
var targetInput;
var global_items = 0;


window.DZSAP_LEGACY_SLIDERS_MODE = ''; // -- "sliders" or "vpconfigs"

jQuery(document).ready(function ($) {

  window.DZSAP_LEGACY_SLIDERS_MODE = $('body').hasClass('zoomsounds_page_dzsap_configs') ? 'vpconfigs' : 'sliders';

  if (window.dzsap_settings) {

  } else {
    console.log("%c dzsapsettings not defined .. ", 'color: #dd2222;')
    return '';
  }
  dzsap_settings.currSlider = parseInt(dzsap_settings.currSlider, 10);


  //console.log(dzsap_settings.currSlider)


  setTimeout(function () {

    // console.info("'.dzs-tabs.auto-init-from-vpconfig' - ",$('.dzs-tabs.auto-init-from-vpconfig'));

    dzstaa_init('.dzs-tabs.auto-init-from-vpconfig', {
      'design_tabsposition': 'top'
      , design_transition: 'fade'
      , design_tabswidth: 'default'
      , toggle_breakpoint: '200'
      , toggle_type: 'accordion'
      , toggle_type: 'accordion'
      , settings_enable_linking: 'on'
      , settings_appendWholeContent: true
      , refresh_tab_height: '1000'
    });


  }, 1000);

  setTimeout(function () {

    dzssel_init('select.dzs-style-me', {init_each: true});
  }, 1500);


  $('.saveconfirmer').fadeOut('slow');
  $('.add-slider').bind('click', sliders_click_addslider);

  $(document).on("click", ".item-preview", item_open);
  //currSlider = jQuery('.slider-con').eq(currSlider_nr);
  $('.master-save').bind('click', sliders_saveall);
  $('.slider-save').bind('click', sliders_saveslider);
  $('.master-save-vpc').bind('click', sliders_saveall_vpc);
  $('.slider-save-vpc').bind('click', sliders_saveslider_vpc);


  $(document).on('change', '.dzs-dependency-field, .main-media-file', handle_submit);

  $(document).delegate(".main-id", "change", sliders_change_mainid);
  $(document).delegate(".main-thumb", "change", sliders_change_mainthumb);
  $(document).delegate(".slider-edit", "click", sliders_click_slideredit);
  $(document).delegate(".slider-duplicate", "click", sliders_click_sliderduplicate);
  $(document).delegate(".slider-delete", "click", sliders_click_sliderdelete);
  $(document).delegate(".slider-sliderexport", "click", sliders_click_sliderexport);
  $(document).delegate(".slider-embed", "click", sliders_click_sliderembed);

  $(document).delegate(".item-delete", "click", sliders_click_itemdelete);
  $(document).delegate(".item-duplicate", "click", sliders_click_itemduplicate);

  $(document).delegate(".upload_file", "click", sliders_wpupload);
  $(document).delegate(".item-type", "change", sliders_itemchangetype);

  $('.item-type').trigger('change');
  $('.main-thumb').trigger('change');


  $(document).on('change', '*[name="0-settings-vpconfig"]', handle_change);
  $(document).on('click', '.quick-edit-vp,button[name=dzsap_save_pcm]', handle_mouse);


  function handle_mouse(e) {


    var _t = $(this);

    if (_t.attr('name') == 'dzsap_save_pcm') {


      // console.info("HMM");


      var _c = $('*[name=dzsap_pcm_data]').eq(0);


      var data = {
        action: 'dzsap_submit_pcm',
        postdata: _c.val(),
        call_from: 'manual_wave_overwrite',
        playerid: _c.attr('data-id')
      };


      window.dzsap_generating_pcm = false;


      if (ajaxurl) {


        $.ajax({
          type: "POST",
          url: ajaxurl,
          data: data,
          success: function (response) {

          }
        });
      }


      return false;
    }
    if (_t.hasClass('quick-edit-vp')) {
      // console.info("ceva");
      window.open_ultibox(null, {

        type: 'iframe'
        , source: _t.attr('href')
        , scaling: 'fill' // -- this is the under description
        , suggested_width: '400' // -- this is the under description
        , suggested_height: '95vh' // -- this is the under description
        , item: null // -- we can pass the items from here too

      });

      return false;
    }

  }

  function handle_change(e) {

    // console.info(e);

    var _t = $(this);
    if (_t.hasClass('dzs-dependency-field')) {
      // console.info("ceva");
      check_dependency_settings();
    }


    if (_t.attr('name') == '0-settings-vpconfig') {


      var ind = 0;

      _t.children().each(function () {
        var _t2 = $(this);

        // console.info(_t2);
        if (_t2.prop('selected')) {
          ind = _t2.parent().children().index(_t2) - 1;
          return false;
        }
      });

      $('#quick-edit').attr('href', add_query_arg($('#quick-edit').attr('href'), 'currslider', ind));
      // $('#quick-edit').attr('href', add_query_arg($('#quick-edit').attr('href'),'dbname',$('*[name=dzsvg_selectdb]').val()));
      // console.info(ind);

    }

  }


  $('.import-export-db-con .the-toggle').click(function () {
    var _t = $(this);
    var _cont = _t.parent().children('.the-content-mask');
    /*
     if(_cont.css('display')=='none')
     _cont.slideDown('slow');
     else
     _cont.slideUp('slow');
     */
    var cont_h = _cont.children('.the-content').height() + 50 + 19;
    if (_cont.css('height') == '0px')
      _cont.stop().animate({
        'height': cont_h
      }, 200);
    else
      _cont.stop().animate({
        'height': 0
      }, 200);


  });
  dzsap_setupDbSelect();
  setTimeout(sliders_addlisteners, 1000);
  $('.import-export-db-con .the-content-mask').css({
    'height': 0
  })


  function handle_submit(e) {
    var _t = $(this);


    if (e.type == 'change') {
      if (_t.hasClass('dzs-dependency-field')) {
        // console.info("dzs-dependency-field changed");
      }


      if (_t.hasClass('main-media-file')) {
        // console.info('main-media-file changed', _t);

        var _mainThumb = _t.parent().parent().find('.main-thumb');

        // console.info(_mainThumb.val());

        setTimeout(function () {
          if (_mainThumb.val() == '' && _mainThumb.val() != 'none') {


            var data = {
              action: 'dzsap_get_thumb_from_meta'
              , postdata: _t.val()
            };
            $.post(ajaxurl, data, function (response) {
              console.groupCollapsed('imagedata');
              console.log('Got this from the server: ' + response);
              console.groupEnd();

              if (response.indexOf('image data - ') == 0) {
                // console.info('yes',_mainThumb);

                response = response.replace('image data - ', '');

                // console.info(_t.parent().parent().parent().find('.item-preview'))

                if (response) {


                  if (_mainThumb.val() == '' && _mainThumb.val() != 'none') {
                    _mainThumb.val('data:image/jpeg;base64,' + response);
                    _mainThumb.trigger('change');
                  }
                }
                // _t.parent().parent().parent().find('.item-preview').css('background-image', "url(data:image/jpeg;base64,"+response+')');
              } else {

                // _t.parent().parent().parent().find('.item-preview').css('background-image', "url("+response+')');
                if (_mainThumb.val() == '' && _mainThumb.val() != 'none') {
                  _mainThumb.val(response);
                  _mainThumb.trigger('change');
                }
              }

            });
          }

        }, 1000);
      }
    }
  }


  function check_dependency_settings() {
    $('*[data-dependency]').each(function () {
      var _t = $(this);


      // console.info(_t);
      var aux = _t.attr('data-dependency');

      if (aux.indexOf('"') == 0) {
        aux = aux.replace(/"/g, '');
      }
      aux = aux.replace(/{quotquot}/g, '"');

      console.warn('aux - ', aux);
      var dep_arr = JSON.parse(aux);

      // console.warn(dep_arr);

      if (dep_arr[0]) {
        var _c = $('*[name="' + dep_arr[0].element + '"]').eq(0);

        // console.info(_c, dep_arr[0].element, dep_arr[0].value);

        var sw_show = false;

        for (var i3 in dep_arr[0].value) {
          if (_c.val() == dep_arr[0].value[i3]) {
            sw_show = true;
            break;

          }
        }

        if (sw_show) {
          _t.show();
        } else {
          _t.hide();
        }


      }
    })
  }
});

function sliders_ready($) {


};


function sliders_allready() {

  jQuery('table.main_sliders').find('.slider-in-table').eq(dzsap_settings.currSlider).addClass('active');
}

function dzsap_setupDbSelect() {
  var _c = jQuery('.db-select.dzsap');
  //console.log(_c);
  _c.append('<div class="db-select-nicecon"><div id="db-select-scroller-con" class="scroller-con easing" style="width: 180px; height: 80px;"><div class="inner"></div></div></div>');
  _c.find('.main-select').children().each(function () {
    var _t = jQuery(this);
    _c.find('.inner').append('<div class="a-db-option">select database <span class="strong">' + _t.text() + '</span><a href="' + _t.attr('data-newurl') + '" class="todb">&raquo;</a></div>');
  })
  _c.find('.inner').append('<div class="a-db-option">create database <input class="newdb"/><a href=" " class="todb createdb">&raquo;</a></div>');

  if (jQuery.fn.scroller) {
    //console.log(jQuery('#db-select-scroller-con'));
    jQuery('#db-select-scroller-con').scroller({
      settings_skin: 'skin_slider'
    });
  }
  _c.find('.todb.createdb').eq(0).bind('click', function () {
    var _t = jQuery(this);
    //console.log(_t);
    if (_t.prev().val() == '') {
      _t.prev().addClass('attention');
      setTimeout(function () {
        _t.prev().removeClass('attention');

      }, 1000)
      return false;

    } else {
      var aux = _c.find('.replaceurlhelper').eq(0).text();
      aux = aux.replace('replaceurlhere', _t.prev().val());
      _t.attr('href', aux);
    }
  })
  jQuery('.dzsap .btn-show-dbs').bind('click', function () {
    //console.log(jQuery('.db-select-nicecon').eq(0));
    var _t = jQuery(this).parent();
    if (_t.find('.db-select-nicecon').eq(0).hasClass('active')) {
      _t.find('.db-select-nicecon').eq(0).removeClass('active')
    } else {
      _t.find('.db-select-nicecon').eq(0).addClass('active')
    }
  })
}


function sliders_click_sliderexport() {
  var _t = jQuery(this);
  var par = _t.parent().parent().parent();
  var ind = par.parent().children().index(par);
  var sname = par.children('td').eq(0).html()
  //console.log(_t, ind);

  var url = dzsap_settings.thepath + 'admin/sliderexport.php?KeepThis=true&width=400&height=200&slidernr=' + ind + '&slidername=' + sname + '&currdb=' + window.dzsap_settings.currdb + '&TB_iframe=true';


  if (String(window.location.href).indexOf('dzsap_configs') > -1) {

    url = dzsap_settings.thepath + 'admin/sliderexport_config.php?KeepThis=true&width=400&height=200&slidernr=' + ind + '&slidername=' + sname + '&currdb=' + window.dzsap_settings.currdb + '&TB_iframe=true';
  }


  tb_show('Slide Editor', url);
  return false;
}

function sliders_click_sliderembed() {
  var _t = jQuery(this);
  var par = _t.parent().parent().parent();
  var ind = par.parent().children().index(par);
  var sname = par.children('td').eq(0).html()
  //console.log(_t, ind);

  var htmlForEmbed = DZSAP_LEGACY_SLIDERS_MODE === 'vpconfigs' ? `use this shortcode for embedding: [zoomsounds_player config="${sname}" source="${'https://digitalzoomstudio.net/links/sample-mp3.php'}"]` : 'use this shortcode for embedding: [zoomsounds id="' + sname + '"]';

  jQuery('.saveconfirmer').html(htmlForEmbed);
  jQuery('.saveconfirmer').stop().fadeIn('fast').delay(4000).fadeOut('fast');
  //tb_show('Slide Editor', themesettings.thepath + 'admin/slidersadmin/sliderembed.php?KeepThis=true&width=400&height=200&slidernr=' + ind + '&slidername=' + sname + '&TB_iframe=true');
  return false;
}

function extra_skin_hiddenselect() {
  for (i = 0; i < jQuery('.select-hidden-metastyle').length; i++) {
    var _t = jQuery('.select-hidden-metastyle').eq(i);
    if (_t.hasClass('inited')) {
      continue;
    }
    //console.log(_t);
    _t.addClass('inited');
    _t.children('select').eq(0).bind('change', change_selecthidden);
    change_selecthidden(null, _t.children('select').eq(0));
    _t.find('.an-option').bind('click', click_anoption);
  }

  function change_selecthidden(e, arg) {
    var _c = jQuery(this);
    if (arg != undefined) {
      _c = arg;
    }
    var _con = _c.parent();
    var selind = _c.children().index(_c.children(':selected'));
    var _slidercon = _con.parent().parent();
    //console.log(selind);
    _con.find('.an-option').removeClass('active');
    _con.find('.an-option').eq(selind).addClass('active');
    //console.log(_con);
    do_changemainsliderclass(_slidercon, selind);
  }

  function click_anoption(e) {
    var _c = jQuery(this);
    var ind = _c.parent().children().index(_c);
    var _con = _c.parent().parent();
    var _slidercon = _con.parent().parent();
    _c.parent().children().removeClass('active');
    _c.addClass('active');
    _con.children('select').eq(0).children().removeAttr('selected');
    _con.children('select').eq(0).children().eq(ind).attr('selected', 'selected');
//        console.log('ceva', _c, ind);
    do_changemainsliderclass(_slidercon, ind);
    //console.log(_c, ind, _con, _slidercon);
  }

  function do_changemainsliderclass(arg, argval) {
    //extra function - handmade
//        console.log(arg, argval)
    if (arg.hasClass('slider-con')) {
      arg.removeClass('mode_normal');
      arg.removeClass('mode_ytuser');
      arg.removeClass('mode_ytplaylist');
      arg.removeClass('mode_vimeouser');
      if (argval == 0) {
        arg.addClass('mode_normal')
      }
      if (argval == 1) {
        arg.addClass('mode_ytuser')
      }
      if (argval == 2) {
        arg.addClass('mode_ytplaylist')
      }
      if (argval == 3) {
        arg.addClass('mode_vimeouser')
      }

    }
    if (arg.hasClass('item-settings-con')) {

      // console.info(arg, argval);
      arg.removeClass('type_audio type_soundcloud type_shoutcast type_youtube type_mediafile type_inline');

      if (argval == 0) {
        arg.addClass('type_mediafile')
      }
      if (argval == 1) {
        arg.addClass('type_soundcloud')
      }
      if (argval == 2) {
        arg.addClass('type_shoutcast')
      }
      if (argval == 3) {
        arg.addClass('type_youtube')
      }
      if (argval == 4) {
        arg.addClass('type_audio')
      }
      if (argval == 5) {
        arg.addClass('type_inline')
      }
    }
  }

}


function sliders_reinit() {
  jQuery('.with_colorpicker').each(function () {
    var _t = jQuery(this);
    if (_t.hasClass('treated')) {
      return;
    }
    if (jQuery.fn.farbtastic) {
      _t.next().find('.picker').farbtastic(_t);

    }
    _t.addClass('treated');
  });
}

function sliders_itemchangetype() {
  var _t = jQuery(this);
  var selval = _t.find(':selected').val();
  //var
  var target = _t.parent().parent().parent().find('.main-source');
  //console.log(_t);
  if (selval == 'inline') {
    target.css({
      'height': 80,
      'resize': 'vertical'
    });
  } else {
    target.css({
      'height': 23,
      'resize': 'none'
    });
  }

}

var uploader_frame;

function sliders_wpupload() {
  var _t = jQuery(this);
  targetInput = _t.prev();

  var searched_type = '';

  if (targetInput.hasClass('upload-type-audio')) {
    searched_type = 'audio';
  }
  if (targetInput.hasClass('upload-type-image')) {
    searched_type = 'image';
  }


  if (typeof wp != 'undefined' && typeof wp.media != 'undefined') {
    uploader_frame = wp.media.frames.dzsap_addplayer = wp.media({
      // Set the title of the modal.
      title: "Insert Media Modal",
      multiple: true,
      // Tell the modal to show only images.
      library: {
        type: searched_type
      },

      // Customize the submit button.
      button: {
        // Set the text of the button.
        text: "Insert Media",
        // Tell the button not to close the modal, since we're
        // going to refresh the page when the image is selected.
        close: false
      }
    });

    // When an image is selected, run a callback.
    uploader_frame.on('select', function () {
      //console.info(uploader_frame.state().get('selection'), uploader_frame.state().get('selection').length, uploader_frame.state().get('selection')._source);
      var attachment = uploader_frame.state().get('selection').first();

      //console.log(attachment.attributes, $('*[name*="video-player-config"]'));
      /*
      var arg = '[zoomsounds source="'+attachment.attributes.url+'" config="'+jQuery('*[name*="audio-player-config"]').val()+'"]';

      if(typeof(top.dzsap_receiver)=='function'){
          top.dzsap_receiver(arg);
      }
      */

      if (targetInput.hasClass('upload-prop-id')) {
        targetInput.val(attachment.attributes.id);
      } else {
        targetInput.val(attachment.attributes.url);

      }


      targetInput.trigger('change');
      uploader_frame.close();
    });

    // Finally, open the modal.
    uploader_frame.open();
  } else {
    tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true&amp;post_id=1&amp;width=640&amp;height=105');
    var backup_send_to_editor = window.send_to_editor;
    var intval = window.setInterval(function () {
      if (jQuery('#TB_iframeContent').attr('src') != undefined && jQuery('#TB_iframeContent').attr('src').indexOf("&field_id=") !== -1) {
        jQuery('#TB_iframeContent').contents().find('#tab-type_url').hide();
      }
      jQuery('#TB_iframeContent').contents().find('.savesend .button').val("Upload to Video Gallery");
    }, 50);
    window.send_to_editor = function (arg) {
      var fullpath = arg
        , fullpathArray = fullpath.split('>');
      //fullpath = fullpathArray[1] + '>';


      var aux3 = jQuery(fullpath).attr('href');


      targetInput.val(aux3);
      targetInput.trigger('change');
      tb_remove();
      window.clearInterval(intval);
      window.send_to_editor = backup_send_to_editor;
    };
  }


  return false;
}

function sliders_click_slideredit() {

  if (dzsap_settings.is_safebinding == 'on') {

  } else {
    var index = jQuery('.slider-edit').index(jQuery(this));
    sliders_showslider(index);
    return false;
  }
}

function sliders_click_sliderduplicate() {
  var index = jQuery('.slider-duplicate').index(jQuery(this));
  //sliders_showslider(index);

  // -- duplicate
  jQuery('.main_sliders').children('tbody').append('<tr class="slider-in-table"><td>' + jQuery('.slider-con').eq(index).find('.main-id').eq(0).val() + '</td><td class="button_view"><strong><a href="#" class="slider-action slider-edit">Edit</a></strong></td><td class="button_view"><strong><a href="#" class="slider-action slider-embed">Embed</a></strong></td><td class="button_view"><strong><a href="#" class="slider-action slider-sliderexport">Export</a></strong></td><td class="button_view"><strong><a href="#" class="slider-action slider-duplicate">Duplicate</a></strong></td><td class="button_view"><strong><a href="#" class="slider-action slider-delete">Delete</a></strong></td></tr>')
  jQuery('.master-settings').append(jQuery('.slider-con').eq(index).clone());
  for (let i = 0; i < jQuery('.slider-con').eq(sliderIndex).find('.textinput').length; i++) {
    var _cache = jQuery('.slider-con').eq(sliderIndex).find('.textinput').eq(i);
    sliders_rename(_cache, sliderIndex, 'same')
  }


  for (let i = 0; i < jQuery('.slider-con').eq(index).find('textarea').length; i++) {
    var _c = jQuery('.slider-con').last().find('textarea').eq(i);
    //console.log(_c);
    _c.val(jQuery('.slider-con').eq(index).find('textarea').eq(i).val());
  }

  sliders_addlisteners();
  itemIndex[sliderIndex] = 0;
  ++sliderIndex;


  return false;
}

function sliders_click_itemdelete() {
  var index = currSlider.find('.item-delete').index(jQuery(this));
  //console.log(index, itemIndex[currSlider_nr])

  var arg = index;
  sliders_delete_item(arg);
  return false;
}

function sliders_delete_item(arg) {
  currSlider.find('.item-con').eq(arg).remove();
  if (arg < itemIndex[currSlider_nr] - 1) {
    for (let i = arg; i < itemIndex[currSlider_nr] - 1; i++) {
      var _c = currSlider.find('.item-con').eq(i);
      for (j = 0; j < _c.find('.textinput').length; j++) {
        sliders_rename(_c.find('.textinput').eq(j), currSlider_nr, i);
      }
    }
  }
  itemIndex[currSlider_nr]--;
  return false;
}

function sliders_click_itemduplicate() {
  var index = currSlider.find('.item-duplicate').index(jQuery(this));
  var _cache = currSlider.find('.items-con').eq(0);
  _cache.append(jQuery(this).parent().clone());
//    console.log(_cache.children().last());
  for (i = 0; i < _cache.children().last().find('.textinput').length; i++) {
    sliders_rename(_cache.children().last().find('.textinput').eq(i), currSlider_nr, itemIndex[currSlider_nr]);
  }
  for (i = 0; i < _cache.children().last().find('textarea').length; i++) {
    var _c = _cache.children().last().find('textarea').eq(i);
    _c.val(_cache.children().eq(index).find('textarea').eq(i).val());
  }
  itemIndex[currSlider_nr]++;

  return false;
  //sliders_showslider(index);

}

function sliders_click_sliderdelete() {

  var r = confirm("are you sure you want to delete ?");
  if (r == true) {
  } else {
    return false;
  }

  if (dzsap_settings.is_safebinding == 'on') {

  } else {
    var index = jQuery('.slider-delete').index(jQuery(this));
    sliders_deleteslider(index);
    return false;
  }

}

function sliders_deleteslider(arg) {
  //console.log(arg, sliderIndex);
  jQuery('.main_sliders').children('tbody').children().eq(arg).remove();
  jQuery('.slider-con').eq(arg).remove();
  if (arg < sliderIndex - 1) {
    for (i = arg; i < sliderIndex - 1; i++) {
      _cache = jQuery('.slider-con').eq(i);
      for (j = 0; j < _cache.find('.textinput').length; j++) {
        var _c2 = _cache.find('.textinput').eq(j);
        sliders_rename(_c2, i, 'same')
      }
    }
  }

  sliderIndex--;
  if (arg == currSlider_nr) {
    currSlider_nr = -1;
    sliders_showslider(arg);
  }
}

var extra_targettagseditor;
var extra_targetplaylistseditor;

function sliders_addlisteners() {
  jQuery('.add-item').unbind();
  jQuery('.add-item').bind('click', click_additem);
  if (typeof jQuery.fn.sortable != 'undefined') {
    jQuery('.items-con').sortable({
      placeholder: "ui-state-highlight"
      , handle: '.item-preview'
      , update: item_onsorted
    });
  } else {
    console.error('include sortable')
  }
  if (jQuery.fn.singleUploader) {
    jQuery('.dzs-upload').singleUploader();
  }
  if (window.dzstoggle_initalltoggles != undefined) {
    dzstoggle_initalltoggles();
  } else {
    if (window.console) {
      console.info('toggles not defined');
    }
    ;
  }


  jQuery('.btn-tageditor').each(function () {
    var _t = jQuery(this);
    if (_t.hasClass('inited')) {

    } else {
      _t.addClass('inited');
      _t.bind('click', function (e) {
        var _tt = jQuery(this);

        extra_targettagseditor = _tt.prev();
        //console.log(_tt.prev(), extra_targettagseditor.val());
        e.preventDefault();
        jQuery.fn.zoomBox.open(dzsap_settings.thepath + 'admin/tagseditor/popup.php?initer=' + extra_targettagseditor.val(), 'iframe', {
          width: 400,
          height: 800
        });
        return false;
      });
    }
  });

  jQuery('.btn-playlistseditor').each(function () {
    var _t = jQuery(this);
    if (_t.hasClass('inited')) {

    } else {
      _t.addClass('inited');
      _t.bind('click', function (e) {
        var _tt = jQuery(this);

        extra_targetplaylistseditor = _tt.prev();
        //console.log(_tt.prev(), extra_targettagseditor.val());
        e.preventDefault();
        jQuery.fn.zoomBox.open(dzsap_settings.thepath + 'admin/playlistseditor/popup.php?initer=' + extra_targetplaylistseditor.val(), 'iframe', {
          width: 400,
          height: 800
        });
        return false;
      });
    }
  });
  //console.log('cva');
  extra_skin_hiddenselect();
}

function sliders_click_addslider() {

  if (dzsap_settings.is_safebinding == 'on') {

  } else {
    sliders_addslider();
    return false;
  }
}

function sliders_addslider(args) {
  //console.log(jQuery('.main_sliders').children('tbody').children().length);
  //console.log(dzsap_settings)
  var sliderslen = jQuery('.main_sliders').children('tbody').children().length;
  var auxurl = (dzsap_settings.urlcurrslider).replace('_currslider_', sliderslen);
  var auxdelurl = (dzsap_settings.urldelslider).replace('_currslider_', sliderslen);
  var auxname = 'default';


  if (sliderslen == 0) {
    //sliderslen=1;
  }


  if (args != undefined && args.name != undefined) {
    auxname = args.name;
  }

  if(auxname=='default-settings-for-zoomsounds'){
    auxname = '<span class="legacy-sliders--default-settings-name">General Settings for Zoomsounds <span class="italic">( default settings )</span></span>';
  }


  var auxs = '<tr class="slider-in-table"><td>' + auxname + '</td><td class="button_view"><strong><a href="' + auxurl + '" class="slider-action slider-edit">Edit</a></strong></td><td class="button_view"><strong><a href="#" class="slider-action slider-embed">Embed</a></strong></td><td class="button_view"><strong><a href="#" class="slider-action slider-sliderexport">Export</a></strong></td>';


  if (dzsap_settings.is_safebinding == 'on') {
    auxs += '<td class="button_view"><form method="POST" class="slider-duplicate-form"><input type="hidden" name="action" value="';

    if (pagenow == 'zoomsounds_page_dzsap_configs') {

      auxs += 'dzsap_duplicate_dzsap_configs';
    }
    if (pagenow == 'toplevel_page_dzsap_menu') {

      auxs += 'dzsap_duplicate_dzsap_slider';
    }

    auxs += '"/><input type="hidden" name="slidernr" value="' + sliderslen + '"/><input class="button-secondary" type="submit" value="Duplicate"/></form></td>';
  } else {
    auxs += '<td class="button_view"><strong><a href="#" class="slider-action slider-duplicate">Duplicate</a></strong></td>';
  }

  auxs += '<td class="button_view"><form method="POST" class="slider-delete"><input type="hidden" name="deleteslider" value="' + sliderslen + '"/><input class="button-secondary" type="submit" value="Delete"/></form></td></tr>';


  // console.info('auxs for main sliders - ',auxs);
  jQuery('.main_sliders').children('tbody').append(auxs);

  // return false;

  if (dzsap_settings.is_safebinding == 'on') {
    //console.info(dzsap_settings.currSlider, sliderslen)
    if (dzsap_settings.currSlider == sliderslen) {
      if (jQuery('.master-settings').hasClass("mode_vpconfigs")) {
        jQuery('.master-settings').append(videoplayerconfig);
      } else {
        jQuery('.master-settings').append(sliderstructure);
      }
    }
  } else {
    if (jQuery('.master-settings').hasClass("mode_vpconfigs")) {
      jQuery('.master-settings').append(videoplayerconfig);
    } else {
      jQuery('.master-settings').append(sliderstructure);
    }
  }
  for (i = 0; i < jQuery('.slider-con').eq(sliderIndex).find('.textinput').length; i++) {
    var _cache = jQuery('.slider-con').eq(sliderIndex).find('.textinput').eq(i);
    sliders_rename(_cache, sliderIndex, 'settings')
  }
  sliders_addlisteners();
  itemIndex[sliderIndex] = 0;
  ++sliderIndex;

  // return false;
  sliders_reinit();
  return false;

}

function sliders_additem(arg1, arg2, arg3) {
  var j = 0;
  // -- arg1 the slider index
  var _cache = jQuery('.items-con').eq(arg1);

  // -- we do not have itemstructure

  if (window.itemstructure) {

    _cache.append(window.itemstructure);
  }
  for (i = 0; i < _cache.children().last().find('.textinput').length; i++) {
    sliders_rename(_cache.children().last().find('.textinput').eq(i), arg1, itemIndex[arg1]);
  }
  if (arg2 != undefined) {
    _cache.children().last().find('.textinput').eq(0).val(arg2)
    _cache.children().last().find('.textinput').eq(0).trigger('change');
  }
  if (arg3 != undefined) {
    if (arg3.title != undefined) {
      _cache.children().last().find('.textinput').eq(3).val(arg3.title)
      _cache.children().last().find('.textinput').eq(3).trigger('change');
    }
    if (arg3.thumb != undefined) {
      _cache.children().last().find('.textinput').eq(1).val(arg3.thumb)
      _cache.children().last().find('.textinput').eq(1).trigger('change');
    }
    if (arg3.type != undefined) {
      var _c = _cache.children().last().find('.textinput').eq(2);
      _c.find(':selected').attr('selected', '');

      for (j = 0; j < _c.children().length; j++) {
        if (_c.children().eq(j).text() == arg3.type)
          _c.children().eq(j).attr('selected', 'selected');
      }
      // console.log(_c);
      _c.trigger('change');
    }
  }

  itemIndex[arg1]++;
  global_items++;

  return false;
}

function check_global_items() {
  var limit = 15;

  if (dzsap_settings.is_safebinding == 'on') {
    limit = 75;
  }
  //console.log(global_items)
  if (global_items > limit) {
    jQuery('.notes').append('<div class="warning"><strong>Warning</strong> - you have many items in this database. max_input_vars is defaulted to 1000. What this means is if you have more then ' + limit + ' items across all the galleries in this database, saving via the <strong>Save All Sliders</strong> option might not work. and there are three possible solutions to this:</p>        <ol>  <li>( recommended ) distribute your galleries accross multiple databases - <a href="https://digitalzoomstudio.net/docs/wpvideogallery/#explaination_dbs">see how</a>           <li>OR increase max_input_vars via php.ini or .htaccess file       <li>OR use the <strong>save slider</strong> ( single ) option - you can only save the current slider you are editing with this                </ol>        <p>Also remember to backup regularly via the Export option from the Gear menu</p></div>')
  }
}

function sliders_showslider(arg1) {
  //console.log(arg1, currSlider_nr);
  if (arg1 == currSlider_nr) {
    return;
  }
  jQuery('.slider-con').eq(currSlider_nr).fadeOut('fast');
  jQuery('.slider-con').eq(arg1).fadeIn('fast');
  currSlider_nr = arg1;
  currSlider = jQuery('.slider-con').eq(currSlider_nr);
  jQuery('.slider-con').removeClass('currSlider');
  currSlider.addClass('currSlider');
}

function click_additem() {


  sliders_additem(currSlider_nr)
  sliders_addlisteners();

  return false;
}

function sliders_change_mainid() {
  var _t = jQuery(this);
  var index = jQuery('.main-id').index(_t);
  if (dzsap_settings.is_safebinding != 'on') {
    jQuery('.main_sliders tbody').children().eq(index).children().eq(0).text(_t.val());
  }
}

function sliders_change_mainthumb() {
  var _t = jQuery(this);
  var _con = _t.parent().parent().parent();

  if (_con.hasClass('item-con') === false) {
    return;
  }

  // === preview image magic
  _con.find('.item-preview').css('background-image', "url(" + _t.val() + ")");
}

function sliders_change(arg1, argType, argLabel, arg4, pargs) {
  // -- called from the page html
  // -- select the main slider
  // -- @arg1 only helps in dynamic mode

  var margs = {
    'call_from': 'default'
  }

  if (pargs && typeof pargs != 'undefined') {
    margs = jQuery.extend(margs, pargs);
  }
  var _cache = jQuery('.slider-con').eq(arg1);


  // console.info('_cache ( slider-con ) -  ', _cache);
  // console.info('sliders_change() - ', arg1,argType,argLabel,arg4);

  if (argType == "settings") {
    // -- mainsettings
    for (i = 0; i < _cache.find('.mainsetting').length; i++) {

      var _c2 = _cache.find('.mainsetting').eq(i);
      var searchedLabelName = arg1 + "-" + argType + "-" + argLabel;


      // console.warn('_c2 - ',_c2);
      // console.warn('_c2.attr(\'name\') - ',_c2.attr('name'),'searchedLabelName - ',searchedLabelName);
      if (_c2.attr('name') == searchedLabelName) {


        // if(argLabel=='skin_ap' && margs.call_from!='skin_ap_recall'){
        //
        //     console.warn('_c2 skin_ap - ',_c2, arg1,argType,argLabel,arg4);
        //
        //
        //     // -- after init
        //     setTimeout(function(a1,a2,a3,a4){
        //
        //
        //         sliders_change(a1,a2,a3,a4,{
        //             'call_from':'skin_ap_recall'
        //         })
        //     },2000,arg1,argType,argLabel,arg4);
        // }

        _c2.val(arg4);
        if (_c2[0].nodeName == 'SELECT') {
          for (j = 0; j < _c2.children().length; j++) {
            var auxval = _c2.children().eq(j).text();
            if (_c2.children().eq(j).attr('value') != '' && _c2.children().eq(j).attr('value') != undefined) {
              auxval = _c2.children().eq(j).attr('value');
            }
            if (auxval == arg4)
              _c2.children().eq(j).attr('selected', 'selected');
          }
        }
        if (_c2[0].nodeName == 'INPUT' && _c2.attr('type') == 'checkbox') {
          if (arg4 == 'on') {
            _c2.attr('checked', 'checked');
          }
        }
        _c2.change();
      }
    }
  } else {
    var _c2 = _cache.find('.item-con').eq(argType);
    for (var i = 0; i < _c2.find('.textinput').length; i++) {
      var _c3 = _c2.find('.textinput').eq(i);


      var aux = arg1 + "-" + argType + "-" + argLabel;
      if (_c3.attr('name') == aux) {
        _c3.val(arg4);
        if (_c3[0].nodeName == 'SELECT') {
          for (j = 0; j < _c3.children().length; j++) {
            if (_c3.children().eq(j).text() == arg4)
              _c3.children().eq(j).attr('selected', 'selected');
          }
        }
        _c3.change();

      }
    }

  }
}

function sliders_rename(arg1, arg2, arg3, arg4) {
  var name = arg1.attr('name');
  var aname = name.split('-');

  if (arg2 != 'same') {
    if (arg2 == undefined) {
      aname[0] = currSlider_nr;
    } else {
      aname[0] = arg2;
    }
  }
  if (arg3 != 'same') {
    if (arg3 == undefined) {
      aname[1] = itemIndex[currSlider_nr];
    } else {
      aname[1] = arg3;
    }
  }
  var str = aname[0] + '-' + aname[1] + '-' + aname[2];
  arg1.attr('name', str);

}

function item_onsorted() {
  //console.log(currSlider.find('.item-con'))
  for (i = 0; i < currSlider.find('.item-con').length; i++) {
    var _cache = currSlider.find('.item-con').eq(i);
    for (j = 0; j < _cache.find('.textinput').length; j++) {
      var _cache2 = _cache.find('.textinput').eq(j);
      sliders_rename(_cache2, undefined, i);
    }
  }
}

function item_open() {
  var _t = jQuery(this);
  var _itemcon = _t.parent();
  if (dzsap_settings.admin_close_otheritems == 'on') {
    jQuery('.item-con').each(function () {
      var _t2 = jQuery(this);
      //console.log(_t2, _t);
      if (_t2[0] != _itemcon[0] && _t2.hasClass('active')) {
        _t2.removeClass('active');
      }
    });
  }

  if (_itemcon.hasClass('active')) {
    _itemcon.removeClass('active');
  } else {
    _itemcon.addClass('active');
  }
}

function sliders_saveslider() {
  jQuery('#save-ajax-loading').css('visibility', 'visible');
  var mainarray = currSlider.serializeAnything();


  //console.log(currSlider, currSlider.serializeAnything(), currSlider_nr);

  var auxslidernr = currSlider_nr;

  if (dzsap_settings.is_safebinding == 'on') {
    auxslidernr = dzsap_settings.currSlider;
  }

  var data = {
    action: 'dzsap_ajax'
    , postdata: mainarray
    , sliderid: auxslidernr
    , currdb: dzsap_settings.currdb
  };
  jQuery.post(ajaxurl, data, function (response) {
    if (window.console != undefined) {
      console.log('Got this from the server: ' + response);
    }
    jQuery('#save-ajax-loading').css('visibility', 'hidden');
    if (response.indexOf('success') > -1) {
      jQuery('.saveconfirmer').html('Options saved.');
    } else {
      jQuery('.saveconfirmer').html('There seemed to be a problem ? Please check if options were actually saved.');
    }
    jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
  });
  return false;
}

function sliders_saveall() {
  jQuery('#save-ajax-loading').css('visibility', 'visible');
  var mainarray = jQuery('.master-settings').serialize();
  var data = {
    action: 'dzsap_ajax'
    , postdata: mainarray
    , currdb: dzsap_settings.currdb
  };
  jQuery('.saveconfirmer').html('Options saved.');
  jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
  jQuery.post(ajaxurl, data, function (response) {
    if (window.console != undefined) {
      console.log('Got this from the server: ' + response);
    }
    jQuery('#save-ajax-loading').css('visibility', 'hidden');
  });

  return false;
}


function sliders_saveslider_vpc() {
  jQuery('#save-ajax-loading').css('visibility', 'visible');
  var mainarray = currSlider.serializeAnything();

  // -- json encode form -> currSlider.parent().serializeArray()
  // console.log('currSlider - ', currSlider, currSlider.serializeAnything(), currSlider_nr);
  // console.log('currSlider - ', currSlider.serializeArray(), currSlider.parent().serializeArray());

  var auxslidernr = currSlider_nr;

  if (dzsap_settings.is_safebinding == 'on') {
    auxslidernr = dzsap_settings.currSlider;
  }

  var data = {
    action: 'dzsap_save_configs'
    , postdata: mainarray
    , sliderid: auxslidernr
    , currdb: dzsap_settings.currdb
  };
  jQuery.post(ajaxurl, data, function (response) {
    if (window.console != undefined) {
      console.log('Got this from the server: ' + response);
    }
    jQuery('#save-ajax-loading').css('visibility', 'hidden');
    if (response.indexOf('success') > -1) {
      jQuery('.saveconfirmer').html('Options saved.');
    } else {
      jQuery('.saveconfirmer').html('There seemed to be a problem ? Please check if options were actually saved.');
    }
    jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
  });
  return false;
}

function sliders_saveall_vpc() {
  jQuery('#save-ajax-loading').css('visibility', 'visible');
  var mainarray = jQuery('.master-settings').serialize();
  var data = {
    action: 'dzsap_save_vpc'
    , postdata: mainarray
    , currdb: dzsap_settings.currdb
  };
  jQuery('.saveconfirmer').html('Options saved.');
  jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
  jQuery.post(ajaxurl, data, function (response) {
    if (window.console != undefined) {
      console.log('Got this from the server: ' + response);
    }
    jQuery('#save-ajax-loading').css('visibility', 'hidden');
  });

  return false;
}


function global_dzsmultiupload(arg) {
  //console.log(arg);
  sliders_additem(currSlider_nr, window.dzs_upload_path + arg);
}

function sliders_resize() {
  jQuery('.master-settings').height(currSlider.height() + 250)
}


/* @projectDescription jQuery Serialize Anything - Serialize anything (and not just forms!)
 * @author Bramus! (Bram Van Damme)
 * @version 1.0
 * @website: https://www.bram.us/
 * @license : BSD
 */

(function ($) {

  $.fn.serializeAnything = function () {

    var toReturn = [];
    var els = $(this).find(':input').get();

    $.each(els, function () {
      if (this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type))) {
        var val = $(this).val();
        toReturn.push(encodeURIComponent(this.name) + "=" + encodeURIComponent(val));
      }
    });

    return toReturn.join("&").replace(/%20/g, "+");

  }

})(jQuery);




