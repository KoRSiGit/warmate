const dzsapSvgs = require('./_dzsap_svgs');
const dzsHelpers = require('../js_common/_dzs_helpers');

export const dzsap_generate_keyboard_controls = function () {
  var keyboard_controls = {
    'play_trigger_step_back': 'off'
    , 'step_back_amount': '5'
    , 'step_back': '37'
    , 'step_forward': '39'
    , 'sync_players_goto_next': ''
    , 'sync_players_goto_prev': ''
    , 'pause_play': '32'
    , 'show_tooltips': 'off'
  }


  if (window.dzsap_keyboard_controls) {
    // console.log('keyboard_controls - ',keyboard_controls);
    // console.log('window.dzsap_keyboard_controls - ',window.dzsap_keyboard_controls);
    keyboard_controls = jQuery.extend(keyboard_controls, window.dzsap_keyboard_controls);
  }

  keyboard_controls.step_back_amount = Number(keyboard_controls.step_back_amount);
  // for (let lab in keyboard_controls) {
  //   keyboard_controls[lab] = Number(keyboard_controls[lab]);
  // }

  return keyboard_controls;
};


export function formatTime(arg) {
  //formats the time
  var s = Math.round(arg);
  var m = 0;
  var h = 0;
  if (s > 0) {
    while (s > 3599 && s < 3000000 && isFinite(s)) {
      h++;
      s -= 3600;
    }
    while (s > 59 && s < 3000000 && isFinite(s)) {
      m++;
      s -= 60;
    }
    if (h) {

      return String((h < 10 ? "0" : "") + h + ":" + String((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s));
    }
    return String((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s);
  } else {
    return "00:00";
  }
}

export function can_history_api() {
  return !!(window.history && history.pushState);
}

export function dzs_clean_string(arg) {

  if (arg) {

    arg = arg.replace(/[^A-Za-z0-9\-]/g, '');
    //console.log(arg);
    arg = arg.replace(/\./g, '');
    return arg;
  }

  return '';


  //console.log(arg);


}


export function get_query_arg(purl, key) {
  if (purl) {
    // console.log('purl - ',purl);
    if (String(purl).indexOf(key + '=') > -1) {
      //faconsole.log('testtt');
      var regexS = "[?&]" + key + "=.+";
      var regex = new RegExp(regexS);
      var regtest = regex.exec(purl);
      //console.log(regtest);

      if (regtest != null) {
        var splitterS = regtest[0];
        if (splitterS.indexOf('&') > -1) {
          var aux = splitterS.split('&');
          splitterS = aux[1];
        }
        //console.log(splitterS);
        var splitter = splitterS.split('=');
        //console.log(splitter[1]);
        //var tempNr = ;

        return splitter[1];

      }
      //$('.zoombox').eq
    }

  } else {
    console.log('purl not found - ', purl);
  }
}

export function add_query_arg(purl, key, value) {
  // -- key and value must be unescaped for uri
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  if (!(purl)) {
    purl = '';
  }
  var s = purl;
  var pair = key + "=" + value;

  var r = new RegExp("(&|\\?)" + key + "=[^\&]*");

  s = s.replace(r, "$1" + pair);
  //console.log(s, pair);
  if (s.indexOf(key + '=') > -1) {


  } else {
    if (s.indexOf('?') > -1) {
      s += '&' + pair;
    } else {
      s += '?' + pair;
    }
  }
  //if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};


  //if value NaN we remove this field from the url
  if (value === 'NaN') {
    var regex_attr = new RegExp('[\?|\&]' + key + '=' + value);
    s = s.replace(regex_attr, '');


    if (s.indexOf('?') === -1 && s.indexOf('&') > -1) {
      s = s.replace('&', '?');
    }
  }

  return s;
}


export function dzsap_is_mobile() {

  // return true;
  return is_ios() || is_android_good();
}

export function is_ie () {
  return !!window.MSInputMethodContext && !!document.documentMode;
}

export function is_ios() {
  // return true;
  return ((navigator.platform.indexOf("iPhone") !== -1) || (navigator.platform.indexOf("iPod") !== -1) || (navigator.platform.indexOf("iPad") !== -1));
}


export function can_canvas() {
  // check if we have canvas support
  var oCanvas = document.createElement("canvas");
  if (oCanvas.getContext("2d")) {
    return true;
  }
  return false;
}

export function is_safari() {
  return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
}


export function is_android() {
  return is_android_good();
}

export function select_all(el) {
  if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.selection !== "undefined" && typeof document.body.createTextRange !== "undefined") {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.select();
  }
}

export function is_android_good() {
  //return false;
  //return true;
  var ua = navigator.userAgent.toLowerCase();

  //console.log('ua - ',ua);
  return (ua.indexOf("android") > -1);
}

export function htmlEncode(arg) {
  return jQuery('<div/>').text(arg).html();
}

export function dzsap_generate_keyboard_tooltip(keyboard_controls, lab) {


  // console.log('keyboard_controls - ',keyboard_controls,lab,keyboard_controls.lab);
  var structureDzsTooltipCommentAfterSubmit = '<span class="dzstooltip color-dark-light talign-start transition-slidein arrow-bottom style-default" style="width: auto;  white-space:nowrap;"><span class="dzstooltip--inner">' + 'Shortcut' + ': ' + keyboard_controls[lab] + '</span></span>';
  // left: 5px;
  structureDzsTooltipCommentAfterSubmit = structureDzsTooltipCommentAfterSubmit.replace('32', 'space');
  structureDzsTooltipCommentAfterSubmit = structureDzsTooltipCommentAfterSubmit.replace('27', 'escape');

  return structureDzsTooltipCommentAfterSubmit;


}


/**
 *
 * @param e
 * @param {number} e.keyCode
 * @param {boolean} e.ctrlKey
 * @returns {boolean}
 */
export function handle_keypresses(e) {

  // -- local .. step back / step forward
  // console.log('handle_keypresses()', {e});

  /**
   *
   * @param {string} checkKeyCode
   * @returns {boolean}
   */
  function isKeyPressed(checkKeyCode) {
    let isKeyPressed = false;
    if (checkKeyCode.indexOf('ctrl+') > -1) {
      if (e.ctrlKey) {
        checkKeyCode = checkKeyCode.replace('ctrl+', '');
        if (e.keyCode === Number(checkKeyCode)) {
          isKeyPressed = true;
        }
      }
    } else {
      if (e.keyCode === Number(checkKeyCode)) {
        isKeyPressed = true;
      }
    }
    return isKeyPressed;
  }

  var $ = jQuery;

  var keyboard_controls = $.extend({}, dzsap_generate_keyboard_controls());
  // console.log('keyboard_controls.pause_play - ',keyboard_controls.pause_play);
  // console.log('keyboard_controls - ',keyboard_controls);

  // console.log('e.keyCode - ',e.keyCode, keyboard_controls);

  if (dzsap_currplayer_focused && dzsap_currplayer_focused.api_pause_media) {

    if (isKeyPressed(keyboard_controls.pause_play)) {
      if ($(dzsap_currplayer_focused).hasClass('comments-writer-active') === false) {
        if ($(dzsap_currplayer_focused).hasClass('is-playing')) {
          dzsap_currplayer_focused.api_pause_media();
        } else {
          dzsap_currplayer_focused.api_play_media();
        }

        if (window.dzsap_mouseover) {
          e.preventDefault();
          return false;
        }
      }
    }


    if (isKeyPressed(keyboard_controls.step_back)) {
      dzsap_currplayer_focused.api_step_back(keyboard_controls.step_back_amount);
    }

    if (isKeyPressed(keyboard_controls.step_forward)) {
      dzsap_currplayer_focused.api_step_forward(keyboard_controls.step_back_amount);
    }

    if (isKeyPressed(keyboard_controls.sync_players_goto_next)) {
      if (dzsap_currplayer_focused && dzsap_currplayer_focused.api_sync_players_goto_next) {
        dzsap_currplayer_focused.api_sync_players_goto_next();
      }
    }


    if (isKeyPressed(keyboard_controls.sync_players_goto_prev)) {
      if (dzsap_currplayer_focused && dzsap_currplayer_focused.api_sync_players_goto_prev) {
        dzsap_currplayer_focused.api_sync_players_goto_prev();
      }
    }


  }
}


export function hexToRgb(hex, palpha) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var str = '';
  if (result) {
    result = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };


    var alpha = 1;

    if (palpha) {
      alpha = palpha;
    }


    str = 'rgba(' + result.r + ',' + result.g + ',' + result.b + ',' + alpha + ')';
  }


  // console.log('hexToRgb ( hex - '+hex+' ) result ', str);

  return str;


}

export function assignHelperFunctionsToJquery ($) {

  $.fn.prependOnce = function (arg, argfind) {
    var _t = $(this) // It's your element


    //        console.log(argfind);
    if (typeof (argfind) === 'undefined') {
      var regex = new RegExp('class="(.*?)"');
      var auxarr = regex.exec(arg);


      if (typeof auxarr[1] !== 'undefined') {
        argfind = '.' + auxarr[1];
      }
    }


    // we compromise chaining for returning the success
    if (_t.children(argfind).length < 1) {
      _t.prepend(arg);
      return true;
    } else {
      return false;
    }
  };
  $.fn.appendOnce = function (arg, argfind) {
    var _t = $(this) // It's your element


    if (typeof (argfind) === 'undefined') {
      var regex = new RegExp('class="(.*?)"');
      var auxarr = regex.exec(arg);


      if (typeof auxarr[1] !== 'undefined') {
        argfind = '.' + auxarr[1];
      }
    }
    // we compromise chaining for returning the success
    if (_t.children(argfind).length < 1) {
      _t.append(arg);
      return true;
    } else {
      return false;
    }
  };
}


export function registerTextWidth ($) {

  $.fn.textWidth = function () {
    var _t = jQuery(this);
    var html_org = _t.html();
    if (_t[0].nodeName === 'INPUT') {
      html_org = _t.val();
    }
    var html_calcS = '<span class="forcalc">' + html_org + '</span>';
    jQuery('body').append(html_calcS);
    var _lastspan = jQuery('span.forcalc').last();
    //console.log(_lastspan, html_calc);
    _lastspan.css({
      'font-size': _t.css('font-size'),
      'font-family': _t.css('font-family')
    })
    var width = _lastspan.width();
    //_t.html(html_org);
    _lastspan.remove();
    return width;
  };
}

export function player_checkIfWeShouldShowAComment(selfClass, real_time_curr, real_time_total) {

  var $ = jQuery;
  var timer_curr_perc = Math.round((real_time_curr / real_time_total) * 100) / 100;
  if (selfClass.audioType === 'fake') {
    timer_curr_perc = Math.round((selfClass.timeCurrent / selfClass.timeTotal) * 100) / 100;
  }
  if (selfClass._commentsHolder) {
    selfClass._commentsHolder.children().each(function () {
      var _t = $(this);
      if (_t.hasClass('dzstooltip-con')) {
        var _t_posx = _t.offset().left - selfClass._commentsHolder.offset().left;


        var aux = Math.round((parseFloat(_t_posx) / selfClass._commentsHolder.outerWidth()) * 100) / 100;


        if (aux) {

          if (Math.abs(aux - timer_curr_perc) < 0.02) {
            selfClass._commentsHolder.find('.dzstooltip').removeClass('active');
            _t.find('.dzstooltip').addClass('active');
          } else {
            _t.find('.dzstooltip').removeClass('active');
          }
        }
      }
    })
  }
}


/**
 * return object with properties from DOM element
 * @param _sourceForChange
 * @returns {{}|*}
 */
export function sanitizeObjectForChangeMediaArgs(_sourceForChange) {

  var changeMediaArgs = {};
  var _feed_fakePlayer = _sourceForChange;

  var lab = '';

  if (_sourceForChange.data('original-settings')) {
    return _sourceForChange.data('original-settings');
  }

  // -- settle source
  changeMediaArgs.source = null;
  if (_feed_fakePlayer.attr('data-source')) {
    changeMediaArgs.source = _feed_fakePlayer.attr('data-source')
  } else {
    // -- if it is a inline link
    if (_feed_fakePlayer.attr('href')) {
      changeMediaArgs.source = _feed_fakePlayer.attr('href');
    }
  }

  if (_feed_fakePlayer.attr('data-pcm')) {
    changeMediaArgs.pcm = _feed_fakePlayer.attr('data-pcm');
  }


  lab = 'thumb';
  if (_feed_fakePlayer.attr('data-' + lab)) {
    changeMediaArgs[lab] = _sourceForChange.attr('data-' + lab);
  }

  lab = 'playerid';
  if (_feed_fakePlayer.attr('data-' + lab)) {
    changeMediaArgs[lab] = _sourceForChange.attr('data-' + lab);
  }
  lab = 'type';
  if (_feed_fakePlayer.attr('data-' + lab)) {
    changeMediaArgs[lab] = _sourceForChange.attr('data-' + lab);
  }


  if (_feed_fakePlayer.attr('data-thumb_link')) {
    changeMediaArgs.thumb_link = _sourceForChange.attr('data-thumb_link');
  }


  if (_sourceForChange.find('.meta-artist').length > 0 || _sourceForChange.find('.meta-artist-con').length > 0) {

    changeMediaArgs.artist = _sourceForChange.find('.the-artist').eq(0).html();
    changeMediaArgs.song_name = _sourceForChange.find('.the-name').eq(0).html();
  }


  if (_sourceForChange.attr('data-thumb_for_parent')) {
    changeMediaArgs.thumb = _sourceForChange.attr('data-thumb_for_parent');
  }


  if (_sourceForChange.find('.feed-song-name').length > 0 || _sourceForChange.find('.feed-artist-name').length > 0) {

    changeMediaArgs.artist = _sourceForChange.find('.feed-artist-name').eq(0).html();
    changeMediaArgs.song_name = _sourceForChange.find('.feed-song-name').eq(0).html();
  }



  return changeMediaArgs;
}

/**
 *
 * @param {string} colorString
 */
export function utils_sanitizeToColor (colorString) {
  if (colorString.indexOf('#') === -1 && colorString.indexOf('rgb') === -1 && colorString.indexOf('hsl') === -1) {
    return '#' + colorString;
  }
  return colorString;
}

export function dzsapInitjQueryRegisters () {

  window.dzsap_generate_list_for_sync_players = function (pargs) {

    var margs = {
      'force_regenerate': false

    };

    if (pargs) {
      margs = $.extend(margs, pargs);
    }
    window.dzsap_syncList_players = [];

    // console.log('typeof(settings) !== "undefined"  && typeof(settings.construct_player_list_for_sync) !== "undefined"  && settings.construct_player_list_for_sync==\'on\' - ',typeof(settings) !== "undefined"  && typeof(settings.construct_player_list_for_sync) !== "undefined"  && settings.construct_player_list_for_sync=='on', typeof(settings) !== "undefined", typeof(settings.construct_player_list_for_sync), settings.construct_player_list_for_sync=='on');


    if (typeof (settings) !== "undefined" && ((typeof (settings.construct_player_list_for_sync) !== "undefined" && settings.construct_player_list_for_sync === 'on') || margs.force_regenerate)) {

      jQuery('.audioplayer,.audioplayer-tobe').each(function () {
        var _t2 = jQuery(this);
        if (_t2.attr('data-do-not-include-in-list') !== 'on') {
          if (_t2.attr('data-type') !== 'fake' || _t2.attr('data-fakeplayer')) {

            window.dzsap_syncList_players.push(_t2);
          }
        }
      })

      // console.log('dzsap_syncList_players -5 ',dzsap_syncList_players);

    }
  }


  jQuery(document).off('click.dzsap_global');
  jQuery(document).on('click.dzsap_global', '.dzsap-btn-info', function () {

    var _t = jQuery(this);
    if (_t.hasClass('dzsap-btn-info')) {

      _t.find('.dzstooltip').toggleClass('active');

    }

  })
  jQuery(document).on('mouseover.dzsap_global', '.dzsap-btn-info', function () {

    var _t = jQuery(this);
    if (_t.hasClass('dzsap-btn-info')) {
      // console.log(_t.offset().left);
      if (window.innerWidth < 500) {
        // -- if we are in the left side of the screen, we move the tooltip to the right.
        if (_t.offset().left < (window.innerWidth / 2)) {
          _t.find('.dzstooltip').removeClass('talign-end').addClass('talign-start');
        }
      } else {
        _t.find('.dzstooltip').addClass('talign-end').removeClass('talign-start');
      }
    }

  });
}
export function player_radio_isNameUpdatable (selfClass, radio_update_song_name, targetKey) {

  if (selfClass._metaArtistCon.find(targetKey).length && selfClass._metaArtistCon.find(targetKey).eq(0).text().length > 0) {
    // -- we already have artist name..
    if (selfClass._metaArtistCon.find(targetKey).eq(0).html().indexOf('{{update}}') > -1) {
      return true;
    }
  }


  return false;
}
export function miscFunctions () {


  window.dzsap_send_total_time = function (argtime, argcthis) {


    // console.log('dzsap_send_total_time()',argtime,argcthis);

    var data = {
      action: 'dzsap_send_total_time_for_track'
      , id_track: argcthis.attr('data-playerid')
      , postdata: Math.round(argtime)
    };
    jQuery.post(window.dzsap_ajaxurl, data, function (response) {
    });

  }


  window.dzs_open_social_link = function (arg, argthis) {
    var leftPosition, topPosition;
    var w = 500, h = 500;
    //Allow for borders.
    leftPosition = (window.screen.width / 2) - ((w / 2) + 10);
    //Allow for title and status bars.
    topPosition = (window.screen.height / 2) - ((h / 2) + 50);
    var windowFeatures = "status=no,height=" + h + ",width=" + w + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";


    // console.log('dzs_open_social_link()', arg, 'argthis - ', argthis);


    arg = arg.replace('{{replacewithcurrurl}}', encodeURIComponent(window.location.href));
    // console.log({argthis}, argthis.constructor);
    if (argthis && argthis.attr) {
      arg = arg.replace(/{{replacewithdataurl}}/g, argthis.attr('data-url'));
    }

    var aux = window.location.href;


    var auxa = aux.split('?');

    var cid = '';
    var cid_gallery = '';


    if (argthis) {

    } else {
      if (window.dzsap_currplayer_from_share) {

        argthis = window.dzsap_currplayer_from_share;
      }
    }


    // console.log('window.dzsap_currplayer_from_share -> ', window.dzsap_currplayer_from_share);
    // console.log('argthis -> ', argthis);


    if (argthis) {

      var $ = jQuery;

      if ($(argthis).hasClass('audioplayer')) {
        cid = $(argthis).parent().children().index(argthis);
        cid_gallery = $(argthis).parent().parent().parent().attr('id');
      } else {
        if (jQuery(argthis).parent().parent().attr('data-menu-index')) {

          cid = jQuery(argthis).parent().parent().attr('data-menu-index');
        }
        if (jQuery(argthis).parent().parent().attr('data-gallery-id')) {

          cid_gallery = jQuery(argthis).parent().parent().attr('data-gallery-id');
        }
      }

    }


    var shareurl = encodeURIComponent(auxa[0] + '?fromsharer=on&audiogallery_startitem_' + cid_gallery + '=' + cid + '');
    arg = arg.replace('{{shareurl}}', shareurl);

    // console.log('shareurl -> ', shareurl);

    //console.log(argthis);
    //console.log('arg - ',arg);
    window.open(arg, "sharer", windowFeatures);
  }


  window.dzsap_wp_send_contor_60_secs = function (argcthis, argtitle) {

    var data = {
      video_title: argtitle
      // ,video_analytics_id: argcthis.attr('data-analytics-id')
      , video_analytics_id: argcthis.attr('data-playerid')
      , curr_user: window.dzsap_curr_user
    };
    var theajaxurl = 'index.php?action=ajax_dzsap_submit_contor_60_secs';

    if (window.dzsap_settings.dzsap_site_url) {

      theajaxurl = dzsap_settings.dzsap_site_url + theajaxurl;
    }

    // console.log('dzsap_wp_send_contor_60_secs()',argcthis,argtitle);


    jQuery.ajax({
      type: "POST",
      url: theajaxurl,
      data: data,
      success: function (response) {
        if (typeof window.console != "undefined") {
          // console.log('Ajax - submit view - ' + response);
        }


      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.warn('Got this from the server: ' + arg);
        }

      }
    });
  }


  window.dzsap_init_multisharer = function () {
    // console.log('window.dzsap_init_multisharer()');
    var $ = jQuery;
    setTimeout(function () {
      // console.log("LOAD MULTISHARER");


      // console.log('window.dzsap_multisharer_assets_loaded - ',window.dzsap_multisharer_assets_loaded);
      if (window.dzsap_multisharer_assets_loaded) {

      } else {
        if (window.dzsap_multisharer_assets_loaded !== true && window.loading_multi_sharer !== true) {

          // -- only if settings_php_handler is set


          // - -load script for lightbox
          window.loading_multi_sharer = true;
          var head = document.getElementsByTagName('head')[0];
          var link = document.createElement('link');

          if (window.dzsap_settings && window.dzsap_settings.dzsap_site_url) {

            link.id = 'dzsap-load-multi-sharer';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = add_query_arg(window.dzsap_settings.dzsap_site_url, 'load-lightbox-css', 'on');
            link.media = 'all';
            head.appendChild(link);
          }

          // console.log('script for lightbox - ',add_query_arg(window.dzsap_settings.dzsap_site_url,'load-lightbox-css','on'));

          // console.warn("APPEND MULTISHARER STYLE");

          setTimeout(function () {
            if (window.dzsap_box_main_con === null) {
              $('body').append('<div class="dzsap-main-con skin-default gallery-skin-default transition-slideup "> <div class="overlay-background"></div> <div class="box-mains-con"> <div class="box-main box-main-for-share" style=""> <div class="box-main-media-con transition-target"> <div class="close-btn-con"><span class="close-btn--icon">&times;</span></div> <div class="box-main-media type-inlinecontent" style="width: 530px; height: 280px;"><div class=" real-media" style=""><div class="hidden-content share-content" > <div class="social-networks-con"></div> <div class="share-link-con"></div> <div class="embed-link-con"></div> </div> </div> </div> <div class="box-main-under"></div> </div> </div> </div><!-- end .box-mains-con--> </div>');
              window.dzsap_box_main_con = $('.dzsap-main-con').eq(0);
              // console.log('dzsap_box_main_con - ', window.dzsap_box_main_con);
            }

          }, 1000);


        }
      }

      // -- remove main con function
      $(document).on('click.dzsap_global_sharer', '.dzsap-main-con .close-btn-con,.dzsap-main-con .overlay-background', function () {


        var _c = $('.dzsap-main-con').eq(0);

        _c.removeClass('loading-item loaded-item');
      })

    }, 2000)
  }


  window.dzsap_submit_like = function (argp, e) {
    //only handles ajax call + result
    var mainarg = argp;
    var data = {
      action: 'dzsap_submit_like',
      playerid: argp
    };

    var _t = null;

    if (e) {
      _t = jQuery(e.currentTarget);
    }


    if (window.dzsap_settings && window.dzsap_settings.ajax_url) {

      jQuery.ajax({
        type: "POST",
        url: window.dzsap_settings.ajax_url,
        data: data,
        success: function (response) {
          if (typeof window.console != "undefined") {
            console.log('Got this from the server: ' + response);
          }


          if (_t) {

            var htmlaux = _t.html();

            _t.html(htmlaux.replace('fa-heart-o', 'fa-heart'));
          }

        },
        error: function (arg) {
          if (typeof window.console != "undefined") {
            // console.log('Got this from the server: ' + arg, arg);
          }

        }
      });
    }
  }


  window.dzsap_retract_like = function (argp, e) {
    //only handles ajax call + result
    var mainarg = argp;
    var data = {
      action: 'dzsap_retract_like',
      playerid: argp
    };

    var _t = null;

    if (e) {
      _t = jQuery(e.currentTarget);
    }


    if (window.dzsap_settings && window.dzsap_settings.ajax_url) {

      jQuery.ajax({
        type: "POST",
        url: window.dzsap_settings.ajax_url,
        data: data,
        success: function (response) {
          if (typeof window.console != "undefined") {
            console.log('Got this from the server: ' + response);
          }


          if (_t) {
            var htmlaux = _t.html();

            _t.html(htmlaux.replace('fa-heart', 'fa-heart-o'));
          }

        },
        error: function (arg) {
          if (typeof window.console != "undefined") {
            // console.log('Got this from the server: ' + arg, arg);
          }

        }
      });
    }
  }

}

export function jQueryAuxBindings ($) {

  // console.log('start aux bindings');
  $(document).off('click.dzsap_metas')
  $(document).on('click.dzsap_metas', '.audioplayer-song-changer, .dzsap-wishlist-but', function () {
    var _t = $(this);

    // conso

    if (_t.hasClass('audioplayer-song-changer')) {

      // console.log('.audioplayer-song-changer', _t);
      var _c = $(_t.attr('data-fakeplayer')).eq(0);
      // console.log(_t, _t.attr('data-fakeplayer'), _t.attr('data-target'), _c, _c.get(0));


      if (_c && _c.get(0) && _c.get(0).api_change_media) {

        _c.get(0).api_change_media(_t, {
          'feeder_type': 'button'
          , 'call_from': 'changed audioplayer-song-changer'
        });
      }

      return false;
    }

    if (_t.hasClass('dzsap-wishlist-but')) {


      var data = {
        action: 'dzsap_add_to_wishlist',
        playerid: _t.attr('data-post_id'),
        wishlist_action: 'add',
      };


      if (_t.find('.svg-icon').hasClass('fa-star')) {
        data.wishlist_action = 'remove';
      }


      if (window.dzsap_lasto.settings_php_handler) {
        $.ajax({
          type: "POST",
          url: window.dzsap_lasto.settings_php_handler,
          data: data,
          success: function (response) {
            //if(typeof window.console != "undefined" ){ console.log('Ajax - get - comments - ' + response); }


            if (_t.find('.svg-icon').hasClass('fa-star-o')) {
              _t.find('.svg-icon').eq(0).attr('class', 'svg-icon fa fa-star');
            } else {

              _t.find('.svg-icon').eq(0).attr('class', 'svg-icon fa fa-star-o');
            }

          },
          error: function (arg) {
            if (typeof window.console != "undefined") {
              // console.log('Got this from the server: ' + arg, arg);
            }

          }
        });
      }

      return false;


    }

  })


  $(document).on('click.dzsiconhide', '.sticktobottom-close-con,.sticktobottom-close-con .svg-icon', function () {
    var _t = $(this);

    $('.dzsap-sticktobottom .audioplayer').get(0).api_pause_media();


    console.log('_t sticktobottom-close-con -7', _t);

    var _con = null;

    if (_t.parent().hasClass("dzsap-sticktobottom")) {
      _con = _t.parent();
    }
    if (_t.parent().parent().hasClass("dzsap-sticktobottom")) {
      _con = _t.parent().parent();
    }
    if (_t.parent().parent().parent().hasClass("dzsap-sticktobottom")) {
      _con = _t.parent().parent().parent();
    }

    console.log('_con - ', _con, _con.hasClass('audioplayer-loaded'));

    if (_con.hasClass('audioplayer-loaded')) {

      _con.removeClass('audioplayer-loaded');
      _con.addClass('audioplayer-was-loaded');


    } else {

      _con.addClass('audioplayer-loaded');
      _con.addClass('audioplayer-was-loaded');
    }

    return false;
  })

  $(document).on('click.dzsiconshow', '.dzsap-sticktobottom .icon-show', function () {
    var _t = $(this);


    // _t.parent().parent().addClass('audioplayer-loaded');
    // _t.parent().parent().removeClass('audioplayer-was-loaded');
    //
    // _t.parent().parent().parent().addClass('audioplayer-loaded');
    // _t.parent().parent().parent().removeClass('audioplayer-was-loaded');

    return false;
  })


  if ($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver').length > 0) {
    setInterval(function () {

      //console.log($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver > .audioplayer').eq(0).hasClass('dzsap-loaded'));
      if ($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver  .audioplayer').eq(0).hasClass('dzsap-loaded')) {
        $('.dzsap-sticktobottom-placeholder').eq(0).addClass('active');

        if ($('.dzsap-sticktobottom').hasClass('audioplayer-was-loaded') === false) {

          $('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver').addClass('audioplayer-loaded')
        }
      }
    }, 1000);
  }


  if ($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave').length > 0) {
    setInterval(function () {

      // console.log($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave  .audioplayer'), $('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave  .audioplayer').eq(0).hasClass('dzsap-loaded'));
      if ($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave  .audioplayer').eq(0).hasClass('dzsap-loaded')) {
        $('.dzsap-sticktobottom-placeholder').eq(0).addClass('active');

        if ($('.dzsap-sticktobottom').hasClass('audioplayer-was-loaded') === false) {

          $('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave').addClass('audioplayer-loaded')
        }
      }


    }, 1000);
  }


  $(document).on('click.dzsap_multisharer', '.dzsap-multisharer-but', click_open_embed_ultibox);

  function click_open_embed_ultibox(e, pargs) {

    var margs = {
      'call_from': 'default'


    };

    if (pargs) {
      margs = $.extend(margs, pargs);
    }


    // console.log('click_open_embed_ultibox() this - ', this);

    open_dzsap_lightbox({
      'call_from': 'click_open_embed_ultibox'
      , 'lightbox_open': 'share'
      , 'overwrite_this': this
    });


    return false;
  }


  /**
   * call from player or gallery
   * @param pargs
   */
  function open_dzsap_lightbox(pargs) {

    var margs = {
      'call_from': 'default'
      , 'lightbox_open': 'share'
      , 'overwrite_this': null

    };

    if (pargs) {
      margs = $.extend(margs, pargs);
    }


    // console.log('ceva');

    var $dzsapBoxMainCon = window.dzsap_box_main_con; // -- .dzsap-main-con
    var $playerBut = $(this);

    // console.log('_t - ', _t);

    if (margs.overwrite_this) {
      $playerBut = $(margs.overwrite_this);
    }
    console.log('open_dzsap_lightbox() $dzsapBoxMainCon -> ', $dzsapBoxMainCon, 'margs - ', margs);


    /** might be player, might be gallery */
    var $caller = null;
    if ($playerBut.data('cthis')) {
      $caller = $playerBut.data('cthis');

      // console.log('found cthis in data');
    }

    console.log('$caller - ', $caller);
    if ($caller) {

      window.dzsap_currplayer_from_share = $caller;
    } else {

      console.log('%c could not find this .. maybe we can find it in post_id', 'background-color: #da0000;', $('.audioplayer[data-playerid="' + $playerBut.attr('data-post_id') + '"]'));


      if ($playerBut.attr('data-post_id')) {
        window.dzsap_currplayer_from_share = $('.audioplayer[data-playerid="' + $playerBut.attr('data-post_id') + '"]').eq(0);
        $playerBut.data('cthis', window.dzsap_currplayer_from_share);
      } else {

        if ($playerBut.parent().parent().parent().parent().parent().parent().hasClass('audioplayer')) {
          // console.log("YES");
          window.dzsap_currplayer_from_share = $playerBut.parent().parent().parent().parent().parent().parent();
        }
      }
    }


    var stringSocialNetworksBlock = '';

    if (window.dzsap_social_feed_for_social_networks) {
      stringSocialNetworksBlock = window.dzsap_social_feed_for_social_networks;
    }

    // -- aux is feed from social_feed


    if (window.dzsap_box_main_con) {

      // console.log('window.dzsap_box_main_con - ', window.dzsap_box_main_con);

      window.dzsap_box_main_con.find('.social-networks-con').html(stringSocialNetworksBlock);


      let stringShareLinkBlock = '';
      if (window.dzsap_social_feed_for_share_link) {
        stringShareLinkBlock = window.dzsap_social_feed_for_share_link;
      }


      if (stringShareLinkBlock) {


        // console.log('_t - ',_t);


        var newloc = window.location.href;
        if ($playerBut.attr('data-post-url')) {
          newloc = $playerBut.attr('data-post-url');
        }


        stringShareLinkBlock = stringShareLinkBlock.replace('{{replacewithcurrurl}}', newloc);
        stringShareLinkBlock = stringShareLinkBlock.replace('{{replacewithdataurl}}', newloc);
        window.dzsap_box_main_con.find('.share-link-con').html(stringShareLinkBlock);
      }

      var stringShareboxSocial = '';
      if (window.dzsap_social_feed_for_embed_link) {
        stringShareboxSocial = window.dzsap_social_feed_for_embed_link;
      }

      console.log('dzsap_currplayer_from_share -', dzsap_currplayer_from_share);
      if (window.dzsap_currplayer_from_share && dzsap_currplayer_from_share.data('embed_code')) {

        // console.log('o.embed_code - ', dzsap_currplayer_from_share.data('embed_code'));

        if (stringShareboxSocial) {

          var replace_str = dzsap_currplayer_from_share.data('embed_code');
          // console.log('dzsap_currplayer_from_share -', dzsap_currplayer_from_share);

          if (replace_str.indexOf('&lt;') === -1) {
            replace_str = htmlEntities(replace_str);
          }
          stringShareboxSocial = stringShareboxSocial.replace('{{replacewithembedcode}}', (replace_str));
          $dzsapBoxMainCon.find('.embed-link-con').html(stringShareboxSocial);
        }

      }

      // console.log('_c_mc - ',_c_mc);
      // console.log('o.embed_code - ',o.embed_code);
      // console.log('aux_social - ',aux_social);

      $(document).on('click.dzsap', '.field-for-view', function () {

        console.log("select all test ", this);
        selectText(this);

        // $(this).select();
      });
      $dzsapBoxMainCon.addClass('loading-box-main-' + margs.lightbox_open);
      setTimeout(function () {
        $dzsapBoxMainCon.addClass('loading-item');
      }, 100);

      setTimeout(function () {
        $dzsapBoxMainCon.addClass('loaded-item');
      }, 200);


    } else {
      console.log('warning missing box-main');
    }
  }


  // console.log('init here auxBindings');
  $(document).on('keydown.dzsapkeyup keypress.dzsapkeyup', function (e) {
    // console.log('e - ',e);
    // console.log('dzsap_currplayer_focused - ',dzsap_currplayer_focused);

    handle_keypresses(e);
  })


  $(document).on('keydown blur', '.zoomsounds-search-field', function (e) {

    // console.info(e.currentTarget.value);
    var _t = $(e.currentTarget);

    setTimeout(function () {

      if (_t) {
        var _target = $('.audiogallery').eq(0);
        if (_t.attr('data-target')) {
          _target = $(_t.attr('data-target'));
        }
        if (_target.get(0) && _target.get(0).api_filter) {
          _target.get(0).api_filter('title', _t.val());
        }
      }
    }, 100);

  });


  $(document).on('click', '.dzsap-like-but', function (e) {

    var _t = $(this);


    var playerid = _t.attr('data-post_id');

    if (playerid && playerid != '0') {

    } else {
      if (_t.parent().parent().parent().parent().parent().hasClass('audioplayer')) {

        playerid = _t.parent().parent().parent().parent().parent().attr('data-feed-playerid');
      }
    }
    window.dzsap_submit_like(playerid, e);

    _t.removeClass('dzsap-like-but').addClass('dzsap-retract-like-but');

    return false;
  })

  $(document).on('click', '.dzsap-retract-like-but', function (e) {

    var _t = $(this);
    var playerid = _t.attr('data-post_id');

    if (playerid && playerid != '0') {

    } else {
      if (_t.parent().parent().parent().parent().parent().hasClass('audioplayer')) {

        playerid = _t.parent().parent().parent().parent().parent().attr('data-feed-playerid');
      }
    }


    window.dzsap_retract_like(playerid, e);
    _t.addClass('dzsap-like-but').removeClass('dzsap-retract-like-but');
    return false;
  })


}


export function selectText(arg) {

  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(arg);
    range.select();
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(arg);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
}



export function ajax_submit_views (argp, the_player_id, currIp, data_source, o, $, increment_views, ajax_view_submitted) {

  // console.log('ajax_submit_views()',argp);

  var data = {
    action: 'dzsap_submit_views',
    postdata: 1,
    playerid: the_player_id,
    currip: currIp
  };


  if (cthis.attr('data-playerid-for-views')) {
    data.playerid = cthis.attr('data-playerid-for-views');
  }


  if (data.playerid === '') {
    data.playerid = dzs_clean_string(data_source);
  }

  //                console.log(ajax_view_submitted);


  // -- submit view
  if (o.settings_php_handler) {
    $.ajax({
      type: "POST",
      url: o.settings_php_handler,
      data: data,
      success: function (response) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + response);
        }

        // -- increase number of hits
        var auxnr = cthis.find('.counter-hits .the-number').html();
        auxnr = parseInt(auxnr, 10);
        if (increment_views != 2) {
          auxnr++;
        }
        if (response) {
          if (decode_json(response)) {
            auxnr = decode_json(response)['number'];
          }
        }

        cthis.find('.counter-hits .the-number').html(auxnr);

        ajax_view_submitted = 'on';
      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + arg, arg);
        }



        var auxlikes = cthis.find('.counter-hits .the-number').html();
        auxlikes = parseInt(auxlikes, 10);
        auxlikes++;
        cthis.find('.counter-hits .the-number').html(auxlikes);

        ajax_view_submitted = 'on';
      }
    });
    ajax_view_submitted = 'on';
  }

}

export function view_player_playMiscEffects (selfClass) {

  selfClass.$conPlayPause.addClass('playing');

  if (selfClass.cthis.parent().hasClass('zoomsounds-wrapper-bg-center')) {
    selfClass.cthis.parent().addClass('is-playing');
  }
}
export function view_player_globalDetermineSyncPlayersIndex (selfClass) {

  if (selfClass._sourcePlayer === null && window.dzsap_syncList_players) {
    window.dzsap_syncList_players.forEach(($syncPlayer, index) => {
      if (selfClass.cthis.attr('data-playerid') == $syncPlayer.attr('data-playerid')) {
        window.dzsap_syncList_index = index;
      }
    })
  }
}

export function player_view_addMetaLoaded (selfClass) {

  selfClass.cthis.addClass('meta-loaded');
  selfClass.cthis.removeClass('meta-fake');
  if (selfClass._sourcePlayer) {
    selfClass._sourcePlayer.addClass('meta-loaded');
    selfClass._sourcePlayer.removeClass('meta-fake');
  }
  if (selfClass.$totalTime) {
    // console.log('formatTime(selfClass.timeModel.getVisualTotalTime()) - ', formatTime(selfClass.timeModel.getVisualTotalTime()), selfClass.$mediaNode_.duration);
    selfClass.timeModel.refreshTimes();
    selfClass.$totalTime.html(formatTime(selfClass.timeModel.getVisualTotalTime()));
  }
  if (selfClass._sourcePlayer) {
    selfClass._sourcePlayer.addClass('meta-loaded');
  }
}




export function player_determineActualPlayer(selfClass) {

  var $ = jQuery;
  var $fakePlayer = $(selfClass.cthis.attr('data-fakeplayer'));

  // console.log({$fakePlayer});
  if ($fakePlayer.length === 0) {
    $fakePlayer = $(String(selfClass.cthis.attr('data-fakeplayer')).replace('#', '.'));
    if ($fakePlayer.length) {
      selfClass._actualPlayer = $(String(selfClass.cthis.attr('data-fakeplayer')).replace('#', '.'));
      selfClass.cthis.attr('data-fakeplayer', String(selfClass.cthis.attr('data-fakeplayer')).replace('#', '.'));
    }
  }

  if ($fakePlayer.length === 0) {
    selfClass.cthis.attr('data-fakeplayer', '');
  } else {
    selfClass.cthis.addClass('player-is-feeding is-source-player-for-actual-player');
    if (selfClass.cthis.attr('data-type')) {

      selfClass._actualPlayer = $(selfClass.cthis.attr('data-fakeplayer')).eq(0);
      selfClass.actualDataTypeOfMedia = selfClass.cthis.attr('data-type');
      selfClass.cthis.attr('data-original-type', selfClass.actualDataTypeOfMedia);
    }
  }
}

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function waitForScriptToBeAvailableThenExecute (verifyVar, callbackFn) {
  // console.log('waitForScriptToBeAvailableThenExecute()');
  new Promise((resolve, reject) => {

    var checkInterval = 0;

    function checkIfVarExists() {
      // console.log('window.dzsap_part_starRatings_loaded - ', window.dzsap_part_starRatings_loaded);
      // console.log('verifyVar -', verifyVar);

      if (verifyVar) {

        clearInterval(checkInterval);
        resolve('var exists');
      }
    }

    checkIfVarExists()
    checkInterval = setInterval(checkIfVarExists, 300);

    setTimeout(() => {

      // resolve('timeout');
      reject('timeout');
    }, 5000);

  }).then((resolve => {
    callbackFn(resolve);
  })).catch((err) => {
    // console.log(err);


    // callbackFn('error');
  })
}
/**
 *
 * @param cthis
 * @param o
 * @param {DzsAudioPlayer} selfClass
 */
export function configureAudioPlayerOptionsInitial (cthis, o, selfClass) {


  selfClass.cthis.addClass('preload-method-' + o.preload_method);

  o.wavesurfer_pcm_length = Number(o.wavesurfer_pcm_length);


  o.settings_trigger_resize = parseInt(o.settings_trigger_resize, 10);


  if (isNaN(parseInt(o.design_thumbh, 10)) === false) {
    o.design_thumbh = parseInt(o.design_thumbh, 10);
  }

  if (o.skinwave_wave_mode === '') {
    o.skinwave_wave_mode = 'canvas';
  }
  if (o.skinwave_wave_mode_canvas_normalize === '') {
    o.skinwave_wave_mode_canvas_normalize = 'on';
  }
  if (o.skinwave_wave_mode_canvas_waves_number === '' || isNaN(Number(o.skinwave_wave_mode_canvas_waves_number))) {
    o.skinwave_wave_mode_canvas_waves_number = 3;
  }


  if (o.autoplay === 'on' && o.cue === 'on') {
    o.preload_method = 'auto';
  }

  cthis.addClass(o.extra_classes_player)

  if (o.design_skin === '') {
    o.design_skin = 'skin-default';
  }


  if (selfClass.cthis.find('.feed-dzsap--embed-code').length) {

    selfClass.feedEmbedCode = selfClass.cthis.find('.feed-dzsap--embed-code').eq(0).html();
  } else {
    if (o.embed_code !== '') {
      selfClass.feedEmbedCode = o.embed_code;
    }
  }

  if (this.is_ios()) {
    // todo: ios not playing nice.. with audio context
    if (selfClass.initOptions.skinwave_enableSpectrum === 'on') {
      selfClass.initOptions.skinwave_enableSpectrum = 'off';
    }

  }

  var regexr = / skin-/g;


  if (regexr.test(cthis.attr('class'))) {

  } else {

    cthis.addClass(o.design_skin);
  }


  if (cthis.hasClass('skin-default')) {
    o.design_skin = 'skin-default';
  }
  if (cthis.hasClass('skin-wave')) {
    o.design_skin = 'skin-wave';
  }
  if (cthis.hasClass('skin-justthumbandbutton')) {
    o.design_skin = 'skin-justthumbandbutton';
  }
  if (cthis.hasClass('skin-pro')) {
    o.design_skin = 'skin-pro';
  }
  if (cthis.hasClass('skin-aria')) {
    o.design_skin = 'skin-aria';
  }
  if (cthis.hasClass('skin-silver')) {
    o.design_skin = 'skin-silver';
  }
  if (cthis.hasClass('skin-redlights')) {
    o.design_skin = 'skin-redlights';
  }
  if (cthis.hasClass('skin-steel')) {
    o.design_skin = 'skin-steel';
  }
  if (cthis.hasClass('skin-customcontrols')) {
    o.design_skin = 'skin-customcontrols';
  }


  if (o.design_skin === 'skin-wave') {
    if (o.scrubbar_type === 'auto') {
      o.scrubbar_type = 'wave';
    }
  }
  if (o.scrubbar_type === 'auto') {
    o.scrubbar_type = 'bar';
  }

  if (o.settings_php_handler === 'wpdefault') {
    o.settings_php_handler = window.ajaxurl;
  }
  if (o.action_received_time_total === 'wpdefault') {
    o.action_received_time_total = window.dzsap_send_total_time;
  }
  if (o.action_video_contor_60secs === 'wpdefault') {
    o.action_video_contor_60secs = window.action_video_contor_60secs;
  }


  if (is_ios() || is_android()) {
    o.autoplay = 'off';
    o.disable_volume = 'on';
    if (o.cueMedia === 'off') {
      o.cueMedia = 'on';
    }
    o.cueMedia = 'on';
  }

  if (cthis.attr('data-viewsubmitted') === 'on') {
    selfClass.ajax_view_submitted = 'on';

    // console.log('selfClass.ajax_view_submitted from data-viewsubmitted', cthis);
  }
  if (cthis.attr('data-userstarrating')) {
    selfClass.starrating_alreadyrated = Number(cthis.attr('data-userstarrating'));
  }


  if (cthis.hasClass('skin-minimal')) {
    o.design_skin = 'skin-minimal';
    if (o.disable_volume === 'default') {
      o.disable_volume = 'on';
    }

    if (o.disable_scrub === 'default') {
      o.disable_scrub = 'on';
    }
    o.disable_timer = 'on';
  }
  if (cthis.hasClass('skin-minion')) {
    o.design_skin = 'skin-minion';
    if (o.disable_volume === 'default') {
      o.disable_volume = 'on';
    }

    if (o.disable_scrub === 'default') {
      o.disable_scrub = 'on';
    }

    o.disable_timer = 'on';
  }


  if (o.design_color_bg) {
    o.design_wave_color_bg = o.design_color_bg;
  }


  if (o.design_color_highlight) {
    o.design_wave_color_progress = o.design_color_highlight;
  }


  if (o.design_skin === 'skin-justthumbandbutton') {
    if (o.design_thumbh === 'default') {
      o.design_thumbh = '';
      //                        res_thumbh = true;
    }
    o.disable_timer = 'on';
    o.disable_volume = 'on';

    if (o.design_animateplaypause === 'default') {
      o.design_animateplaypause = 'on';
    }
  }
  if (o.design_skin === 'skin-redlights') {
    o.disable_timer = 'on';
    o.disable_volume = 'off';
    if (o.design_animateplaypause === 'default') {
      o.design_animateplaypause = 'on';
    }

  }
  if (o.design_skin === 'skin-steel') {
    if (o.disable_timer === 'default') {

      o.disable_timer = 'off';
    }
    o.disable_volume = 'on';
    if (o.design_animateplaypause === 'default') {
      o.design_animateplaypause = 'on';
    }


    if (o.disable_scrub === 'default') {
      o.disable_scrub = 'on';
    }

  }
  if (o.design_skin === 'skin-customcontrols') {
    if (o.disable_timer === 'default') {

      o.disable_timer = 'on';
    }
    o.disable_volume = 'on';
    if (o.design_animateplaypause === 'default') {
      o.design_animateplaypause = 'on';
    }


    if (o.disable_scrub === 'default') {
      o.disable_scrub = 'on';
    }

  }

  if (o.skinwave_wave_mode_canvas_mode === 'reflecto') {
    o.skinwave_wave_mode_canvas_reflection_size = 0.5;
    // o.skinwave_wave_mode_canvas_waves_number=1;
    // o.skinwave_wave_mode_canvas_waves_padding=0;
  }

  if (o.skinwave_wave_mode_canvas_mode === 'reflecto') {
    o.skinwave_wave_mode_canvas_reflection_size = 0.5;
    // o.skinwave_timer_static='on';
  }


  if (o.embed_code === '') {
    if (cthis.find('div.feed-embed-code').length > 0) {
      o.embed_code = cthis.find('div.feed-embed-code').eq(0).html();
    }
  }

  if (o.design_animateplaypause === 'default') {
    o.design_animateplaypause = 'off';
  }

  if (o.design_animateplaypause === 'on') {
    cthis.addClass('design-animateplaypause');
  }

  if (window.dzsap_settings) {
    if (window.dzsap_settings.php_handler) {
      if (!o.settings_php_handler) {

        o.settings_php_handler = window.dzsap_settings.php_handler;
      }
    }
  }

  if (o.settings_php_handler) {
    selfClass.urlToAjaxHandler = o.settings_php_handler;
  }

  // console.log('selfClass.cthis.attr(\'data-source\') - ', selfClass.cthis.attr('data-source'));
  if (selfClass.cthis.attr('data-source')) {

    if (selfClass.cthis.attr('data-source').indexOf('{{generatenonce}}') > -1) {
      selfClass.initOptions.view_scrubDisabled = 'on';
    }
  }

  if (selfClass.initOptions.view_scrubDisabled === 'on') {
    selfClass.cthis.addClass('view-scrub-disabled');
  }


  player_reinit_findIfPcmNeedsGenerating(selfClass);

}

/**
 *
 * @param {DzsAudioPlayer} selfClass
 */
export function player_reinit_findIfPcmNeedsGenerating(selfClass){
  const o = selfClass.initOptions;

  if (selfClass.cthis.attr('data-pcm')) {
    selfClass.hasInitialPcmData = true;
  }

  if (!selfClass.hasInitialPcmData && o.skinwave_wave_mode === 'canvas' && (o.design_skin === 'skin-wave' || selfClass.cthis.attr('data-fakeplayer'))) {
    selfClass.isPcmRequiredToGenerate = true;
  }
}



export function playerFunctions (selfClass, functionType) {
  var o = selfClass.initOptions;

  if (functionType === 'detectIds') {

    // console.log('playerFunctions()', functionType);
    if (o.skinwave_comments_playerid === '') {
      if (typeof (selfClass.cthis.attr('id')) !== 'undefined') {
        selfClass.the_player_id = selfClass.cthis.attr('id');
      }
    }


    if (selfClass.the_player_id == '') {

      if (selfClass.cthis.attr('data-computed-playerid')) {
        selfClass.the_player_id = selfClass.cthis.attr('data-computed-playerid');
      }
      if (selfClass.cthis.attr('data-real-playerid')) {
        selfClass.the_player_id = selfClass.cthis.attr('data-real-playerid');
      }
    }
    selfClass.uniqueId = selfClass.the_player_id;
    selfClass.identifier_pcm = selfClass.uniqueId;

    // -- needs a real player id
    if (selfClass.the_player_id === '') {
      o.skinwave_comments_enable = 'off';
    }
    // console.log('o.skinwave_comments_enable - ', o.skinwave_comments_enable, o.skinwave_comments_playerid);
  }
}
export function player_delete (selfClass) {

  var _con = null;
  if (selfClass.cthis.parent().parent().hasClass('dzsap-sticktobottom')) {
    _con = selfClass.cthis.parent().parent();
  }
  if (_con) {
    if (_con.prev().hasClass("dzsap-sticktobottom-placeholder")) {
      _con.prev().remove();
    }
    _con.remove();
  }
  selfClass.cthis.remove();
  return false;
}
export function player_viewApplySkinWaveModes (selfClass) {


  var o = selfClass.initOptions;

  selfClass.cthis.removeClass('skin-wave-mode-normal');

  if (o.design_skin === 'skin-wave') {
    selfClass.cthis.addClass('skin-wave-mode-' + selfClass.skinwave_mode);


    selfClass.cthis.addClass('skin-wave-wave-mode-' + o.skinwave_wave_mode);
    if (o.skinwave_enableSpectrum === 'on') {
      selfClass.cthis.addClass('skin-wave-is-spectrum');
    }
    selfClass.cthis.addClass('skin-wave-wave-mode-canvas-mode-' + o.skinwave_wave_mode_canvas_mode);
  }


}

/**
 *
 * @param hexcolor
 * @returns {string}
 */
export function sanitizeToHexColor (hexcolor) {
  if (hexcolor.indexOf('#') === -1) {
    hexcolor = '#' + hexcolor;
  }
  return hexcolor;
}
export function player_identifySource (selfClass) {

  selfClass.data_source = selfClass.cthis.attr('data-source') || '';
}
export function player_identifyTypes (selfClass) {


  var o = selfClass.initOptions;
  const cthis = selfClass.cthis;
  if (cthis.attr('data-type') === 'youtube') {
    o.type = 'youtube';
    selfClass.audioType = 'youtube';
  }
  if (cthis.attr('data-type') === 'soundcloud') {
    o.type = 'soundcloud';
    selfClass.audioType = 'soundcloud';

    o.skinwave_enableSpectrum = 'off';
    cthis.removeClass('skin-wave-is-spectrum');
  }
  if (cthis.attr('data-type') === 'mediafile') {
    o.type = 'audio';
    selfClass.audioType = 'audio';
  }
  // todo: move shoutcast
  if (cthis.attr('data-type') === 'shoutcast') {
    o.type = 'shoutcast';
    selfClass.audioType = 'audio';
    o.disable_timer = 'on';
    o.skinwave_enableSpectrum = 'off';
    // -- might still use it for skin-wave

    if (o.design_skin === 'skin-default') {
      o.disable_scrub = 'on';
    }
    //                    o.disable_scrub = 'on';
  }


  if (selfClass.audioType === 'audio' || selfClass.audioType === 'normal' || selfClass.audioType === '') {
    selfClass.audioType = 'selfHosted';
  }


  if (String(selfClass.data_source).indexOf('https://soundcloud.com/') > -1) {
    selfClass.audioType = 'soundcloud';
  }
}
export function player_adjustIdentifiers (selfClass) {

  selfClass.identifier_pcm = selfClass.the_player_id; // -- the pcm identifier to send via ajax


  var _feed_obj = null;

  if (selfClass.$feed_fakeButton) {
    _feed_obj = selfClass.$feed_fakeButton;
  } else {
    if (selfClass._sourcePlayer) {
      _feed_obj = selfClass._sourcePlayer;
    } else {
      _feed_obj = null;
    }
  }


  if (selfClass.identifier_pcm === 'dzs_footer') {
    selfClass.identifier_pcm = dzs_clean_string(selfClass.cthis.attr('data-source'));
  }

  if (_feed_obj) {
    if (_feed_obj.attr('data-playerid')) {
      selfClass.identifier_pcm = _feed_obj.attr('data-playerid');
    } else {
      if (_feed_obj.attr('data-source')) {
        selfClass.identifier_pcm = _feed_obj.attr('data-source');
      }
    }
  }


}
/**
 * get the playFrom
 * @param selfClass
 */
export function player_getPlayFromTime (selfClass) {

  selfClass.playFrom = selfClass.initOptions.playfrom;

  if (dzsHelpers.isValid(selfClass.cthis.attr('data-playfrom'))) {
    selfClass.playFrom = selfClass.cthis.attr('data-playfrom');
  }

  if (isNaN(parseInt(selfClass.playFrom, 10)) === false) {
    selfClass.playFrom = parseInt(selfClass.playFrom, 10);
  }


  if (selfClass.playFrom === 'off' || selfClass.playFrom === '') {
    if (this.get_query_arg(window.location.href, 'audio_time')) {
      selfClass.playFrom = this.sanitizeToIntFromPointTime(this.get_query_arg(window.location.href, 'audio_time'));
    }
  }

  if (selfClass.timeModel.sampleTimeStart) {
    if (selfClass.playFrom < selfClass.timeModel.sampleTimeStart) {
      selfClass.playFrom = selfClass.timeModel.sampleTimeStart;
    }
    if (typeof selfClass.playFrom === 'string') {
      selfClass.playFrom = selfClass.timeModel.sampleTimeStart;
    }
  }
}


/**
 * from 1:01 to 61
 * @param arg
 * @returns {number}
 */
export function sanitizeToIntFromPointTime (arg) {
  //formats the time


  arg = String(arg).replace('%3A', ':');
  arg = String(arg).replace('#', '');

  if (arg && String(arg).indexOf(':') > -1) {

    var arr = /(\d.*):(\d.*)/g.exec(arg);

    // console.log('result arr -  ',arr);

    var m = parseInt(arr[1], 10);
    var s = parseInt(arr[2], 10);


    return (m * 60) + s;
  } else {
    return Number(arg);
  }
}

export function player_initSpectrum(selfClass) {

  if (window.dzsap_audio_ctx === null) {
    if (typeof AudioContext !== 'undefined') {
      selfClass.spectrum_audioContext = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
      selfClass.spectrum_audioContext = new webkitAudioContext();
    } else {
      selfClass.spectrum_audioContext = null;
    }
    window.dzsap_audio_ctx = selfClass.spectrum_audioContext;
  } else {
    selfClass.spectrum_audioContext = window.dzsap_audio_ctx;
  }


  console.log('selfClass.spectrum_audioContext - ', selfClass.spectrum_audioContext);

  if (selfClass.spectrum_audioContext) {


    // -- normal
    // setup a analyzer
    if (selfClass.spectrum_analyser === null) {

      selfClass.spectrum_analyser = selfClass.spectrum_audioContext.createAnalyser();
      selfClass.spectrum_analyser.smoothingTimeConstant = 0.3;
      selfClass.spectrum_analyser.fftSize = 512;

      console.log('selfClass.spectrum_analyser - ', selfClass.spectrum_analyser);

      // console.log('selfClass.audioType - ', selfClass.audioType);
      if (selfClass.audioType === 'selfHosted') {
        // console.log($mediaNode_);
        // return;
        selfClass.$mediaNode_.crossOrigin = "anonymous";
        selfClass.spectrum_mediaElementSource = selfClass.spectrum_audioContext.createMediaElementSource(selfClass.$mediaNode_);

        selfClass.spectrum_mediaElementSource.connect(selfClass.spectrum_analyser);
        if (selfClass.spectrum_audioContext.createGain) {
          selfClass.spectrum_gainNode = selfClass.spectrum_audioContext.createGain();
        }
        selfClass.spectrum_analyser.connect(selfClass.spectrum_audioContext.destination);

        selfClass.spectrum_gainNode.gain.value = 1;

        var frameCount = selfClass.spectrum_audioContext.sampleRate * 2.0;
        selfClass.spectrum_audioContext_buffer = selfClass.spectrum_audioContext.createBuffer(2, frameCount, selfClass.spectrum_audioContext.sampleRate);
      }
    }
  }
}

export function player_initSpectrumOnUserAction (selfClass) {


  // console.log('player_initSpectrumOnUserAction setting up listeners for player_initSpectrumOnUserAction');
  selfClass.cthis.get(0).addEventListener('mousedown', handleMouseDown, {once: true});
  selfClass.cthis.get(0).addEventListener('touchdown', handleMouseDown, {once: true});

  function handleMouseDown(e) {
    console.log('setting up audio context --', e);


    player_initSpectrum(selfClass);
  }


}


export function player_icecastOrShoutcastRefresh (selfClass) {


  var url = selfClass.cthis.attr('data-source');

  if (selfClass.audioTypeSelfHosted_streamType === 'shoutcast') {
    url = add_query_arg(selfClass.urlToAjaxHandler, 'action', 'dzsap_shoutcast_get_streamtitle');
    url = add_query_arg(url, 'source', (selfClass.data_source));
  }


  jQuery.ajax({
    type: "GET",
    url: url,
    crossDomain: true,
    success: function (response) {

      if (response.documentElement && response.documentElement.innerHTML) {
        response = response.documentElement.innerHTML;
      }

      // console.log(' response - ',response);

      var regex_title = '';
      var regex_creator = '';
      var new_title = '';
      var new_artist = '';

      if (selfClass.audioTypeSelfHosted_streamType === 'icecast') {

        var regex_location = /<location>(.*?)<\/location>/g

        var regexMatches = null;
        if (regexMatches = regex_location.exec(response)) {
          // console.log(' aux - ', aux);

          if (regexMatches[1] !== selfClass.data_source) {
            selfClass.data_source = regexMatches[1];
            selfClass.setup_media({
              'called_from': 'icecast setup'
            });
          }
        }
      }

      if (selfClass.radio_isGoingToUpdateSongName) {
        if (selfClass.audioTypeSelfHosted_streamType === 'icecast') {
          regex_title = /<title>(.*?)<\/title>/g

          if (regexMatches = regex_title.exec(response)) {
            new_title = regexMatches[1];
          }
        }
        if (selfClass.audioTypeSelfHosted_streamType === 'shoutcast') {
          new_title = response;
        }

      }
      if (selfClass.radio_isGoingToUpdateArtistName) {
        if (selfClass.audioTypeSelfHosted_streamType === 'icecast') {

          regex_creator = /<creator>(.*?)<\/creator>/g;

          if (regexMatches = regex_creator.exec(response)) {
            new_artist = regexMatches[1];
          }
        }
        if (selfClass.audioTypeSelfHosted_streamType === 'shoutcast') {
        }
      }

      if (selfClass.radio_isGoingToUpdateSongName) {

        selfClass._metaArtistCon.find('.the-name').html(new_title);
      }
      if (selfClass.radio_isGoingToUpdateArtistName) {

        selfClass._metaArtistCon.find('.the-artist').html(new_artist)
      }
    },
    error: function (err) {
      console.log('error loading icecast - ', err);
    }
  });

}
export function player_determineStickToBottomContainer (selfClass) {

  if (selfClass.cthis.parent().hasClass('dzsap-sticktobottom')) {
    selfClass.$stickToBottomContainer = selfClass.cthis.parent();

  }
  if (selfClass.cthis.parent().parent().hasClass('dzsap-sticktobottom')) {
    selfClass.$stickToBottomContainer = selfClass.cthis.parent().parent();
  }
}
export function player_stickToBottomContainerDetermineClasses (selfClass) {

  if (selfClass.$stickToBottomContainer) {
    if (selfClass.cthis.hasClass('theme-dark')) {
      selfClass.$stickToBottomContainer.addClass('theme-dark');
    }

    setTimeout(function () {

      selfClass.$stickToBottomContainer.addClass('inited');
    }, 500)
    selfClass.$stickToBottomContainer.addClass('dzsap-sticktobottom-for-' + selfClass.initOptions.design_skin);
    selfClass.$stickToBottomContainer.prev().addClass('dzsap-sticktobottom-for-' + selfClass.initOptions.design_skin);

    if (selfClass.initOptions.design_skin === 'skin-wave') {
      selfClass.$stickToBottomContainer.addClass('dzsap-sticktobottom-for-' + selfClass.initOptions.design_skin + '--mode-' + selfClass.skinwave_mode)
      selfClass.$stickToBottomContainer.prev().addClass('dzsap-sticktobottom-for-' + selfClass.initOptions.design_skin + '--mode-' + selfClass.skinwave_mode)
    }


    var regex = /(skinvariation-.*?)($| )/g

    var aux = regex.exec(selfClass.cthis.attr('class'));

    if (aux && aux[1]) {
      selfClass.$stickToBottomContainer.addClass(aux[1]);
      selfClass.$stickToBottomContainer.prev().addClass(aux[1]);
    }
  }

}
export function player_service_getSourceProtection (selfClass) {

  return new Promise((resolve, reject) => {
    // -- generate nonce
    jQuery.ajax({
      type: "POST",
      url: selfClass.data_source,
      data: {},
      success: function (response) {
        resolve(response);
      },
      error: function (err) {
        reject(err);
      }
    });
  })
}
export function player_isGoingToSetupMediaNow (selfClass) {
  return selfClass.audioTypeSelfHosted_streamType !== 'icecast' && selfClass.audioType !== 'youtube';
}
export function player_determineHtmlAreas (selfClass) {

  var o = selfClass.initOptions;


  // console.log('selfClass.cthis.children(\'.feed-dzsap--extra-html\')- ', selfClass.cthis.children('.feed-dzsap--extra-html'));
  let extraHtmlBottom = '';
  let extraHtmlControlsLeft = '';
  let extraHtmlControlsRight = '';

  // console.log('selfClass.cthis.children(\'.feed-dzsap--extra-html\').length - ', selfClass.cthis.children('.feed-dzsap--extra-html').length, selfClass.cthis);
  if (selfClass.cthis.children('.feed-dzsap--extra-html').length > 0 && o.settings_extrahtml === '') {
    selfClass.cthis.children('.feed-dzsap--extra-html').each(function () {

      extraHtmlBottom += jQuery(this).html();
    })
    selfClass.cthis.children('.feed-dzsap--extra-html').remove();
  } else {
    if (o.settings_extrahtml) {
      extraHtmlBottom = o.settings_extrahtml;
    }
  }


  if (selfClass.cthis.children('.feed-dzsap--extra-html-in-controls-left').length > 0) {
    extraHtmlControlsLeft = selfClass.cthis.children('.feed-dzsap--extra-html-in-controls-left').eq(0).html();
  }
  if (selfClass.cthis.children('.feed-dzsap--extra-html-in-controls-right').length > 0) {
    extraHtmlControlsRight = selfClass.cthis.children('.feed-dzsap--extra-html-in-controls-right').eq(0).html();
  }
  if (selfClass.cthis.children('.feed-dzsap--extra-html-bottom').length > 0) {
    extraHtmlBottom = selfClass.cthis.children('.feed-dzsap--extra-html-bottom').eq(0).html();
  }


  selfClass.extraHtmlAreas.controlsLeft = extraHtmlControlsLeft;
  selfClass.extraHtmlAreas.controlsRight = extraHtmlControlsRight;
  selfClass.extraHtmlAreas.bottom = extraHtmlBottom;


  if (selfClass.extraHtmlAreas.controlsRight) {
    selfClass.extraHtmlAreas.controlsRight = String(selfClass.extraHtmlAreas.controlsRight).replace(/{{svg_share_icon}}/g, dzsapSvgs.svg_share_icon);
  }

  // console.log('selfClass.feedEmbedCode - ', selfClass.feedEmbedCode);
  // console.log('selfClass.extraHtmlAreas - ', selfClass.extraHtmlAreas);
  for (var key in selfClass.extraHtmlAreas) {
    // debugger;
    selfClass.extraHtmlAreas[key] = String(selfClass.extraHtmlAreas[key]).replace('{{heart_svg}}', '\t&hearts;');
    selfClass.extraHtmlAreas[key] = String(selfClass.extraHtmlAreas[key]).replace('{{embed_code}}', selfClass.feedEmbedCode);
  }
}

export function player_stopOtherPlayers (dzsap_list, selfClass) {

  var i = 0;
  for (i = 0; i < dzsap_list.length; i++) {
    // -- pause other players
    if (dzsap_list[i].get(0) && dzsap_list[i].get(0).api_pause_media && (dzsap_list[i].get(0) != selfClass.cthis.get(0))) {

      //console.error("LETS PAUSE");
      if (dzsap_list[i].data('type_audio_stop_buffer_on_unfocus') && dzsap_list[i].data('type_audio_stop_buffer_on_unfocus') === 'on') {
        dzsap_list[i].get(0).api_destroy_for_rebuffer();
      } else {
        dzsap_list[i].get(0).api_pause_media({
          'audioapi_setlasttime': false
        });
      }
    }
  }
}



export function player_detect_skinwave_mode() {

  var selfClass = this;


  selfClass.skinwave_mode = selfClass.initOptions.skinwave_mode;

  if (selfClass.cthis.hasClass('skin-wave-mode-small')) {
    selfClass.skinwave_mode = 'small'
  }
  if (selfClass.cthis.hasClass('skin-wave-mode-alternate')) {
    selfClass.skinwave_mode = 'alternate'
  }
  if (selfClass.cthis.hasClass('skin-wave-mode-bigwavo')) {
    selfClass.skinwave_mode = 'bigwavo'
  }
}

export function player_constructArtistAndSongCon (margs) {

  var selfClass = this;

  if (selfClass.cthis.find('.meta-artist').length === 0) {
    if (selfClass.cthis.find('.feed-artist').length || selfClass.cthis.find('.feed-songname').length) {
      var structHtml = '<span class="meta-artist player-artistAndSong">';
      if (selfClass.cthis.find('.feed-artist').length) {
        structHtml += '<span class="the-artist">' + selfClass.cthis.find('.feed-artist').eq(0).html() + '</span>';
      }
      if (selfClass.cthis.find('.feed-songname').length) {
        structHtml += '<span class="the-name player-meta--songname">' + selfClass.cthis.find('.feed-songname').eq(0).html() + '</span>';
      }
      structHtml += '</span>';
      selfClass.cthis.append(structHtml);
    }
  }

  if (selfClass.cthis.attr("data-type") === 'fake') {
    if (selfClass.cthis.find('.meta-artist').length === 0) {
      selfClass.cthis.append('<span class="meta-artist"><span class="the-artist"></span><span class="the-name"></span></span>')
    }
  }

  if (!selfClass._metaArtistCon || margs.call_from === 'reconstruct') {
    // -- reconstruct
    if (selfClass.cthis.children('.meta-artist').length > 0) {
      //console.log(cthis.hasClass('alternate-layout'));
      if (selfClass.cthis.hasClass('skin-wave-mode-alternate')) {
        //console.log(_conControls.children().last());

        if (selfClass._conControls.children().last().hasClass('clear')) {
          selfClass._conControls.children().last().remove();
        }
        selfClass._conControls.append(selfClass.cthis.children('.meta-artist'));
      } else {

        // -- normal
        if (selfClass._audioplayerInner) {

          selfClass._audioplayerInner.append(selfClass.cthis.children('.meta-artist'));
        }
      }

    }


    // -- we need meta-artist at this point
    selfClass._audioplayerInner.find('.meta-artist').eq(0).wrap('<div class="meta-artist-con"></div>');

    //console.log('ceva');

    selfClass._metaArtistCon = selfClass._audioplayerInner.find('.meta-artist-con').eq(0);


    var o = selfClass.initOptions;


    if (selfClass._apControls.find('.ap-controls-right').length > 0) {
      selfClass._apControlsRight = selfClass.cthis.find('.ap-controls-right').eq(0);
    }
    if (selfClass._apControls.find('.ap-controls-left').length > 0) {
      selfClass._apControlsLeft = selfClass._apControls.find('.ap-controls-left').eq(0);
    }


    if (o.design_skin === 'skin-pro') {
      selfClass._apControlsRight = selfClass.cthis.find('.con-controls--right').eq(0)
    }

    if (o.design_skin === 'skin-wave') {


      if (selfClass.cthis.find('.dzsap-repeat-button').length) {
        selfClass.cthis.find('.dzsap-repeat-button').after(selfClass._metaArtistCon);
      } else {


        if (selfClass.cthis.find('.dzsap-loop-button').length && selfClass.cthis.find('.dzsap-loop-button').eq(0).parent().hasClass('feed-dzsap-for-extra-html-right') === false) {
          selfClass.cthis.find('.dzsap-loop-button').after(selfClass._metaArtistCon);
        } else {

          selfClass._conPlayPauseCon.after(selfClass._metaArtistCon);
        }
      }

      if (selfClass.skinwave_mode === 'alternate') {
        selfClass._apControlsRight.before(selfClass._metaArtistCon);
      }


    }
    if (o.design_skin === 'skin-aria') {
      selfClass._apControlsRight.prepend(selfClass._metaArtistCon);

    }
    if (o.design_skin === 'skin-redlights' || o.design_skin === 'skin-steel') {

      selfClass._apControlsRight.prepend(selfClass._metaArtistCon);


    }
    if (o.design_skin === 'skin-silver') {
      selfClass._apControlsRight.append(selfClass._metaArtistCon);
    }
    if (o.design_skin === 'skin-default') {
      selfClass._apControlsRight.before(selfClass._metaArtistCon);
    }


  }


}








export function convertPluginOptionsToFinalOptions (elThis, defaultOptions, argOptions = null, searchedAttr = 'data-options', $es) {

  var finalOptions = null;
  var tempOptions = {};
  var sw_setFromJson = false;

  if ($es === undefined) {
    $es = jQuery;
  }
  // console.log('arguments - ', arguments);
  // console.log('$es - ', $es);
  var $elThis = $es(elThis);

  if (argOptions && typeof argOptions === 'object') {
    tempOptions = argOptions;
  } else {
    if ($elThis.attr(searchedAttr)) {
      try {
        tempOptions = JSON.parse($elThis.attr(searchedAttr));
        sw_setFromJson = true;
      } catch (err) {

        console.log('err - ', err);
      }
    }
    if (!sw_setFromJson) {

      if (typeof argOptions === 'undefined' || !argOptions) {
        if (typeof $elThis.attr(searchedAttr) != 'undefined' && $elThis.attr('data-options') != '') {
          var aux = $elThis.attr(searchedAttr);
          aux = 'var aux_opts = ' + aux;
          eval(aux);
          tempOptions = Object.assign({}, aux_opts);
        }
      }
    }
  }
  finalOptions = Object.assign(defaultOptions, tempOptions);

  return finalOptions;
}

export function generateFakeArrayForPcm () {

  //console.log('generateFakeArray()');
  var maxlen = 256;

  var arr = [];

  for (var it1 = 0; it1 < maxlen; it1++) {
    arr[it1] = Math.random() * 100;

  }

  return arr;
}



export function scrubbar_modeWave_clearObsoleteCanvas(selfClass) {
  if (selfClass._scrubbar) {
    selfClass._scrubbar.find('.scrubbar-type-wave--canvas.transitioning-out').remove();
  }
}


export function scrubbar_modeWave_setupCanvas(pargs, selfClass) {

  var margs = {
    prepare_for_transition_in: false
  }

  if (pargs) {
    margs = Object.assign(margs, pargs);
  }

  // console.trace();

  var struct_scrubBg_str = '';
  var struct_scrubProg_str = '';
  var aux_selector = '';
  var o = selfClass.initOptions;


  struct_scrubBg_str = '<canvas class="scrubbar-type-wave--canvas scrub-bg-img';
  struct_scrubBg_str += '" ></canvas>';

  struct_scrubProg_str = '<canvas class="scrubbar-type-wave--canvas scrub-prog-img';
  struct_scrubProg_str += '" ></canvas>';

  // console.log('scrubbar_modeWave_setupCanvas() selfClass._scrubbar.find(\'.scrub-bg\') - ', selfClass._scrubbar);
  selfClass._scrubbar.find('.scrub-bg').eq(0).append(struct_scrubBg_str);
  selfClass._scrubbar.find('.scrub-prog').eq(0).append(struct_scrubProg_str);


  selfClass._scrubbarbg_canvas = selfClass._scrubbar.find('.scrub-bg-img').last();
  selfClass._scrubbarprog_canvas = selfClass._scrubbar.find('.scrub-prog-img').last();

  if (o.skinwave_enableSpectrum === 'on') {
    selfClass._scrubbarprog_canvas.hide();
  }


  if (margs.prepare_for_transition_in) {
    selfClass._scrubbarbg_canvas.addClass('preparing-transitioning-in');
    selfClass._scrubbarprog_canvas.addClass('preparing-transitioning-in');
    setTimeout(function () {
      selfClass._scrubbarbg_canvas.addClass('transitioning-in');
      selfClass._scrubbarprog_canvas.addClass('transitioning-in');
    }, 20);
  }
}
