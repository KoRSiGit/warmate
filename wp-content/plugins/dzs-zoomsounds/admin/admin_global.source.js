window.waves_fieldtaget = null;
window.waves_filename = null;

window.inter_dzs_check_dependency_settings = 0;


// const a = () => {
//   console.log('lalal 2 why 2 2 2 2 2 2');
// }

// a();

// class bababa{
//   constructor() {
//     console.log('dada 2 2 3 5');
//   }
// }
// var bababa2 = new bababa();

// import DZSDependencyManager from 'inc/_dependency-functionality';
// var $depManager = new DZSDependencyManager();

require("./js_common/_dependency-functionality");
const waveRegenerate = require("./jsinc/_wave_regenerate");
require("./js_common/_query_arg_func");
var dzsapFeedbacker = require('./jsinc/_feedbacker');
var mainoptions = require('./jsinc/_mainoptions');
// var dzsap_admin_helpers = require("./js_common/_helper_admin");
var dzsap_vpconfigs = require("./jsinc/_vpconfigs");
var dzsap_systemCheck_waves_check  = require("./jsinc/_systemCheck_waves_check");

import * as dzsap_admin_helpers from "./js_common/_helper_admin";


jQuery(document).ready(function ($) {
  // console.log('window.get_query_arg -522', window.location, window.get_query_arg(window.location.href, 'post'));
  //return;
  // Create the media frame.
  const main_settings = window.dzsap_settings;
  $(document).delegate('select.vpconfig-select', 'change', change_vpconfig);
  $('.save-mainoptions').bind('click', mo_saveall);


  $(document).on('click', ' .btn-dzsap-create-playlist-for-woo', handle_mouse);

  dzsap_vpconfigs.vpconfigs_init();

  mainoptions.mainoptions_init();
  var _wrap = $('.wrap').eq(0);


  dzsapFeedbacker.feedbacker_init();


  dzsap_admin_helpers.addGutenbergButtons();
  dzsap_admin_helpers.addUploaderButtons();

  waveRegenerate.wave_regenerate_init();

  dzsap_systemCheck_waves_check.systemCheck_waves_check();

  $('.dzs-auto-click-after-1000').each(function () {
    var _t = $(this);
    setTimeout(function () {
      _t.trigger('click');
    }, 1000);
  });


  var nag_intro_tooltip = require('./js_common/_nag_intro_tooltip');

  nag_intro_tooltip.nag_intro_tooltip({...main_settings, prefix: 'dzsap'});



  setTimeout(dzsap_admin_helpers.reskin_select, 10);
  setTimeout(function () {

    $('select.vpconfig-select').trigger('change');
  }, 1000);


  window.dzs_dependency_on_document_ready();


  $(document).on('change.dzsap_get_thumb', '*[name="dzsap_meta_source_attachment_id"]', function () {


    var _t = $(this);

    // console.info('_t -5 ',_t);


    var _con = null;

    if (_t.parent().parent().parent().parent().parent().hasClass('dzstooltip--content')) {
      _con = _t.parent().parent().parent().parent().parent();
    }

    // console.info('_con - 5',_con);


    if (_con) {
      var _c = _con.find('*[name="dzsap_meta_item_thumb"]');
      if (_c) {

        // console.info('_c - 5',_c, _c.val());
        if (_c.val() == '') {

          var data = {
            action: 'dzsap_get_thumb_from_meta'
            , postdata: _t.val()
          };


          var _mainThumb = _c;


          jQuery.ajax({
            type: "POST",
            url: window.ajaxurl,
            data: data,
            success: function (response) {

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

            },
            error: function (arg) {
              if (typeof window.console != "undefined") {
                console.warn('Got this from the server: ' + arg);
              }
              ;
            }
          });
        }
      }
    }

  });
  $(document).on('change.dzsap_global', '.edit_form_line input[name=source], .wrap input[name=source],input[name=playerid]', function () {
    var _t = $(this);


    var sw_show_notice = true;
    // console.info('check if can be linked :D ',isNaN(Number(_t.val())), (Number(_t.val())));

    if (isNaN(Number(_t.val())) && $('input[name=playerid]').eq(0).val() == '') {

    } else {


      sw_show_notice = false;
      // -- why hide player id
      // $('div[data-label="playerid"],*[data-vc-shortcode-param-name="playerid"]').hide();
    }

    var _c = $('*[name="dzsap_meta_source_attachment_id"]').eq(0);
    if (isNaN(Number(_c.val())) && _c.val() == '') {

    } else {


      sw_show_notice = false;
      // -- why hide player id
      // $('div[data-label="playerid"],*[data-vc-shortcode-param-name="playerid"]').hide();
    }


    _c.trigger('change');


    if (sw_show_notice) {

      $('div[data-label="playerid"],*[data-vc-shortcode-param-name="playerid"]').show();
      $('.notice-for-playerid').show();
    } else {

      $('.notice-for-playerid').hide();
    }


  })

  $('input[name=source]').trigger('change');
  setTimeout(function () {

    $('input[name=source]').trigger('change');
  }, 1000);


  $(".with_colorpicker").each(function () {
    var _t = $(this);
    if (_t.hasClass("treated")) {
      return;
    }
    if ($.fn.farbtastic) {
      //console.log(_t);
      _t.next().find(".picker").farbtastic(_t);

    } else {
      if (window.console) {
        console.info("declare farbtastic...");
      }
    }
    ;
    _t.addClass("treated");

    _t.bind("change", function () {
      //console.log(_t);
      jQuery("#customstyle_body").html("body{ background-color:" + $("input[name=color_bg]").val() + "} .dzsportfolio, .dzsportfolio a{ color:" + $("input[name=color_main]").val() + "} .dzsportfolio .portitem:hover .the-title, .dzsportfolio .selector-con .categories .a-category.active { color:" + $("input[name=color_high]").val() + " }");
    });
    _t.trigger("change");
    _t.bind("click", function () {
      if (_t.next().hasClass("picker-con")) {
        _t.next().find(".the-icon").eq(0).trigger("click");
      }
    })
  });


  function handle_mouse(e) {

    var _t = ($(this));

    if (e.type === 'click') {




      if (_t.hasClass('btn-dzsap-create-playlist-for-woo')) {
        // -- btn-dzsap-create-playlist-for-woo


        var term_name = 'zoomsounds-product-playlist-' + _t.attr('data-playerid');
        var data = {
          action: 'dzsap_create_playlist'
          , term_name: term_name
        };

        _t.attr('disabled', true);
        _t.prop('disabled', true);

        _t.addClass('playlist-opened');


        $.ajax({
          type: "POST",
          url: window.ajaxurl,
          data: data,
          success: function (response) {
            if (typeof window.console != "undefined" && window.console.log) {
              console.log('create playlist ... ' + response);
            }

            if (response) {

              $('input[name="dzsap_woo_product_track"]').val(term_name);


              _t.parent().parent().parent().after('<iframe class="dzsap-woo-playlist-iframe" src="' + window.dzsap_settings.admin_url + ('term.php?taxonomy=dzsap_sliders&tag_ID=' + response + '&post_type=dzsap_items&dzs_css=remove_wp_menu') + '" width="100%" height="400"></iframe>')
            }
          },
          error: function (arg) {
            if (typeof window.console != "undefined") {
              console.log('Got this from the server: ' + arg, arg);
            }
            ;
          }
        });


        return false;


      }

    }
  }


  function change_vpconfig() {
    var _t = $(this);

    var _con = null;


    if (_t.parent().hasClass('vpconfig-wrapper')) {

      _con = _t.parent();
    }
    if (_t.parent().parent().hasClass('vpconfig-wrapper')) {

      _con = _t.parent().parent();
    }


    //console.info(_t,_con);


    if (_con) {

      var selopt = _t.children(':selected');

    }

  }





  if (_wrap.hasClass('wrap-for-generator-player')) {
  }
});

dzsap_admin_helpers.reskin_select();



function mo_saveall() {
  jQuery('#save-ajax-loading').css('visibility', 'visible');
  var mainarray = jQuery('.mainsettings').serialize();
  var data = {
    action: 'dzsap_ajax_mo',
    postdata: mainarray
  };

  dzsapFeedbacker.feedbacker_show_message('Options saved.');

  jQuery.post(ajaxurl, data, function (response) {
    if (window.console != undefined) {
      console.log('Got this from the server: ' + response);
    }
    jQuery('#save-ajax-loading').css('visibility', 'hidden');
  });

  return false;
}


