const dzsHelpers = require('../js_common/_dzs_helpers');
import * as dzsapHelpers from './_dzsap_helpers';

export const ajax_submit_views = function (argp) {

  // console.log('ajax_submit_views()',argp);

  // console.log('this - ', this);
  var selfClass = this;
  var $ = jQuery;
  var data = {
    action: 'dzsap_submit_views',
    postdata: 1,
    playerid: selfClass.the_player_id,
    currip: selfClass.currIp
  };


  if (selfClass.cthis.attr('data-playerid-for-views')) {
    data.playerid = selfClass.cthis.attr('data-playerid-for-views');
  }


  if (data.playerid == '') {
    data.playerid = dzsapHelpers.dzs_clean_string(selfClass.data_source);
  }

  //                console.log(ajax_view_submitted);


  // -- submit view
  if (selfClass.urlToAjaxHandler) {
    $.ajax({
      type: "POST",
      url: selfClass.urlToAjaxHandler,
      data: data,
      success: function (response) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + response);
        }

        // -- increase number of hits
        var auxnr = selfClass.cthis.find('.counter-hits .the-number').html();
        auxnr = parseInt(auxnr, 10);
        if (selfClass.increment_views != 2) {
          auxnr++;
        }
        if (response) {
          if (dzsHelpers.decode_json(response)) {
            auxnr = dzsHelpers.decode_json(response)['number'];
          }
        }

        selfClass.cthis.find('.counter-hits .the-number').html(auxnr);

        selfClass.ajax_view_submitted = 'on';
      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + arg, arg);
        }



        var auxlikes = selfClass.cthis.find('.counter-hits .the-number').html();
        auxlikes = parseInt(auxlikes, 10);
        auxlikes++;
        selfClass.cthis.find('.counter-hits .the-number').html(auxlikes);

        selfClass.ajax_view_submitted = 'on';
      }
    });
    selfClass.ajax_view_submitted = 'on';
  }

}


// export const ajax_submit_like = function (argp, playerid, pargs) {

// -- from gallery -- todo:replace with universal form!!

//only handles ajax call + result


// var selfClass = this;
// var $ = jQuery;
//
//
// var mainarg = argp;
// var data = {
//   action: 'dzsap_submit_like',
//   postdata: mainarg,
//   playerid: playerid
// };
//
// var margs = {
//   refferer: null
// }
//
// if (pargs) {
//   margs = $.extend(margs, pargs);
// }
//
// //console.log(margs,pargs,o.settings_php_handler);
//
//
// if (selfClass.urlToAjaxHandler) {
//
//   $.ajax({
//     type: "POST",
//     url: selfClass.urlToAjaxHandler,
//     data: data,
//     success: function (response) {
//       if (typeof window.console != "undefined") {
//         // console.log('Got this from the server: ' + response);
//       }
//
//       if (margs.refferer) {
//         margs.refferer.addClass('active');
//       }
//     },
//     error: function (arg) {
//       if (typeof window.console != "undefined") {
//         // console.log('Got this from the server: ' + arg, arg);
//       }
//       ;
//     }
//   });
// }
// }


export const ajax_submit_like = function (argp) {
  var selfClass = this;
  var $ = jQuery;

  //only handles ajax call + result
  var mainarg = argp;
  var data = {
    action: 'dzsap_submit_like',
    postdata: mainarg,
    playerid: selfClass.the_player_id
  };


  selfClass.cthis.find('.btn-like').addClass('disabled');

  if (selfClass.urlToAjaxHandler || selfClass.cthis.hasClass('is-preview')) {

    $.ajax({
      type: "POST",
      url: selfClass.urlToAjaxHandler,
      data: data,
      success: function (response) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + response);
        }

        selfClass.cthis.find('.btn-like').addClass('active');
        selfClass.cthis.find('.btn-like').removeClass('disabled');
        var auxlikes = selfClass.cthis.find('.counter-likes .the-number').html();
        auxlikes = parseInt(auxlikes, 10);
        auxlikes++;
        selfClass.cthis.find('.counter-likes .the-number').html(auxlikes);
      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + arg, arg);
        }



        selfClass.cthis.find('.btn-like').addClass('active');
        selfClass.cthis.find('.btn-like').removeClass('disabled');
        var auxlikes = selfClass.cthis.find('.counter-likes .the-number').html();
        auxlikes = parseInt(auxlikes, 10);
        auxlikes++;
        selfClass.cthis.find('.counter-likes .the-number').html(auxlikes);
      }
    });
  }
}

export const ajax_retract_like = function (argp) {
  var selfClass = this;
  var $ = jQuery;

  //only handles ajax call + result
  var mainarg = argp;
  var data = {
    action: 'dzsap_retract_like',
    postdata: mainarg,
    playerid: selfClass.the_player_id
  };

  selfClass.cthis.find('.btn-like').addClass('disabled');


  if (selfClass.urlToAjaxHandler) {
    $.ajax({
      type: "POST",
      url: selfClass.urlToAjaxHandler,
      data: data,
      success: function (response) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + response);
        }

        selfClass.cthis.find('.btn-like').removeClass('active');
        selfClass.cthis.find('.btn-like').removeClass('disabled');
        var auxlikes = selfClass.cthis.find('.counter-likes .the-number').html();
        auxlikes = parseInt(auxlikes, 10);
        auxlikes--;
        selfClass.cthis.find('.counter-likes .the-number').html(auxlikes);
      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + arg, arg);
        }


        selfClass.cthis.find('.btn-like').removeClass('active');
        selfClass.cthis.find('.btn-like').removeClass('disabled');
        var auxlikes = selfClass.cthis.find('.counter-likes .the-number').html();
        auxlikes = parseInt(auxlikes, 10);
        auxlikes--;
        selfClass.cthis.find('.counter-likes .the-number').html(auxlikes);
      }
    });
  }
}


export const ajax_comment_publish = function (argp) {
  // -- only handles ajax call + result
  var selfClass = this;
  var $ = jQuery;
  var o = selfClass.initOptions;

  console.log(' o - ', o, selfClass);

  var mainarg = argp;
  var data = {
    action: 'dzsap_front_submitcomment',
    postdata: mainarg,
    playerid: selfClass.the_player_id,
    comm_position: selfClass.commentPositionPerc,
  };

  if (window.dzsap_settings) {
    data.skinwave_comments_avatar = window.dzsap_settings.comments_avatar;
    data.skinwave_comments_account = window.dzsap_settings.comments_username;
  }

  if (selfClass.cthis.find('*[name=comment-email]').length > 0) {
    data.email = selfClass.cthis.find('*[name=comment-email]').eq(0).val();
  }


  if (selfClass.urlToAjaxHandler) {
    jQuery.ajax({
      type: "POST",
      url: selfClass.urlToAjaxHandler,
      data: data,
      success: function (response) {
        if (response.charAt(response.length - 1) == '0') {
          response = response.slice(0, response.length - 1);
        }
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + response);
        }

        //console.log(data.postdata);


        var aux = '';

        // -- process php
        aux = '';
        aux += '<span class="dzstooltip-con" style="left:' + selfClass.commentPositionPerc + '"><span class="dzstooltip arrow-from-start transition-slidein arrow-bottom skin-black" style="width: 250px;"><span class="the-comment-author">@' + window.dzsap_settings.comments_username + '</span> says:<br>';
        aux += dzsapHelpers.htmlEncode(data.postdata);


        aux += '</span><div class="the-avatar" style="background-image: url(' + window.dzsap_settings.comments_avatar + ')"></div></span>';


        // console.log(aux);
        // selfClass._commentsHolder.append(aux);

        selfClass._commentsHolder.children().each(function () {
          var _t2 = $(this);

          if (_t2.hasClass('dzstooltip-con') == false) {
            _t2.addClass('dzstooltip-con');
          }
        })

        selfClass._commentsHolder.append(aux);


        if (selfClass.action_audio_comment) {
          selfClass.action_audio_comment(selfClass.cthis, aux);
        }


        //jQuery('#save-ajax-loading').css('visibility', 'hidden');
      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + arg, arg);
        }

        selfClass._commentsHolder.append(data.postdata);
      }
    });
  }
}


export const ajax_submit_total_time = function (selfClass) {

  if (!selfClass.isSentCacheTotalTime) {
    if (!selfClass.cthis.attr('data-sample_time_total')) {
      if (selfClass.initOptions.action_received_time_total) {
        // console.log('drawTotalTime selfClass.cthis - ', selfClass.cthis);
        selfClass.timeModel.refreshTimes();
        selfClass.initOptions.action_received_time_total(selfClass.timeModel.getVisualTotalTime(), selfClass.cthis);
      }
    }
    selfClass.isSentCacheTotalTime = true;
  }
}


export const ajax_submit_download = function (argp) {
  //only handles ajax call + result
  var mainarg = argp;
  var selfClass = this;
  var data = {
    action: 'dzsap_submit_download',
    postdata: mainarg,
    playerid: selfClass.the_player_id
  };

  if (selfClass.starrating_alreadyrated > -1) {
    return;
  }

  if (selfClass.urlToAjaxHandler) {

    jQuery.ajax({
      type: "POST",
      url: selfClass.urlToAjaxHandler,
      data: data,
      success: function (response) {
        // console.log('Got this from the server: ' + response);


      },
      error: function (arg) {
        // console.log('Got this from the server: ' + arg, arg);


      }
    });
  }
};

