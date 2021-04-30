/*
 * Author: Audio Player with Playlist
 * Website: https://digitalzoomstudio.net/
 * Portfolio: https://bit.ly/nM4R6u
 * Version: 6.00
 * */

import * as dzsapHelpers from './jsinc/_dzsap_helpers';
import * as mediaFunctions from "./jsinc/media/_media_functions";
import {setupMediaElement} from "./jsinc/media/_media_functions";
import {media_changeMedia} from './jsinc/media/_onePlayer_changeMedia';
import {PlayerTime} from './jsinc/_dzsap_time_model';
import {
  ajax_retract_like,
  ajax_submit_download,
  ajax_submit_like,
  ajax_submit_total_time,
  ajax_submit_views
} from "./jsinc/_dzsap_ajax";

import {ConstantsDzsAp} from "./configs/_constants";

const dzsHelpers = require('./js_common/_dzs_helpers');

const dzsapComments = require('./jsinc/components/_comments');
const dzsapSvgs = require('./jsinc/_dzsap_svgs');
const dzsapPlaylist = require('./jsinc/_dzsap_playlist');
const dzsapMisc = require('./jsinc/_dzsap_misc');
const dzsapStructure = require('./jsinc/components/_structure');
const dzsapWaveFunctions = require('./jsinc/wave-render/_wave-render-functions');


window.dzsap_list = []; // -- this is for the players

var dzsap_globalidind = 20;

var isDzsapListForSyncBuilt = false;
var dzsap_list_for_sync_inter_build = 0;

window.loading_multi_sharer = false;

window.dzsap_player_interrupted_by_dzsap = null;
window.dzsap_audio_ctx = null;
window.dzsap__style = null;
window.dzsap_sticktobottom_con = null;

window.dzsap_self_options = {};

window.dzsap_generating_pcm = false;
window.dzsap_box_main_con = null;
window.dzsap_lasto = null;
window.dzsap_syncList_players = []; // -- used for next .. prev .. footer playlist
window.dzsap_syncList_index = 0; // -- used for next .. prev .. footer playlist
window.dzsap_base_url = '';

window.dzsap_player_index = 0; // -- the player index on the page

/**
 * Main player class
 * @class
 * @property {boolean} isAlreadyHasRealPcm
 * @property {boolean} isPcmRequiredToGenerate
 * @property {string} identifier_pcm
 * @property {HTMLElement} $mediaNode_
 * @constructor
 * @public
 */
class DzsAudioPlayer {
  constructor(argThis, argOptions, $) {

    this.argThis = argThis;
    this.argOptions = argOptions;
    this.$ = $;
    this.cthis = null;

    this.ajax_view_submitted = 'auto';
    this.increment_views = 0;
    this.the_player_id = '';
    this.currIp = '127.0.0.1';
    this.index_extrahtml_toloads = 0;
    this.starrating_alreadyrated = -1;
    this.data_source = '';

    this.urlToAjaxHandler = null;


    this.playFrom = '';


    this._actualPlayer = null;
    this._audioplayerInner = null;
    this._metaArtistCon = null;
    this._conControls = null;
    this._conPlayPauseCon = null;
    this._apControls = null;
    this._apControlsLeft = null;
    this._apControlsRight = null;
    this._commentsHolder = null;
    this.$mediaNode_ = null;
    this._scrubbar = null;
    this._scrubbarbg_canvas = null;
    this._scrubbarprog_canvas = null;
    this.$feed_fakeButton = null;
    this._sourcePlayer = null;
    this.$realVisualPlayer = null; // -- real visual player can be _sourcePlayer if this is a fake feed or this if not
    this.$theMedia = null;
    this.$conPlayPause = null; // -- [selector] .con-playpause
    this.$conControls = null;
    this.$$scrubbProg = null;
    this.$controlsVolume = null;
    this.$currTime = null;
    this.$totalTime = null;
    this.$commentsWritter = null;
    this.$commentsChildren = null;
    this.$commentsSelector = null;
    this.$embedButton = null;
    this.$stickToBottomContainer = null;
    /** a reflection object for triggering the player from outside */
    this.$reflectionVisualObject = null;


    this.audioType = 'normal';
    this.audioTypeSelfHosted_streamType = '';
    this.skinwave_mode = 'normal';
    this.action_audio_comment = null; // -- set a outer ended function ( for example for tracking your analytics

    this.commentPositionPerc = 0;// --the % at which the comment will be placed

    this.spectrum_audioContext = null;
    this.spectrum_audioContextBufferSource = null;
    this.spectrum_audioContext_buffer = null;
    this.spectrum_mediaElementSource = null;
    this.spectrum_analyser = null;
    this.spectrum_gainNode = null;

    this.isMultiSharer = false;
    this.hasInitialPcmData = false;

    this.lastArray = null;
    this.last_lastArray = null;

    this.player_playing = false;

    this.actualDataTypeOfMedia = 'audio'; // "audio" or

    this.youtube_retryPlayTimeout = 0;
    this.lastTimeInSeconds = 0;


    // -- pcm
    this.uniqueId = '';
    this.identifier_pcm = ''; // -- can be either player id or source if player id is not set
    this.isAlreadyHasRealPcm = false;
    this.isPcmTryingToGenerate = false;
    this.isPlayPromised = false // -- we are promising generating on meta load
    this.isCanvasFirstDrawn = false // -- the first draw on canvas
    this.isPlayerLoaded = false;

    this.original_real_mp3 = '' // -- this is the original real mp3 for sainvg and identifying in the database

    // -- theme specific
    this.skin_minimal_canvasplay = null;

    this.classFunctionalityInnerPlaylist = null;
    this.feedEmbedCode = '';

    this.youtube_currentId = 0;
    this.youtube_isInited = false;

    this.extraHtmlAreas = {
      bottom: '',
      afterArtist: '',
      controlsLeft: '',
      controlsRight: '',
    }

    // -- time vars
    this.sample_time_start = 0;
    this.sample_time_end = 0;
    this.sample_time_total = 0;
    this.pseudo_sample_time_start = 0
    this.pseudo_sample_time_end = 0
    this.pseudo_sample_time_total = 0
    this.playlist_inner_currNr = 0

    this.timeCurrent = 0; // -- *deprecated
    this.timeModel = new PlayerTime(this);

    this.isSample = false;
    this.isSafeToChangeTrack = false // -- only after 2 seconds of init is it safe to change track
    this.isMediaEnded = false;
    /** is first setuped media */
    this.isSetupedMedia = false;
    this.isSentCacheTotalTime = false;
    this.isPcmRequiredToGenerate = false;
    this.radio_isGoingToUpdateSongName = false;
    this.radio_isGoingToUpdateArtistName = false;


    this.inter_isEnded = 0;


    this.classInit();
  }

  set_sourcePlayer($arg) {
    this._sourcePlayer = $arg;
  }



  reinit_beforeChangeMedia(){
    this.hasInitialPcmData = false;
    this.isPcmRequiredToGenerate = false;
    this.isAlreadyHasRealPcm = false;
    this.cthis.attr('data-pcm','');
  }

  reinit_resetMetrics() {
    this.isPlayerLoaded = false;
  }

  classInit() {
    // console.log('this -> ', this);

    // console.log('process - ', process);

    var $ = this.$;
    var o = this.argOptions;
    var cthis = $(this.argThis);

    var selfClass = this;


    selfClass.cthis = cthis;
    selfClass.initOptions = o;

    var cthisId = 'ap1'
    ;
    var ww, cthisWidth, th // -- controls width
      , scrubbarWidth = 0 // -- scrubbar width
      , scrubbarProgX = 0 // -- scrubbar prog pos
    ;
    var _theThumbCon
      , $scrubBgCanvas = null,
      _scrubBgCanvasCtx = null;
    var isMuted = false,
      destroyed = false,
      google_analytics_sent_play_event = false,
      destroyed_for_rebuffer = false
      , loop_active = false // -- if loop_active the track will loop
      , curr_time_first_set = false
      , isScrubShowingCurrentTime = false
      , setuped_listeners = false
    ;
    var last_time_total = 0
      , currTime_outerWidth = 0
      , player_index_in_gallery = -1 // -- the player index in gallery
    ;


    var volume_lastVolume = 1,
      last_vol_before_mute = 1
    ;
    var inter_checkReady
      , inter_60_secs_contor = 0
      , inter_trigger_resize;
    var data_station_main_url = ''
    ;

    var res_thumbh = false
      , volume_dragging = false
      , volume_set_by_user = false // -- this shows if the user actioned on the volume
      , is_under_400 = false


    ; // resize thumb height


    var skin_minimal_button_size = 0;

    // -- touch controls
    var scrubbar_moving = false
      , scrubbar_moving_x = 0
      , aux3 = 0
    ;


    var dataSrc = '';
    var canvasWidth = 100;
    var canh = 100;
    var scrubbar_h = 75
      , design_thumbh
    ;


    var stringAudioElementHtml = '';


    var defaultVolume = 1;

    var action_audio_end = null
      , action_audio_play = null
      , action_audio_play2 = null
      , action_audio_pause = null


    var isNotRenderingEnterFrame = true
      , sw_spectrum_fakeit = 'auto'
    ;


    var duration_viy = 20;
    var begin_viy = 0;
    var change_viy = 0;


    var draw_canvas_inter = 0;


    // console.log(cthis, o);


    window.dzsap_player_index++;


    selfClass.timeModel.getSampleTimesFromDom();


    init();

    function init() {
      //console.log(typeof(o.parentgallery)=='undefined');


      // console.log('cthis - - on init - ', cthis);


      if (cthis.hasClass('dzsap-inited')) {
        return false;
      }

      selfClass.play_media_visual = play_media_visual;
      selfClass.play_media = play_media;
      selfClass.pause_media = pause_media;
      selfClass.pause_media_visual = pause_media_visual;
      selfClass.seek_to = seek_to;
      selfClass.reinit = reinit;

      selfClass.handle_end = handleMediaEnd;
      selfClass.init_loaded = init_loaded;
      selfClass.scrubbar_reveal = scrubbar_reveal;
      selfClass.calculate_dims_time = calculate_dims_time;
      selfClass.struct_generate_thumb = setupStructure_thumbnailCon;
      selfClass.check_multisharer = check_multisharer;
      selfClass.setup_structure_scrub = setup_structure_scrub;
      selfClass.setup_structure_sanitizers = setup_structure_sanitizers;
      selfClass.destroy_cmedia = destroy_cmedia;
      selfClass.view_drawCurrentTime = view_drawCurrentTime;
      selfClass.setupStructure_thumbnailCon = setupStructure_thumbnailCon;
      selfClass.setup_pcm_random_for_now = view_wave_setupRandomPcm;
      selfClass.handleResize = handleResize;
      selfClass.destroy_media = destroy_media;

      cthis.css({'opacity': ''});
      cthis.addClass('dzsap-inited');
      window.dzsap_player_index++;


      // console.log('cthis - ',cthis,o);

      selfClass.keyboard_controls = dzsapHelpers.dzsap_generate_keyboard_controls();

      dzsapHelpers.configureAudioPlayerOptionsInitial(cthis, o, selfClass);


      (dzsapHelpers.player_detect_skinwave_mode.bind(selfClass))()


      if (o.design_skin === 'skin-default') {
        if (o.design_thumbh === 'default') {
          design_thumbh = cthis.height() - 40;
          res_thumbh = true;
        }
      }


      if (dzsapHelpers.dzsap_is_mobile()) {
        $('body').addClass('is-mobile');
        if (o.mobile_delete === 'on') {
          dzsapHelpers.player_delete(selfClass);
        }
        // -- disable fakeplayer on mobile for some reason
        if (o.mobile_disable_fakeplayer === 'on') {
          selfClass.cthis.attr('data-fakeplayer', '');
        }
      }


      dzsapHelpers.player_viewApplySkinWaveModes(selfClass);

      // console.log(o.design_wave_color_bg, o.design_wave_color_prog); 1


      if (o.design_thumbh === 'default') {
        design_thumbh = 200;
      }


      dzsapHelpers.playerFunctions(selfClass, 'detectIds');

      // console.log('selfClass.the_player_id - ',selfClass.the_player_id);


      if (cthis.attr('data-fakeplayer')) {
        dzsapHelpers.player_determineActualPlayer(selfClass);
      }
      // console.log('selfClass._actualPlayer - ', selfClass._actualPlayer);

      selfClass.cthis.addClass('scrubbar-type-' + o.scrubbar_type);


      dzsapHelpers.player_determineHtmlAreas(selfClass);


      if (o.construct_player_list_for_sync === 'on') {
        if (isDzsapListForSyncBuilt === false) {
          window.dzsap_syncList_players = [];

          isDzsapListForSyncBuilt = true;

          $('.audioplayer.is-single-player,.audioplayer-tobe.is-single-player').each(function () {
            var _t23 = $(this);


            if (_t23.hasClass('dzsap_footer')) {
              return;
            }

            // console.log(_t23);
            if (_t23.attr('data-do-not-include-in-list') !== 'on') {
              window.dzsap_syncList_players.push(_t23);
            }
          })

          // console.log(window.dzsap_syncList_players);

          clearTimeout(dzsap_list_for_sync_inter_build);

          dzsap_list_for_sync_inter_build = setTimeout(function () {
            isDzsapListForSyncBuilt = false;
          }, 500);

        }
      }

      // console.log('window.dzsap_syncList_players - ',window.dzsap_syncList_players);


      dzsapHelpers.player_getPlayFromTime(selfClass);


      dzsapHelpers.player_adjustIdentifiers(selfClass);
      dzsapHelpers.player_identifySource(selfClass);
      dzsapHelpers.player_identifyTypes(selfClass);


      // console.log('init()');
      if (selfClass.audioType === 'youtube') {
        window.dzsap_get_base_url();
        console.log('window.dzsap_base_url- ', window.dzsap_base_url);
        const scriptUrl = window.dzsap_base_url ? window.dzsap_base_url + '/parts/youtube/dzsap-youtube-functions.js' : '';
        dzsHelpers.loadScriptIfItDoesNotExist(scriptUrl, window.dzsap_youtube_functions_inited).then((resolveStr) => {
          dzsap_youtube_functions_init(selfClass);
        });
      }


      selfClass.audioTypeSelfHosted_streamType = '';

      // console.log('type - ',type, cthis.attr('data-streamtype'));


      if (selfClass.audioType === 'selfHosted') {
        if (cthis.attr('data-streamtype') && cthis.attr('data-streamtype') !== 'off') {
          selfClass.audioTypeSelfHosted_streamType = cthis.attr('data-streamtype');
          data_station_main_url = selfClass.data_source;
          cthis.addClass('is-radio-type');
        } else {
          selfClass.audioTypeSelfHosted_streamType = '';
        }
      }

      // -- no shoutcast autoupdate at the moment 2 3 4 5 6 7 8
      if (selfClass.audioTypeSelfHosted_streamType === 'shoutcast') {
        // selfClass.audioTypeSelfHosted_streamType = '';

        // -- todo: we
      }


      // console.log('selfClass.audioTypeSelfHosted_streamType - ', selfClass.audioTypeSelfHosted_streamType, 'cthis.attr(\'data-source\') - ', cthis.attr('data-source'), 'selfClass.audioType - ', selfClass.audioType);


      // -- we disable the function if audioplayer inited
      if (cthis.hasClass('audioplayer')) {
        return;
      }
      //console.log('ceva');

      if (cthis.attr('id') !== undefined) {
        cthisId = cthis.attr('id');
      } else {
        cthisId = 'ap' + dzsap_globalidind++;
      }


      selfClass.youtube_currentId = 'ytplayer_' + cthisId;


      cthis.removeClass('audioplayer-tobe');
      cthis.addClass('audioplayer');

      view_drawScrubProgress();
      setTimeout(function () {
        view_drawScrubProgress()
      }, 1000);


      //===ios does not support volume controls so just let it die
      //====== .. or autoplay FORCE STAFF


      // console.log('o.autoplay here - ',o.autoplay, cthis);  22

      if (o.cueMedia === 'off') {

        // -- cue is forcing autoplay on
        cthis.addClass('cue-off');
        o.autoplay = 'on';
      }

      // console.log('o.autoplay here - ',o.autoplay, cthis);


      //====sound cloud INTEGRATION //
      //console.log(o.type);
      if (selfClass.audioType === 'soundcloud') {
        dzsapMisc.retrieve_soundcloud_url(selfClass);
      }
      // -- END soundcloud INTEGRATION//


      // console.log('init - ', selfClass);
      dzsapStructure.setup_structure(selfClass); //  -- inside init()

      //console.log(cthis, dzsapHelpers.is_ios(), o.type);
      //trying to access the youtube api with ios did not work


      // debugger;
      if (o.scrubbar_type === 'wave' && (selfClass.audioType === 'selfHosted' || selfClass.audioType === 'soundcloud' || selfClass.audioType === 'fake') && o.skinwave_comments_enable === 'on') {
        dzsapComments.comments_setupCommentsInitial(selfClass);
      }

      //console.log();


      if (o.autoplay === 'on' && o.cueMedia === 'on') {
        selfClass.increment_views = 1;
      }


      // -- soundcloud will setupmedia when api done

      // console.log('o.cueMedia -', o.cueMedia, selfClass.audioType);
      if (o.cueMedia === 'on' && selfClass.audioType !== 'soundcloud') {
        if (dzsapHelpers.is_android() || dzsapHelpers.is_ios()) {
          cthis.find('.playbtn').bind('click', play_media);
        }
        // console.log('source - ',cthis.attr('data-source'), dataSrc);


        if (selfClass.data_source && selfClass.data_source.indexOf('{{generatenonce}}') > -1) {

          var original_id = '';

          var aux = /id=(\d*?)/g.exec(selfClass.data_source);

          if (aux && aux[1]) {
            original_id = aux[1];
          }

          dzsapHelpers.player_service_getSourceProtection(selfClass).then((response) => {
            if (response) {
              if (response.indexOf(original_id) > -1) {
                cthis.attr('data-source', response);
                setup_media({'called_from': 'nonce generated', 'newSource': response});
              }
            }

          });
        } else {

          const isGoingToSetupMediaNow = dzsapHelpers.player_isGoingToSetupMediaNow(selfClass);

          if (selfClass.audioType === 'selfHosted') {
            if (selfClass.audioTypeSelfHosted_streamType === 'icecast' || selfClass.audioTypeSelfHosted_streamType === 'shoutcast') {
              // -- if we have icecast we can update currently playing song


              if (selfClass.audioTypeSelfHosted_streamType === 'icecast' || (selfClass.radio_isGoingToUpdateArtistName || selfClass.radio_isGoingToUpdateSongName)) {

                dzsapHelpers.player_icecastOrShoutcastRefresh(selfClass);
              }
              setInterval(function () {
                dzsapHelpers.player_icecastOrShoutcastRefresh(selfClass);
              }, 10000)
            }
          }

          if (isGoingToSetupMediaNow) {
            setup_media({'called_from': 'normal setup media .. --- icecast must wait'});
          }

        }


      } else {


        //console.log(' -- cue is of so set autoplay to on')
        // o.autoplay = 'on';
        cthis.find('.playbtn').bind('click', handleClickForSetupMedia);
        cthis.find('.scrubbar').bind('click', handleClickForSetupMedia);
        handleResize(null, {
          called_from: 'init'
        });
      }


      // -- we call the api functions here
      //console.log('api sets');


      dzsapHelpers.player_determineStickToBottomContainer(selfClass);
      dzsapHelpers.player_stickToBottomContainerDetermineClasses(selfClass);

      // console.log('_sticktobottom -> ',_sticktobottom, cthis,cthis.parent().attr('class'),cthis.parent().parent().attr('class'));

      selfClass.timeModel.initObjects();

      // -- api calls
      selfClass.setup_media = setup_media;

      cthis.get(0).classInstance = selfClass;

      cthis.get(0).api_init_loaded = init_loaded; // -- force resize event
      cthis.get(0).api_destroy = destroy_it; // -- destroy the player and the listeners

      cthis.get(0).api_play = play_media; // -- play the media

      cthis.get(0).api_set_volume = volume_setVolume; // -- set a volume
      cthis.get(0).api_get_last_vol = volume_getLast; // -- play the media

      cthis.get(0).api_get_source = () => {
        return selfClass.data_source;
      }; // -- play the media

      cthis.get(0).api_click_for_setup_media = handleClickForSetupMedia; // -- play the media

      cthis.get(0).api_handleResize = handleResize; // -- force resize event
      cthis.get(0).api_set_playback_speed = set_playback_speed; // -- set the playback speed, only works for local hosted mp3
      cthis.get(0).api_change_media = media_changeMedia(selfClass, $); // -- change the media file from the API
      cthis.get(0).api_seek_to_perc = seek_to_perc; // -- seek to percentage ( for example seek to 0.5 skips to half of the song )
      cthis.get(0).api_seek_to = seek_to; // -- seek to percentage ( for example seek to 0.5 skips to half of the song )
      cthis.get(0).api_seek_to_visual = seek_to_visual; // -- seek to perchange but only visually ( does not actually skip to that ) , good for a fake player
      cthis.get(0).api_visual_set_volume = volume_setOnlyVisual; // -- set a volume
      cthis.get(0).api_destroy_listeners = destroy_listeners; // -- set a volume

      cthis.get(0).api_pause_media = pause_media; // -- pause the media
      cthis.get(0).api_pause_media_visual = pause_media_visual; // -- pause the media, but only visually
      cthis.get(0).api_play_media = play_media; // -- play the media
      cthis.get(0).api_play_media_visual = play_media_visual; // -- play the media, but only visually
      cthis.get(0).api_handle_end = handleMediaEnd; // -- play the media, but only visually
      cthis.get(0).api_change_visual_target = change_visual_target; // -- play the media, but only visually
      cthis.get(0).api_change_design_color_highlight = view_updateColorHighlight; // -- play the media, but only visually
      cthis.get(0).api_draw_scrub_prog = view_drawScrubProgress; // -- render the scrub progress
      cthis.get(0).api_draw_curr_time = view_drawCurrentTime; // -- render the current time
      cthis.get(0).api_get_times = selfClass.timeModel.refreshTimes; // -- refresh the current time
      cthis.get(0).api_check_time = handleEnterFrame; // -- do actions required in the current frame
      cthis.get(0).api_sync_players_goto_next = syncPlayers_gotoNext; // -- in the sync playlist, go to the next song
      cthis.get(0).api_sync_players_goto_prev = syncPlayers_gotoPrev; // -- in the sync playlist, go to the previous song
      cthis.get(0).api_regenerate_playerlist_inner = function () {
        // -- call with window.dzsap_generate_list_for_sync_players({'force_regenerate': true})
        if (selfClass.classFunctionalityInnerPlaylist) {
          selfClass.classFunctionalityInnerPlaylist.playlistInner_setupStructureInPlayer();
        }

      }; // -- regenerate the playlist innter


      cthis.get(0).api_step_back = function (arg) {
        if (!arg) {
          arg = selfClass.keyboard_controls.step_back_amount;
        }
        seek_to(selfClass.timeCurrent - arg);
      }
      cthis.get(0).api_step_forward = function (arg) {

        if (arg) {

        } else {
          arg = selfClass.keyboard_controls.step_back_amount;
        }
        seek_to(selfClass.timeCurrent + arg);
      } // --
      /**
       *
       * @param {number} argSpeed  - 0 to 1
       */
      cthis.get(0).api_playback_speed = function (argSpeed) {
        if (selfClass.$mediaNode_ && selfClass.$mediaNode_.playbackRate) {
          selfClass.$mediaNode_.playbackRate = argSpeed;
        }
      } // -- slow to 2/3 of the current song


      cthis.get(0).api_set_action_audio_play = function (arg) {
        action_audio_play = arg;
      }; // -- set action on audio play
      cthis.get(0).api_set_action_audio_pause = function (arg) {
        action_audio_pause = arg;
      }; // -- set action on audio pause
      cthis.get(0).api_set_action_audio_end = function (arg) {
        action_audio_end = arg;
        cthis.data('has-action-end', 'on');
      }; // -- set action on audio end
      cthis.get(0).api_set_action_audio_comment = function (arg) {
        selfClass.action_audio_comment = arg;
      }; // -- set the function to call on audio song comment
      cthis.get(0).api_try_to_submit_view = service_submitView; // -- try to submit a new play analytic

      //console.log(cthis.get(0));

      //console.log(o);
      if (o.action_audio_play) {
        action_audio_play = o.action_audio_play;
      }

      if (o.action_audio_pause) {
        action_audio_pause = o.action_audio_pause;
      }

      if (o.action_audio_play2) {
        action_audio_play2 = o.action_audio_play2;
      }


      if (o.action_audio_end) {
        action_audio_end = o.action_audio_end;
        cthis.data('has-action-end', 'on');
      }


      handleEnterFrame({
        'fire_only_once': true
      });


      //console.log(o.design_skin);
      if (o.design_skin === 'skin-minimal') {
        handleEnterFrame({
          'fire_only_once': true
        });
      }


      cthis.on('click', '.dzsap-repeat-button,.dzsap-loop-button,.btn-zoomsounds-download,.zoomsounds-btn-step-backward,.zoomsounds-btn-step-forward,.zoomsounds-btn-go-beginning,.zoomsounds-btn-slow-playback,.zoomsounds-btn-reset, .tooltip-indicator--btn-footer-playlist', handle_mouse);
      // cthis.on('mouseover',handle_mouse);
      cthis.on('mouseenter', handle_mouse);
      cthis.on('mouseleave', handle_mouse);


      selfClass.$conPlayPause.on('click', handleClick_playPause);
      //cthis.on('click','.con-playpause', click_playpause);


      cthis.on('click', '.skip-15-sec', function () {
        cthis.get(0).api_step_forward(15);
      });


      $(window).on('resize.dzsap', handleResize);
      handleResize(null, {
        called_from: 'init'
      });

      if (selfClass._scrubbar && selfClass._scrubbar.get(0)) {

        selfClass._scrubbar.get(0).addEventListener('touchstart', function (e) {
          if (selfClass.player_playing) {

            scrubbar_moving = true;
          }
        }, {passive: true})
      }

      // selfClass._scrubbar.on('touchstart', function(e) {
      //     if(selfClass.player_playing){
      //
      //         scrubbar_moving = true;
      //     }
      // }, {passive: true})
      $(document).on('touchmove', function (e) {
        if (scrubbar_moving) {
          scrubbar_moving_x = e.originalEvent.touches[0].pageX;


          aux3 = scrubbar_moving_x - selfClass._scrubbar.offset().left;

          if (aux3 < 0) {
            aux3 = 0;
          }
          if (aux3 > selfClass._scrubbar.width()) {
            aux3 = selfClass._scrubbar.width();
          }

          seek_to_perc(aux3 / selfClass._scrubbar.width(), {
            call_from: "touch move"
          });


          return false;
          //console.log(aux3);


        }
      });

      $(document).on('touchend', function (e) {
        scrubbar_moving = false;
      });


      // console.log('skinwave_comments_mode_outer_selector - ',o.skinwave_comments_mode_outer_selector);

      if (o.skinwave_comments_mode_outer_selector) {
        selfClass.$commentsSelector = $(o.skinwave_comments_mode_outer_selector);

        if (selfClass.$commentsSelector.data) {

          selfClass.$commentsSelector.data('parent', cthis);

          if (window.dzsap_settings && window.dzsap_settings.comments_username) {
            selfClass.$commentsSelector.find('.comment_email,*[name=comment_user]').remove();
          }

          selfClass.$commentsSelector.on('click', '.dzstooltip--close,.comments-btn-submit', dzsapComments.comments_selector_event);
          selfClass.$commentsSelector.on('focusin', 'input', dzsapComments.comments_selector_event);
          selfClass.$commentsSelector.on('focusout', 'input', dzsapComments.comments_selector_event);

        } else {
          console.log('%c, data not available .. ', 'color: #990000;', $(o.skinwave_comments_mode_outer_selector));
        }
      }


      // console.log("hmm",cthis);
      cthis.off('click', '.btn-like');
      cthis.on('click', '.btn-like', handleClickLike);


      dzsapHelpers.waitForScriptToBeAvailableThenExecute(window.dzsap_part_starRatings_loaded, function () {
        window.dzsap_init_starRatings_from_dzsap(selfClass);
      })


      setTimeout(function () {

        handleResize(null, {
          called_from: 'init_timeout'
        });


        if (o.skinwave_wave_mode === 'canvas') {

          calculate_dims_time();

          setTimeout(function () {
            calculate_dims_time();


          }, 100)
        }

      }, 100)


      cthis.find('.btn-menu-state').eq(0).bind('click', handleClickMenuState);


      //console.log('init');


      cthis.on('click', '.prev-btn,.next-btn', handle_mouse);
    }


    function calculate_dims_time() {
      var reflection_size = parseFloat(o.skinwave_wave_mode_canvas_reflection_size);

      reflection_size = 1 - reflection_size;

      var scrubbarh = selfClass._scrubbar.height();
      if (o.design_skin === 'skin-wave') {
        // console.log('selfClass.skinwave_mode - ',selfClass.skinwave_mode);
        if (selfClass.skinwave_mode === 'small') {
          scrubbarh = 60;
        }

        if (selfClass._commentsHolder) {
          if (reflection_size === 0) {
            selfClass._commentsHolder.css('top', selfClass._scrubbar.offset().top - cthis.offset().top + scrubbarh * reflection_size - selfClass._commentsHolder.height());
          } else {
            selfClass._commentsHolder.css('top', selfClass._scrubbar.offset().top - selfClass._scrubbar.parent().offset().top + scrubbarh * reflection_size);
            selfClass.$commentsWritter.css('top', selfClass._scrubbar.offset().top - selfClass._scrubbar.parent().offset().top + scrubbarh * reflection_size);
          }
        }

        if (selfClass.$currTime) {
          selfClass.$currTime.css('top', scrubbarh * reflection_size - selfClass.$currTime.outerHeight());
        }
        if (selfClass.$totalTime) {
          selfClass.$totalTime.css('top', scrubbarh * reflection_size - selfClass.$totalTime.outerHeight());
        }
      }

      cthis.attr('data-reflection-size', reflection_size);
    }

    function change_visual_target(arg, pargs) {
      // -- change the visual target, the main is the main palyer selfClass.player_playing and the visual target is the player which is a visual representation of this

      console.log('change_visual_target() - ', arg);

      var margs = {}


      // return false;


      if (pargs) {
        margs = $.extend(margs, pargs);
      }


      if (selfClass._sourcePlayer && selfClass._sourcePlayer.get(0) && selfClass._sourcePlayer.get(0).api_pause_media_visual) {
        selfClass._sourcePlayer.get(0).api_pause_media_visual({
          'call_from': 'change_visual_target'
        });
      }

      selfClass.set_sourcePlayer(arg);

      // console.log('new selfClass._sourcePlayer -  ', selfClass._sourcePlayer);

      var $sourcePlayer_ = selfClass._sourcePlayer.get(0);
      if (selfClass.player_playing) {
        if (selfClass._sourcePlayer && $sourcePlayer_ && $sourcePlayer_.api_play_media_visual) {
          $sourcePlayer_.api_play_media_visual();
        }
      }

      if ($sourcePlayer_ && $sourcePlayer_.api_draw_curr_time) {


        $sourcePlayer_.api_set_timeVisualCurrent(selfClass.timeCurrent);
        $sourcePlayer_.api_get_times({
          'call_from': ' change visual target .. in api '
        });
        $sourcePlayer_.api_check_time({
          'fire_only_once': true
        });
        $sourcePlayer_.api_draw_curr_time();
        $sourcePlayer_.api_draw_scrub_prog();
      }

      setTimeout(function () {

        // console.log('__c.api_draw_curr_time - ',__c.api_draw_curr_time);
        if ($sourcePlayer_ && $sourcePlayer_.api_draw_curr_time) {
          $sourcePlayer_.api_get_times();
          $sourcePlayer_.api_check_time({
            'fire_only_once': true
          });
          $sourcePlayer_.api_draw_curr_time();
          $sourcePlayer_.api_draw_scrub_prog();
        }
      }, 800);

    }

    function view_updateColorHighlight(arg) {
      // --

      //console.log(arg);

      o.design_wave_color_progress = arg;
      if (o.skinwave_wave_mode === 'canvas') {
        dzsapWaveFunctions.view_drawCanvases(selfClass, cthis.attr('data-pcm'), 'canvas_change_pcm');

      }

    }

    function reinit() {

      if (selfClass.audioType === 'normal' || selfClass.audioType === 'detect' || selfClass.audioType === 'audio') {
        selfClass.audioType = 'selfHosted';
      }
    }


    function destroy_listeners() {


      if (destroyed) {
        return false;
      }


      isNotRenderingEnterFrame = true;

    }

    function handleClickLike() {
      // console.log('zoomsounds - click_like()', this);
      var _t = $(this);
      if (cthis.has(_t).length === 0) {
        return;
      }

      if (_t.hasClass('active')) {
        (ajax_retract_like.bind(selfClass))();
      } else {
        (ajax_submit_like.bind(selfClass))();
      }
    }


    function destroy_it() {


      if (destroyed) {
        return false;
      }

      if (selfClass.player_playing) {
        pause_media();
      }


      $(window).off('resize.dzsap');

      cthis.remove();
      cthis = null;

      destroyed = true;
    }

    function handleClickForSetupMedia(e, pargs) {
      // console.log('click_for_setup_media', cthis, pargs);


      var margs = {

        'do_not_autoplay': false
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      cthis.find('.playbtn').unbind('click', handleClickForSetupMedia);
      cthis.find('.scrubbar').unbind('click', handleClickForSetupMedia);

      setup_media(margs);


      if (dzsapHelpers.is_android() || dzsapHelpers.is_ios()) {
        play_media({
          'called_from': 'click_for_setup_media'
        });
      }
    }


    function handleClickMenuState(e) {
      if (o.parentgallery && typeof (o.parentgallery.get(0)) !== "undefined") {
        o.parentgallery.get(0).api_toggle_menu_state();
      }
    }


    function init_checkIfReady(pargs) {
      // console.log('check_ready()', cthis, selfClass.$mediaNode_, selfClass.$mediaNode_.readyState);
      //=== do a little ready checking


      var margs = {

        'do_not_autoplay': false
      };

      if (selfClass._actualPlayer && dzsapHelpers.is_ios()) {
        return false;
      }


      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      // console.log(selfClass.$mediaNode_.readyState);
      if (selfClass.audioType === 'youtube') {
        init_loaded(margs);
      } else {
        if (typeof (selfClass.$mediaNode_) !== 'undefined' && selfClass.$mediaNode_) {


          //                        return false;
          if (selfClass.$mediaNode_.nodeName !== "AUDIO" || o.type === 'shoutcast') {
            init_loaded(margs);
          } else {
            if (dzsapHelpers.is_safari()) {

              if (selfClass.$mediaNode_.readyState >= 1) {
                //console.log("CALL INIT LOADED FROM ",selfClass.$mediaNode_.readyState);

                if (selfClass.isPlayerLoaded === false) {
                }

                init_loaded(margs);
                clearInterval(inter_checkReady);

                if (o.action_audio_loaded_metadata) {
                  o.action_audio_loaded_metadata(cthis);
                }
              }
            } else {
              if (selfClass.$mediaNode_.readyState >= 2) {
                //console.log("CALL INIT LOADED FROM ",selfClass.$mediaNode_.readyState);
                if (selfClass.isPlayerLoaded === false) {
                }
                init_loaded(margs);
                clearInterval(inter_checkReady);

                // console.log(selfClass.$mediaNode_.duration);


                // console.log(o.action_audio_loaded_metadata)
                if (o.action_audio_loaded_metadata) {
                  o.action_audio_loaded_metadata(cthis);
                }
              }
            }

          }
        }

      }

    }

    function scrubbar_reveal() {
      setTimeout(function () {
        selfClass.cthis.addClass('scrubbar-loaded');
      }, 1000);
    }


    function setupStructure_thumbnailCon() {

      // return false;


      if (cthis.attr('data-thumb')) {
        cthis.addClass('has-thumb');
        var aux_thumb_con_str = '';

        if (cthis.attr('data-thumb_link')) {
          aux_thumb_con_str += '<a href="' + cthis.attr('data-thumb_link') + '"';
        } else {
          aux_thumb_con_str += '<div';
        }
        aux_thumb_con_str += ' class="the-thumb-con"><div class="the-thumb" style=" background-image:url(' + cthis.attr('data-thumb') + ')"></div>';


        if (cthis.attr('data-thumb_link')) {
          aux_thumb_con_str += '</a>';
        } else {
          aux_thumb_con_str += '</div>';
        }


        if (cthis.children('.the-thumb-con').length) {
          aux_thumb_con_str = cthis.children('.the-thumb-con').eq(0);
        }


        if (o.design_skin !== 'skin-customcontrols') {
          if (o.design_skin === 'skin-wave' && (selfClass.skinwave_mode === 'small' || selfClass.skinwave_mode === 'alternate')) {

            if (selfClass.skinwave_mode === 'alternate') {

              // console.log("WHERE IS INNER ? ",selfClass._audioplayerInner);
              selfClass._audioplayerInner.prepend(aux_thumb_con_str);
            } else {

              selfClass._apControlsLeft.prepend(aux_thumb_con_str);
            }
          } else if (o.design_skin === 'skin-steel') {


            selfClass._apControlsLeft.prepend(aux_thumb_con_str);
          } else {

            selfClass._audioplayerInner.prepend(aux_thumb_con_str);
          }
        }

        _theThumbCon = selfClass._audioplayerInner.children('.the-thumb-con').eq(0);
      } else {

        cthis.removeClass('has-thumb');
      }
    }


    function setup_structure_sanitizers() {

      if (cthis.hasClass('zoomsounds-wrapper-bg-bellow') && cthis.find('.dzsap-wrapper-buts').length === 0) {
        // console.log('NO WRAPPER BUTS - ',cthis.find('.ap-controls-right'));

        cthis.append('<div class="temp-wrapper"></div>');
        cthis.find('.temp-wrapper').append(selfClass.extraHtmlAreas.controlsRight);
        cthis.find('.temp-wrapper').children('*:not(.dzsap-wrapper-but)').remove();
        cthis.find('.temp-wrapper > .dzsap-wrapper-but').unwrap();
        cthis.find('.dzsap-wrapper-but').each(function () {
          var aux = $(this).html();
          // console.log('aux - ',aux);

          aux = aux.replace('{{heart_svg}}', '\t&hearts;');
          aux = aux.replace('{{svg_share_icon}}', dzsapSvgs.svg_share_icon);


          if ($(this).get(0) && $(this).get(0).outerHTML.indexOf('dzsap-multisharer-but') > -1) {
            selfClass.isMultiSharer = true;
            // console.log("selfClass.isMultiSharer -5 sw",selfClass.isMultiSharer);

          }

          $(this).html(aux);
        }).wrapAll('<div class="dzsap-wrapper-buts"></div>');
      }

      if (o.design_skin === 'skin-customcontrols') {
        cthis.html(String(cthis.html()).replace('{{svg_play_icon}}', dzsapSvgs.svg_play_icon));
        cthis.html(String(cthis.html()).replace('{{svg_pause_icon}}', dzsapSvgs.pausebtn_svg));
      }
    }


    /**
     * called if we have .dzsap-multisharer-but in html
     */
    function check_multisharer() {

      // -- we setup a box main here as a child of body

      // console.log('selfClass.isMultiSharer -', selfClass.isMultiSharer);

      selfClass.cthis.find('.dzsap-multisharer-but').data('cthis', cthis);
      // console.log("WE SETUP HERE", cthis.find('.dzsap-multisharer-but').data('cthis'), 'selfClass.isMultiSharer - ',selfClass.isMultiSharer);
      selfClass.cthis.data('embed_code', selfClass.feedEmbedCode);


      if (selfClass.isMultiSharer) {
        window.dzsap_init_multisharer()
      }

    }

    function view_wave_setupRandomPcm(pargs) {


      var margs = {
        call_from: 'default'
      }


      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      var default_pcm = [];

      if (!(o.pcm_data_try_to_generate === 'on' && o.pcm_data_try_to_generate_wait_for_real_pcm === 'on')) {
        for (var i3 = 0; i3 < 200; i3++) {
          default_pcm[i3] = Number(Math.random()).toFixed(2);
        }
        default_pcm = JSON.stringify(default_pcm);

        cthis.addClass('rnd-pcm-for-now')
        cthis.attr('data-pcm', default_pcm);
      }


      dzsapHelpers.scrubbar_modeWave_setupCanvas({}, selfClass);


    }


    /**
     * called from setup_structure
     */
    function setup_structure_scrub() {

      if (o.skinwave_enableSpectrum !== 'on') {
        if (o.skinwave_wave_mode === 'canvas') {

          if (cthis.attr('data-pcm')) {
            dzsapHelpers.scrubbar_modeWave_setupCanvas({}, selfClass);
          } else {
            view_wave_setupRandomPcm();
          }
        }
      } else {

        // -- spectrum ON
        dzsapHelpers.scrubbar_modeWave_setupCanvas({}, selfClass);
        // -- old spectrum code
        $scrubBgCanvas = selfClass.cthis.find('.scrub-bg-img').eq(0);
        _scrubBgCanvasCtx = $scrubBgCanvas.get(0).getContext("2d");
      }

    }
    ;


    /**
     * order -> init, setup_media, init_loaded
     * called from init() if not icecast or soundcloud
     * @param pargs
     * @returns {boolean}
     */
    function setup_media(pargs) {

      // console.groupCollapsed('setup_media()')
      // console.trace();
      // console.groupEnd()

      //                return;


      var setupMediaAttrs = {

        'do_not_autoplay': false,
        'called_from': 'default',
        'newSource': '',
      };


      if (pargs) {
        setupMediaAttrs = $.extend(setupMediaAttrs, pargs);
      }
      // console.log('%c --- #setup_media()', ConstantsDzsAp.DEBUG_STYLE_1, cthis.attr('data-source'), o.cueMedia, selfClass.ajax_view_submitted, setupMediaAttrs, 'cthis - ', cthis, 'o.preload_method -', o.preload_method, 'source - ', selfClass.data_source);


      // -- these types should not exist
      if (selfClass.audioType === 'icecast' || selfClass.audioType === 'shoutcast') {
        selfClass.audioType = 'selfHosted';
      }

      if (o.cueMedia === 'off') {
        if (selfClass.ajax_view_submitted === 'auto') {
          // -- why is view submitted ?
          selfClass.increment_views = 1;
          selfClass.ajax_view_submitted = 'off';
        }
      }


      //console.log(type, o.type, loaded);

      if (selfClass.isPlayerLoaded === true) {
        return;
      }
      if (cthis.attr('data-original-type') === 'youtube') {
        return;
      }


      if (selfClass.audioType === 'youtube') {
        dzsap_youtube_setupMedia(selfClass, setupMediaAttrs);
      }
      // -- END youtube


      if (setupMediaAttrs.newSource) {
        selfClass.data_source = setupMediaAttrs.newSource;
      }

      if (dzsapHelpers.is_ios()) {
        o.preload_method = 'metadata';
      }

      // console.log('selfClass.data_source - ', selfClass.data_source);

      const stringAudioElement = mediaFunctions.buildAudioElementHtml(selfClass, selfClass.audioTypeSelfHosted_streamType, 'setup_media');
      stringAudioElementHtml = stringAudioElement.stringAudioElementHtml;
      const stringAudioTagSource = stringAudioElement.stringAudioTagSource;

      if (selfClass.audioType === 'selfHosted' || selfClass.audioType === 'soundcloud') {
        if (setupMediaAttrs.called_from === 'change_media' || setupMediaAttrs.called_from === 'nonce generated') {

          if (dzsapHelpers.is_ios() || dzsapHelpers.is_android()) {

            // -- we append only the source to mobile devices as we need the thing to autoplay without user action
            // console.log('hier', 'selfClass.$mediaNode_ - ', selfClass.$mediaNode_);

            setupMediaElement(selfClass, stringAudioElementHtml, stringAudioTagSource);
            // console.log('$(selfClass.$mediaNode_) - ', $(selfClass.$mediaNode_).outerHTML())

          } else {
            // -- normal desktop

            // console.log('%c .str_audio_element - ', 'background-color: #dada20;',str_audio_element);

            if (!(setupMediaAttrs.called_from === 'nonce generated' && selfClass._actualPlayer)) {

              setupMediaElement(selfClass, stringAudioElementHtml);
            }
          }
          // -- end change media
        } else {

          // console.log('str_audio_element - ', {str_audio_element});

          setupMediaElement(selfClass, stringAudioElementHtml);

          if (dzsapHelpers.is_ios() || dzsapHelpers.is_android()) {
            if (setupMediaAttrs.called_from === 'retrieve_soundcloud_url') {
              setTimeout(function () {
                pause_media();
              }, 500);
            }
          }
        }


        if (selfClass.$mediaNode_ && selfClass.$mediaNode_.addEventListener && selfClass.cthis.attr('data-source') !== 'fake') {
          mediaFunctions.setupMediaListeners(selfClass, setupMediaAttrs, init_loaded, volume_lastVolume, volume_setVolume)
        }

      }

      selfClass.cthis.addClass('media-setuped');


      if (setupMediaAttrs.called_from === 'change_media') {
        return false;
      }

      if (selfClass.audioType !== 'youtube') {
        if (selfClass.cthis.attr('data-source') === 'fake') {
          if (dzsapHelpers.is_ios() || dzsapHelpers.is_android()) {
            init_loaded(setupMediaAttrs);
          }
        } else {
          if (dzsapHelpers.is_ios()) {

            setTimeout(function () {
              init_loaded(setupMediaAttrs);
            }, 1000);


          } else {

            // -- check_ready() will fire init_loaded()
            inter_checkReady = setInterval(function () {
              init_checkIfReady(setupMediaAttrs);
            }, 50);
            //= setInterval(check_ready, 50);
          }

        }


        if (o.preload_method === 'none') {
          mediaFunctions.makeMediaPreloadInTheFuture(selfClass);
        }


        if (o.design_skin === 'skin-customcontrols' || o.design_skin === 'skin-customhtml') {
          cthis.find('.custom-play-btn,.custom-pause-btn').off('click');
          cthis.find('.custom-play-btn,.custom-pause-btn').on('click', handleClick_playPause);
        }

        if (o.failsafe_repair_media_element) {
          mediaFunctions.repairMediaElement(selfClass, stringAudioElementHtml);

        }
      }

      // console.log('o.scrubbar_type - ', o.scrubbar_type);
      if (o.scrubbar_type === 'wave' && o.skinwave_enableSpectrum === 'on') {
        dzsapHelpers.player_initSpectrumOnUserAction(selfClass);

      }


      // dzsapHelpers.is_ios() ||


      selfClass.isSetupedMedia = true;


    }

    function destroy_cmedia() {
      // -- destroy cmedia

      $(selfClass.$mediaNode_).remove();
      selfClass.$mediaNode_ = null;
      selfClass.isSetupedMedia = false;
      selfClass.isPlayerLoaded = false;
    }

    function destroy_media() {
      //console.log("destroy_media()", cthis)
      pause_media();


      if (selfClass.$mediaNode_) {

        //console.log(selfClass.$mediaNode_, selfClass.$mediaNode_.src);
        if (selfClass.$mediaNode_.children) {

          //selfClass.$mediaNode_.children().remove();
        }

        //console.log(selfClass.$mediaNode_.innerHTML);
        if (o.type === 'audio') {
          selfClass.$mediaNode_.innerHTML = '';
          selfClass.$mediaNode_.load();
        }
        //console.log(selfClass.$mediaNode_.innerHTML);

        //selfClass.$mediaNode_.remove();
      }

      if (dzsapHelpers.is_ios() || dzsapHelpers.is_android()) {
      } else {
        if (selfClass.$theMedia) {

          selfClass.$theMedia.children().remove();
          selfClass.isPlayerLoaded = false;
        }
      }

      destroy_cmedia();

    }

    function setup_listeners() {


      if (setuped_listeners) {
        return false;
      }
      // console.log('setup_listeners()');

      setuped_listeners = true;


      // -- adding scrubbar listeners
      selfClass._scrubbar.unbind('mousemove');
      selfClass._scrubbar.unbind('mouseleave');
      selfClass._scrubbar.unbind('click');
      selfClass._scrubbar.bind('mousemove', handleMouseOnScrubbar);
      selfClass._scrubbar.bind('mouseleave', handleMouseOnScrubbar);
      selfClass._scrubbar.bind('click', handleMouseOnScrubbar);

      // cthis.on('');


      selfClass.$controlsVolume.on('click', '.volumeicon', volume_handleClickMuteIcon);

      selfClass.$controlsVolume.bind('mousemove', volume_handleMouse);
      selfClass.$controlsVolume.bind('mousedown', volume_handleMouse);


      // $(document).undelegate(window, 'mouseup', mouse_volumebar);
      $(document).on('mouseup', window, volume_handleMouse);

      if (o.design_skin === 'skin-silver') {
        cthis.on('click', '.volume-holder', volume_handleMouse);
      }

      cthis.find('.playbtn').unbind('click');


      //                console.log('setup_listeners()');

      setTimeout(handleResize, 300);
      // setTimeout(handleResize,1000);
      setTimeout(handleResize, 2000);

      if (o.settings_trigger_resize > 0) {
        inter_trigger_resize = setInterval(handleResize, o.settings_trigger_resize);
      }


      cthis.addClass('listeners-setuped');


      return false;

      //                console.log('ceva');
    }


    function volume_getLast() {
      return volume_lastVolume;
    }

    /**
     * init laoded
     * @param pargs
     */
    function init_loaded(pargs) {
      // console.log('init_loaded()');

      // if (cthis.attr('id') === 'apminimal') {
      // }
      // console.log('init_loaded() - ', pargs, cthis, cthis.hasClass('loaded'));
      if (cthis.hasClass('dzsap-loaded')) {
        return;
      }

      var margs = {
        'do_not_autoplay': false
        , 'call_from': 'init'
      };


      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      // console.log('[dzsap] [init] init_loaded()', margs);

      setTimeout(function () {
        selfClass.isSafeToChangeTrack = true;
      }, 5000);


      if (typeof (selfClass.$mediaNode_) !== "undefined" && selfClass.$mediaNode_) {
        if (selfClass.$mediaNode_.nodeName === 'AUDIO') {
          //console.log(selfClass.$mediaNode_);
          selfClass.$mediaNode_.addEventListener('ended', handleMediaEnd);
        }
      }


      //console.log("CLEAR THE TIMEOUT HERE")
      clearInterval(inter_checkReady);
      clearTimeout(inter_checkReady);
      setup_listeners();
      //console.log('setuped_listeners', cthis.hasClass('dzsap-loaded'), cthis)


      setTimeout(function () {

        //console.log(selfClass.$currTime, )
        if (selfClass.$currTime && selfClass.$currTime.outerWidth() > 0) {
          currTime_outerWidth = selfClass.$currTime.outerWidth();
        }
      }, 1000);


      // -- this comes from cue off, no pcm data


      if (selfClass.isPcmRequiredToGenerate) {
        dzsapWaveFunctions.scrubModeWave__checkIfWeShouldTryToGetPcm(selfClass, {
          called_from: 'init_loaded()'
        });
      }


      //console.log('type - ',type);
      //console.log('initLoaded() - margs - ',margs);


      if (selfClass.audioType !== 'fake' && margs.call_from !== 'force_reload_change_media') {
        if (o.settings_exclude_from_list !== 'on' && dzsap_list && dzsap_list.indexOf(cthis) === -1) {
          if (selfClass._actualPlayer === null) {
            dzsap_list.push(cthis);
          }
        }
        if (o.type_audio_stop_buffer_on_unfocus === 'on') {
          cthis.data('type_audio_stop_buffer_on_unfocus', 'on');
          cthis.get(0).api_destroy_for_rebuffer = function () {
            if (o.type === 'audio') {
              selfClass.playFrom = selfClass.$mediaNode_.currentTime;
            }
            destroy_media();
            destroyed_for_rebuffer = true;
          }

        }
      }

      //console.log("CHECK TIME",cthis);


      //console.log(selfClass.ajax_view_submitted);

      if (selfClass.ajax_view_submitted === 'auto') {
        setTimeout(function () {
          if (selfClass.ajax_view_submitted === 'auto') {
            selfClass.ajax_view_submitted = 'off';
          }
        }, 1000);
      }

      //console.log('---- ADDED LOADED BUT FROM WHERE', cthis);
      selfClass.isPlayerLoaded = true;

      if (selfClass.data_source !== 'fake') {

        cthis.addClass('dzsap-loaded');
      }

      //                console.log(playfrom);

      if (o.default_volume === 'default') {
        defaultVolume = 1;
      }

      if (isNaN(Number(o.default_volume)) === false) {
        defaultVolume = Number(o.default_volume);
      } else {
        if (o.default_volume === 'last') {


          if (localStorage !== null && selfClass.the_player_id) {

            //console.log(selfClass.the_player_id);


            if (localStorage.getItem('dzsap_last_volume_' + selfClass.the_player_id)) {

              defaultVolume = localStorage.getItem('dzsap_last_volume_' + selfClass.the_player_id);
            } else {

              defaultVolume = 1;
            }
          } else {

            defaultVolume = 1;
          }
        }
      }

      if (o.volume_from_gallery) {
        defaultVolume = o.volume_from_gallery;
      }


      // console.log(pargs);
      // console.log('[dzsap] [volume] defaultVolume - ', defaultVolume);
      volume_setVolume(defaultVolume, {
        call_from: "from_init_loaded"
      });


      if (selfClass.pseudo_sample_time_start) {
        selfClass.playFrom = (selfClass.pseudo_sample_time_start);
      }
      // console.log('playfrom -> ',playfrom);
      if (dzsHelpers.isInt(selfClass.playFrom)) {
        seek_to(selfClass.playFrom, {
          call_from: 'from_playfrom'
        });
      }


      // TODO: debug
      // localStorage['dzsap_' + selfClass.the_player_id + '_lastpos'] = 10;
      if (selfClass.playFrom === 'last') {
        // -- here we save last position
        if (typeof Storage !== 'undefined') {
          setTimeout(function () {
            selfClass.playFrom_ready = true;
          })


          if (typeof localStorage['dzsap_' + selfClass.the_player_id + '_lastpos'] !== 'undefined') {

            // console.log("LETS SEEK TO lastposition -3 ",localStorage['dzsap_' + selfClass.the_player_id + '_lastpos'])
            seek_to(localStorage['dzsap_' + selfClass.the_player_id + '_lastpos'], {
              'call_from': 'last_pos'
            });
          }
        }
      }
      //return false ;

     // console.log(selfClass.cthis, ' - autoplay - ', o.autoplay, o.cueMedia);


      if (margs.do_not_autoplay !== true) {
        if (o.autoplay === 'on' && o.cueMedia === 'on') {
          // console.log('margs.do_not_autoplay - ', margs.do_not_autoplay, margs,o);
          play_media({
            'called_from': 'do not autoplay not true ( init_loaded() ) '
          });
        }

      }

      if (selfClass.$mediaNode_ && selfClass.$mediaNode_.duration) {
        dzsapHelpers.player_view_addMetaLoaded(selfClass);
      }


      // -- init loaded()


      // console.log('called check_time() - ',cthis);

      reinit();

      handleEnterFrame({
        'fire_only_once': false
      });

      if (o.autoplay === 'off') {
        isNotRenderingEnterFrame = true;
      }

      cthis.addClass('init-loaded');

      setTimeout(function () {
        //console.log(cthis.find('.wave-download'));

        selfClass.timeModel.refreshTimes({
          'call_from': 'set timeout 500'
        });
        handleEnterFrame({
          'fire_only_once': true
        });

        cthis.find('.wave-download').bind('click', handle_mouse);
      }, 500);

      setTimeout(function () {
        //console.log(cthis.find('.wave-download'));

        selfClass.timeModel.refreshTimes({
          'call_from': 'set timeout 1000'
        });

        handleEnterFrame({
          'fire_only_once': true
        });


      }, 1000);


      // console.log('init_loaded - ',o.action_video_contor_60secs);
      if (inter_60_secs_contor === 0 && o.action_video_contor_60secs) {
        inter_60_secs_contor = setInterval(count_60secs, 30000);
      }


    }


    function count_60secs() {
      // console.log('count it',o.action_video_contor_60secs,cthis.hasClass('is-playing'));
      if (o.action_video_contor_60secs && cthis.hasClass('is-playing')) {
        o.action_video_contor_60secs(cthis, '');
      }
    }


    function handle_mouse(e) {
      var $t = $(this);

      // console.log('handle_mouse() _t - ',_t);

      if (e.type === 'click') {
        if ($t.hasClass('wave-download')) {
          (ajax_submit_download.bind(selfClass))();
        }
        if ($t.hasClass('prev-btn')) {
          handleClick_prevBtn();
        }
        if ($t.hasClass('next-btn')) {
          handleClick_nextBtn();
        }
        if ($t.hasClass('tooltip-indicator--btn-footer-playlist')) {

          $t.parent().find('.dzstooltip').toggleClass('active');
        }
        if ($t.hasClass('zoomsounds-btn-go-beginning')) {

          var _target = cthis;
          if (selfClass._actualPlayer) {
            _target = selfClass._actualPlayer;
          }

          _target.get(0).api_seek_to_0();
        }
        if ($t.hasClass('zoomsounds-btn-step-backward')) {

          var _target = cthis;
          if (selfClass._actualPlayer) {
            _target = selfClass._actualPlayer;
          }

          _target.get(0).api_step_back();
        }
        if ($t.hasClass('zoomsounds-btn-step-forward')) {

          var _target = cthis;
          if (selfClass._actualPlayer) {
            _target = selfClass._actualPlayer;
          }

          _target.get(0).api_step_forward();
        }
        if ($t.hasClass('zoomsounds-btn-slow-playback')) {
          var _target = cthis;
          if (selfClass._actualPlayer) {
            _target = selfClass._actualPlayer;
          }

          _target.get(0).api_playback_slow();
        }
        if ($t.hasClass('zoomsounds-btn-reset')) {
          var _target = cthis;
          if (selfClass._actualPlayer) {
            _target = selfClass._actualPlayer;
          }

          _target.get(0).api_playback_reset();
        }
        if ($t.hasClass('btn-zoomsounds-download')) {
          (ajax_submit_download.bind(selfClass))();
        }
        if ($t.hasClass('dzsap-repeat-button')) {

          // console.log("REPEAT");
          if (selfClass.player_playing) {
          }
          seek_to(0, {
            call_from: "repeat"
          });
        }
        if ($t.hasClass('dzsap-loop-button')) {

          if ($t.hasClass('active')) {
            $t.removeClass('active');
            loop_active = false;
          } else {

            $t.addClass('active');
            loop_active = true;

          }
          console.log('loop_active - ', loop_active, cthis);


        }
      }
      if (e.type === 'mouseover') {
      }
      if (e.type === 'mouseenter') {
        // console.log('mouseenter');

        if (o.preview_on_hover === 'on') {
          seek_to_perc(0);

          play_media({
            'called_from': 'preview_on_hover'
          });
          console.log('mouseover');
        }

        window.dzsap_mouseover = true;
      }
      if (e.type === 'mouseleave') {
        // console.log('mouseleave');


        if (o.preview_on_hover === 'on') {
          seek_to_perc(0);

          pause_media();
        }
        window.dzsap_mouseover = false;
      }
    }


    function view_drawCurrentTime() {

      // -- draw current time -- called onEnterFrame when playing
      // console.log('draw_curr_time() -7');

      let currentTime = selfClass.timeModel.getVisualCurrentTime();
      let totalTime = selfClass.timeModel.getVisualTotalTime();

      if (selfClass.initOptions.scrubbar_type === 'wave') {
        if (selfClass.initOptions.skinwave_enableSpectrum === 'on') {
          // -- spectrum ON
          // -- easing
          if (selfClass.player_playing) {

          } else {
            return false;
          }
          if ($scrubBgCanvas) {

            canvasWidth = $scrubBgCanvas.width();
            canh = $scrubBgCanvas.height();

            $scrubBgCanvas.get(0).width = canvasWidth;
            $scrubBgCanvas.get(0).height = canh;
          }


          var drawMeter = function () {

            //console.log(selfClass.initOptions.type);

            if (selfClass.initOptions.type === 'soundcloud' || sw_spectrum_fakeit === 'on') {

              selfClass.lastArray = dzsapHelpers.generateFakeArrayForPcm();

            } else {

              if (selfClass.spectrum_analyser) {
                selfClass.lastArray = new Uint8Array(selfClass.spectrum_analyser.frequencyBinCount);
                selfClass.spectrum_analyser.getByteFrequencyData(selfClass.lastArray);
              }
            }


            if (selfClass.lastArray && selfClass.lastArray.length) {


              //fix when some sounds end the value still not back to zero
              var len = selfClass.lastArray.length;
              for (var i = len - 1; i >= 0; i--) {
                //selfClass.lastArray[i] = 0;

                if (i < len / 2) {

                  selfClass.lastArray[i] = selfClass.lastArray[i] / 255 * canh;
                } else {

                  selfClass.lastArray[i] = selfClass.lastArray[len - i] / 255 * canh;
                }
              }



              if (selfClass.last_lastarray) {
                for (var i3 = 0; i3 < selfClass.last_lastarray.length; i3++) {
                  begin_viy = selfClass.last_lastarray[i3]; // -- last value
                  change_viy = selfClass.lastArray[i3] - begin_viy; // -- target value - last value
                  duration_viy = 3;
                  selfClass.lastArray[i3] = Math.easeIn(1, begin_viy, change_viy, duration_viy);
                }
              }
              // -- easing END

              dzsapWaveFunctions.draw_canvas($scrubBgCanvas.get(0), selfClass.lastArray, '' + selfClass.initOptions.design_wave_color_bg, {
                'call_from': 'spectrum',
                selfClass,
                'skinwave_wave_mode_canvas_waves_number': parseInt(selfClass.initOptions.skinwave_wave_mode_canvas_waves_number),
                'skinwave_wave_mode_canvas_waves_padding': parseInt(selfClass.initOptions.skinwave_wave_mode_canvas_waves_padding)
              })


              if (selfClass.lastArray) {
                selfClass.last_lastarray = selfClass.lastArray.slice();
              }


            }

          }

          drawMeter();


          // -- end spectrum
        }

        if (selfClass.$currTime && selfClass.$currTime.length) {

          if (selfClass.initOptions.skinwave_timer_static !== 'on') {

            if (scrubbarProgX < 0) {
              scrubbarProgX = 0;
            }
            scrubbarProgX = parseInt(scrubbarProgX, 10);


            if (scrubbarProgX < 2 && cthis.data('promise-to-play-footer-player-from')) {
              // console.error("WE RETURN IT")
              return false;
            }

            // -- move currTime
            selfClass.$currTime.css({
              'left': scrubbarProgX
            });

            // console.log('spos - ',spos);
            // console.log('sw - ',sw);
            if (scrubbarProgX > scrubbarWidth - currTime_outerWidth) {
              //console.log(sw, currTime_outerWidth);
              selfClass.$currTime.css({
                'left': scrubbarWidth - currTime_outerWidth
              })
            }
            if (scrubbarProgX > scrubbarWidth - 30 && scrubbarWidth) {
              selfClass.$totalTime.css({
                'opacity': 1 - (((scrubbarProgX - (scrubbarWidth - 30)) / 30))
              });
            } else {
              if (selfClass.$totalTime.css('opacity') !== '1') {
                selfClass.$totalTime.css({
                  'opacity': ''
                });
              }
            }

          }

        }
      }

      if (totalTime !== last_time_total) {
        view_updateTotalTime(totalTime)
      }

      if (selfClass.$currTime) {


        if (isScrubShowingCurrentTime === false) {
          selfClass.$currTime.html(dzsapHelpers.formatTime(currentTime));
        }

        // console.log({totalTime}, cthis);
        if (selfClass.timeModel.getVisualTotalTime() && selfClass.timeModel.getVisualTotalTime() > -1) {
          selfClass.cthis.addClass('time-total-visible');

          // side effect
          ajax_submit_total_time(selfClass);

        }
      }


      if (selfClass.spectrum_audioContext) {
        if (selfClass.$totalTime) {
          selfClass.$totalTime.html(dzsapHelpers.formatTime(totalTime));
        }
      }

    }

    function view_updateTotalTime(totalTime) {

      if (selfClass.$totalTime) {
        selfClass.$totalTime.html(dzsapHelpers.formatTime(totalTime));
        selfClass.$totalTime.fadeIn('fast');
      }
    }

    /**
     * draw the scrub width
     * @returns {string|boolean}
     */
    function view_drawScrubProgress() {
      // return false;
      let currentTime = selfClass.timeModel.getVisualCurrentTime();
      let totalTime = selfClass.timeModel.getVisualTotalTime();
      // console.log({currentTime,totalTime});


      scrubbarProgX = (currentTime / totalTime) * scrubbarWidth;

      // console.log('sw - ',sw);


      if (isNaN(scrubbarProgX)) {
        scrubbarProgX = 0;
      }
      if (scrubbarProgX > scrubbarWidth) {
        scrubbarProgX = scrubbarWidth;
      }

      if (currentTime < 0) {
        scrubbarProgX = 0;
      }

      if (totalTime === 0 || isNaN(totalTime)) {
        scrubbarProgX = 0;
      }

      // console.log('spos -3 ',spos, 'promise-to-play-footer-player-from -',cthis.data('promise-to-play-footer-player-from'), "||", cthis);

      if (scrubbarProgX < 2 && cthis.data('promise-to-play-footer-player-from')) {
        // console.error("WE RETURN IT")
        return false;
      }

      if (selfClass.spectrum_audioContext_buffer === null) {
        if (selfClass.$$scrubbProg) {
          selfClass.$$scrubbProg.style.width = parseInt(scrubbarProgX, 10) + 'px';
        }
      }

    }

    function handleClick_prevBtn() {


      // console.log('click_prev_btn()')
      if (o.parentgallery && (o.parentgallery.get(0))) {
        o.parentgallery.get(0).api_goto_prev();
      } else {

        syncPlayers_gotoPrev();
      }
    }

    function handleClick_nextBtn() {
      if (o.parentgallery && (o.parentgallery.get(0))) {
        o.parentgallery.get(0).api_goto_next();
      } else {

        syncPlayers_gotoNext();
      }
    }


    /**
     * fired on requestAnimationFrame
     * @param pargs
     * @returns {boolean}
     */
    function handleEnterFrame(pargs) {


      // -- enter frame
      // console.log('handleTickChange()', cthis);

      var margs = {
        'fire_only_once': false
      }

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      if (destroyed) {
        console.log("DESTROYED");
        return false;
      }


      // console.log(sw_suspend_enter_frame);
      if (margs.fire_only_once === false && isNotRenderingEnterFrame) {
        requestAnimationFrame(handleEnterFrame);
        // console.log("SUSPENDED ENTER FRAME HERE");
        return false;
      }
      // console.log("REACHED");


      selfClass.timeModel.refreshTimes({
        'call_from': 'checK_time'
      });

      if (selfClass.audioType === 'selfHosted') {

      }


      view_drawScrubProgress();


      selfClass.timeModel.processCurrentFrame();
      // console.log('cthis -5 ', cthis, selfClass._sourcePlayer);


      // -- skin minimal
      if (o.design_skin === 'skin-minimal') {


        if (selfClass.player_playing || selfClass.isCanvasFirstDrawn === false) {


          var ctx_minimal = selfClass.skin_minimal_canvasplay.getContext('2d');
          //console.log(ctx);


          var ctx_w = selfClass.skin_minimal_canvasplay.width;
          var ctx_h = selfClass.skin_minimal_canvasplay.height;

          // console.log(ctx_w);
          var pw = ctx_w / 100;
          var ph = ctx_h / 100;

          if (selfClass._actualPlayer) {

          }
          scrubbarProgX = Math.PI * 2 * (selfClass.timeModel.getVisualCurrentTime() / selfClass.timeModel.getVisualTotalTime());

          if (isNaN(scrubbarProgX)) {
            scrubbarProgX = 0;
          }
          if (scrubbarProgX > Math.PI * 2) {
            scrubbarProgX = Math.PI * 2;
          }

          ctx_minimal.clearRect(0, 0, ctx_w, ctx_h);
          //console.log(ctx_w, ctx_h);


          // -- use design_wave_color_progress for drawing skin-minimal circle


          ctx_minimal.beginPath();
          ctx_minimal.arc((50 * pw), (50 * ph), (40 * pw), 0, Math.PI * 2, false);
          ctx_minimal.fillStyle = "rgba(0,0,0,0.1)";
          ctx_minimal.fill();


          // console.log(spos);
          ctx_minimal.beginPath();
          ctx_minimal.arc((50 * pw), (50 * ph), (34 * pw), 0, scrubbarProgX, false);
          //ctx_minimal.fillStyle = "rgba(0,0,0,0.3)";
          ctx_minimal.lineWidth = (10 * pw);
          ctx_minimal.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx_minimal.stroke();


          selfClass.isCanvasFirstDrawn = true;


        }
        //console.log('ceva');
      }


      //                console.log(o.design_skin);

      // -- enter_frame
      // console.log("REACHED2");
      view_drawCurrentTime();


      // -- debug handleTickChange
      // inter_check = setTimeout(handleTickChange, 2000);
      if (margs.fire_only_once !== true) {
        requestAnimationFrame(handleEnterFrame);
      }


    }

    function handleClick_playPause(e) {
      //console.log('click_playpause', 'selfClass.player_playing - ',selfClass.player_playing);

      if (cthis.hasClass('prevent-bubble')) {

        if (e && e.stopPropagation) {
          e.preventDefault();
          e.stopPropagation();

          // return false;
        }

      }

      var _t = $(this);

      var isToggleCancelled = false;
      //console.log(_t);


      if (!cthis.hasClass('listeners-setuped')) {


        $(selfClass.$mediaNode_).attr('preload', 'auto');

        setup_listeners();
        init_loaded();


        var inter_checkTotalTime = setInterval(function () {

          // console.log(selfClass.$mediaNode_, selfClass.$mediaNode_.duration);
          if (selfClass.$mediaNode_ && selfClass.$mediaNode_.duration && isNaN(selfClass.$mediaNode_.duration) === false) {


            clearInterval(inter_checkTotalTime);
          }
        }, 1000);
      }


      if (o.design_skin === 'skin-minimal') {

        var center_x = _t.offset().left + skin_minimal_button_size / 2;
        var center_y = _t.offset().top + skin_minimal_button_size / 2;
        var mouse_x = e.pageX;
        var mouse_y = e.pageY;

        var perc = -(mouse_x - center_x - (skin_minimal_button_size / 2)) * 0.005;
        if (mouse_y < center_y) {
          perc = 0.5 + (0.5 - perc)
        }

        if (Math.abs(mouse_y - center_y) > 20 || Math.abs(mouse_x - center_x) > 20) {

          seek_to_perc(perc, {
            call_from: "skin_minimal_scrub"
          })
          isToggleCancelled = true;

          handleEnterFrame({
            'fire_only_once': true
          });
        }
      }


      //unghi = acos (x - centruX) = asin(centruY - y)


      if (isToggleCancelled === false) {

        //console.log("selfClass.player_playing -> ",selfClass.player_playing);
        if (selfClass.player_playing === false) {
          play_media({
            'called_from': 'click_playpause'
          });
        } else {
          pause_media();
        }
      }


      return false;
    }


    /**
     *
     * @param targetIncrement
     */
    function

    syncPlayers_gotoItem(targetIncrement = 0) {


      var targetIndex = 0;
      if (selfClass.classFunctionalityInnerPlaylist) {
        // -- playlist Inner

        targetIndex = selfClass.playlist_inner_currNr + targetIncrement;
        if (targetIndex >= 0) {
          selfClass.classFunctionalityInnerPlaylist.playlistInner_gotoItem(targetIndex, {
            'call_from': 'api_sync_players_prev'
          });
        }
      } else {
        if (window.dzsap_syncList_players && window.dzsap_syncList_players.length > 0) {
          for (var keySyncPlayer in window.dzsap_syncList_players) {
            var $playerInSyncList = selfClass.cthis;

            if (selfClass._sourcePlayer) {
              $playerInSyncList = selfClass._sourcePlayer;
            }


            if (window.dzsap_syncList_players[keySyncPlayer].get(0) === $playerInSyncList.get(0)) {

              keySyncPlayer = parseInt(keySyncPlayer, 10);
              targetIndex = window.dzsap_syncList_index + targetIncrement;
              if (targetIndex >= 0 && targetIndex < window.dzsap_syncList_players.length) {
                let $currentSyncPlayer_ = window.dzsap_syncList_players[targetIndex].get(0);
                // console.log('THIS IS _c ',_c);

                if ($currentSyncPlayer_ && $currentSyncPlayer_.api_play_media) {
                  setTimeout(function () {
                    $currentSyncPlayer_.api_play_media({
                      'called_from': 'api_sync_players_prev'
                    });
                  }, 200);

                }
              }
            }
          }
        } else {
          console.log('[dzsap] [syncPlayers] no players found')
        }

      }

      if (window.dzsap_syncList_players && window.dzsap_syncList_index >= window.dzsap_syncList_players.length) {
        window.dzsap_syncList_index = 0;
      }

      // console.log('selfClass.playlist_inner_currNr-  ', selfClass.playlist_inner_currNr);

    }

    function

    syncPlayers_gotoPrev() {


      if (selfClass._actualPlayer) {
        selfClass._actualPlayer.get(0).api_sync_players_goto_prev();

        return false;
      }


      syncPlayers_gotoItem(-1);

    }


    /**
     * go to next inner playlistItem for single player
     * @returns {boolean}
     */
    function

    syncPlayers_gotoNext() {


      // console.log('sync_players_goto_next() - ', cthis, 'selfClass._actualPlayer - ',selfClass._actualPlayer);


      if (selfClass._actualPlayer) {
        selfClass._actualPlayer.get(0).api_sync_players_goto_next();

        return false;
      }


      syncPlayers_gotoItem(1);
    }

    function

    handleMediaEnd(pargs) {


      var margs = {
        'called_from': 'default'
      }


      if (pargs) {
        margs = $.extend(margs, pargs);
      }
      //console.log('end');
      if (selfClass.isMediaEnded) {
        return false;
      }

      // console.log('%c [dzsap] [play] handle_end()', ConstantsDzsAp.DEBUG_STYLE_PLAY_FUNCTIONS, margs);


      selfClass.isMediaEnded = true;

      selfClass.inter_isEnded = setTimeout(function () {
        selfClass.isMediaEnded = false;
      }, 1000);


      if (selfClass._actualPlayer && margs.call_from !== 'fake_player') {
        // -- lets leave fake player handle handle_end
        return false;
      }


      seek_to(0, {
        'call_from': 'handle_end'
      });

      if (o.loop === 'on' || loop_active) {
        play_media({
          'called_from': 'track_end'
        });
        return false;
      } else {
        pause_media();
      }

      if (o.parentgallery && typeof (o.parentgallery) !== 'undefined') {
        var args = {
          'call_from': 'player_handle_end'
        }
        o.parentgallery.get(0).api_gallery_handle_end();
      }


      setTimeout(function () {


        if (selfClass.cthis.hasClass('is-single-player') || (selfClass._sourcePlayer && selfClass._sourcePlayer.hasClass('is-single-player'))) {

          // -- called on handle end
          syncPlayers_gotoNext();
        }

      }, 100);

      setTimeout(function () {

        if (selfClass._sourcePlayer && (selfClass._sourcePlayer.hasClass('is-single-player') || selfClass._sourcePlayer.hasClass('feeded-whole-playlist'))) {
          //action_audio_end(selfClass._sourcePlayer,args);
          selfClass._sourcePlayer.get(0).api_handle_end({
            'call_from': 'handle_end() fake_player'
          });
          return false;
          //args.child_player = selfClass._sourcePlayer;
        }

        if (action_audio_end) {


          var args = {};


          // console.log(cthis, selfClass._sourcePlayer)


          action_audio_end(cthis, args);
        }
      }, 200);

    }


    function

    handleResize(e, pargs) {


      var margs = {

        'called_from': 'default'
      }

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      if (cthis) {

      }

      // console.log('handleResize()', e, margs);

      ww = $(window).width();
      cthisWidth = cthis.width();
      th = cthis.height();


      if ($scrubBgCanvas && typeof ($scrubBgCanvas.width) === 'function') {
        canvasWidth = $scrubBgCanvas.width();
        canh = $scrubBgCanvas.height();

      }


      if (cthisWidth <= 720) {
        cthis.addClass('under-720');
      } else {

        cthis.removeClass('under-720');
      }
      if (cthisWidth <= 500) {
        // -- width under 500


        // -- move
        if (cthis.hasClass('under-500') === false) {
          if (o.design_skin === 'skin-wave' && selfClass.skinwave_mode === 'normal') {
            selfClass._apControls.append(selfClass._metaArtistCon);
          }
        }

        cthis.addClass('under-500');


      } else {
        // -- width under 500


        if (cthis.hasClass('under-500') === false) {
          if (o.design_skin === 'skin-wave' && selfClass.skinwave_mode === 'normal') {
            // selfClass._apControls.append(selfClass._metaArtistCon);
            selfClass._conPlayPauseCon.after(selfClass._metaArtistCon);
          }
        }

        cthis.removeClass('under-500');
      }


      scrubbarWidth = cthisWidth;
      if (o.design_skin === 'skin-default') {
        scrubbarWidth = cthisWidth;
      }
      if (o.design_skin === 'skin-pro') {
        scrubbarWidth = cthisWidth;
      }
      if (o.design_skin === 'skin-silver' || o.design_skin === 'skin-aria') {
        scrubbarWidth = cthisWidth;

        scrubbarWidth = selfClass._scrubbar.width();
        //console.log(sw);


      }


      if (o.design_skin === 'skin-justthumbandbutton') {
        cthisWidth = cthis.children('.audioplayer-inner').outerWidth();
        scrubbarWidth = cthisWidth;
      }
      if (o.design_skin === 'skin-redlights' || o.design_skin === 'skin-steel') {
        scrubbarWidth = selfClass._scrubbar.width();
      }


      //console.log(sw);


      if (o.design_skin === 'skin-wave') {
        scrubbarWidth = selfClass._scrubbar.outerWidth(false);
        // console.log('scrubbar width - ', sw, selfClass._scrubbar);

        scrubbar_h = selfClass._scrubbar.outerHeight(false);

        if (selfClass._commentsHolder) {

          selfClass._commentsHolder.css({
            'width': scrubbarWidth
          })

          selfClass._commentsHolder.addClass('active');


        }

      }

      //console.log(o.design_skin, tw, sw);


      if (res_thumbh === true) {

        //                    console.log(cthis.get(0).style.height);


        if (o.design_skin === 'skin-default') {


          if (cthis.get(0) !== undefined) {
            // if the height is auto then
            if (cthis.get(0).style.height === 'auto') {
              cthis.height(200);
            }
          }

          var cthis_height = selfClass._audioplayerInner.height();
          if (typeof cthis.attr('data-initheight') === 'undefined' && cthis.attr('data-initheight') !== '') {
            cthis.attr('data-initheight', selfClass._audioplayerInner.height());
          } else {
            cthis_height = Number(cthis.attr('data-initheight'));
          }

          // console.log('cthis_height - ', cthis_height, cthis.attr('data-initheight'));

          if (o.design_thumbh === 'default') {

            design_thumbh = cthis_height - 44;
          }

        }

        selfClass._audioplayerInner.find('.the-thumb').eq(0).css({
          // 'height': design_thumbh
        })
      }


      //===display none + overflow hidden hack does not work .. yeah
      //console.log(cthis, selfClass._scrubbar.children('.scrub-bg').width());

      if (cthis.css('display') !== 'none') {
        selfClass._scrubbar.find('.scrub-bg-img').eq(0).css({
          'width': selfClass._scrubbar.children('.scrub-bg').width()
        });
        selfClass._scrubbar.find('.scrub-prog-img').eq(0).css({
          'width': selfClass._scrubbar.children('.scrub-bg').width()
        });
      }


      // console.log('is_under_400 - ',is_under_400);
      // console.log('tw - ',tw);
      cthis.removeClass('under-240 under-400');
      if (cthisWidth <= 240) {
        cthis.addClass('under-240');
      }
      if (cthisWidth <= 500) {
        cthis.addClass('under-400');

        if (is_under_400 === false) {
          is_under_400 = true;
        }
        if (selfClass.$controlsVolume) {
        }

      } else {


        if (is_under_400 === true) {
          is_under_400 = false;
        }
      }


      var aux2 = 50;

      // console.log('o.design_skin - ', o.design_skin, cthis);
      // -- skin-wave
      if (o.design_skin === 'skin-wave') {


        var sh = selfClass._scrubbar.eq(0).height();


        if (selfClass.skinwave_mode === 'small') {
          sh = 5;


        }


        // ---------- calculate dims small
        if (selfClass.skinwave_mode === 'small') {
          scrubbarWidth = selfClass._scrubbar.width();
        }


        if (o.skinwave_wave_mode === 'canvas') {
          if (cthis.attr('data-pcm')) {
            if (selfClass._scrubbarbg_canvas.width() === 100) {
              selfClass._scrubbarbg_canvas.width(selfClass._scrubbar.width());
            }
            // console.log('selfClass.data_source - ', selfClass.data_source);
            if (selfClass.data_source !== 'fake') {
              // -- if inter definied then clear timeout and call
              if (draw_canvas_inter) {
                clearTimeout(draw_canvas_inter);
                draw_canvas_inter = setTimeout(draw_canvas_inter_func, 300);
              } else {
                draw_canvas_inter_func();
                draw_canvas_inter = 1;
              }
            }
          }
        }
      }


      if (o.design_skin === 'skin-minimal') {


        // console.log('skin_minimal_button_size - ' ,skin_minimal_button_size);

        skin_minimal_button_size = selfClass._apControls.width();
        if (selfClass.skin_minimal_canvasplay) {
          selfClass.skin_minimal_canvasplay.style.width = skin_minimal_button_size;
          selfClass.skin_minimal_canvasplay.width = skin_minimal_button_size;
          selfClass.skin_minimal_canvasplay.style.height = skin_minimal_button_size;
          selfClass.skin_minimal_canvasplay.height = skin_minimal_button_size;


          // skin_minimal_button_size = sanitize_to_css_size(skin_minimal_button_size);


          $(selfClass.skin_minimal_canvasplay).css({
            'width': skin_minimal_button_size
            , 'height': skin_minimal_button_size
          });
        }


      }


      if (o.design_skin === 'skin-default') {
        if (selfClass.$currTime) {
          //console.log(o.design_skin, parseInt(selfClass._metaArtistCon.css('left'),10) + selfClass._metaArtistCon.outerWidth() + 10);
          var _metaArtistCon_l = parseInt(selfClass._metaArtistCon.css('left'), 10);
          var _metaArtistCon_w = selfClass._metaArtistCon.outerWidth();

          if (selfClass._metaArtistCon.css('display') === 'none') {
            selfClass._metaArtistCon_w = 0;
          }
          if (isNaN(selfClass._metaArtistCon_l)) {
            selfClass._metaArtistCon_l = 20;
          }
        }

      }

      if (o.design_skin === 'skin-minion') {
        //console.log();
        aux2 = parseInt(selfClass.$conControls.find('.con-playpause').eq(0).offset().left, 10) - parseInt(selfClass.$conControls.eq(0).offset().left, 10) - 18;
        selfClass.$conControls.find('.prev-btn').eq(0).css({
          'top': 0,
          'left': aux2
        })
        aux2 += 36;
        selfClass.$conControls.find('.next-btn').eq(0).css({
          'top': 0,
          'left': aux2
        })
      }


      if (o.embedded === 'on') {
        //console.log(window.frameElement)
        if (window.frameElement) {
          //window.frameElement.height = cthis.height();
          //console.log(window.frameElement.height, cthis.outerHeight())


          var args = {
            height: cthis.outerHeight()
          };


          if (o.embedded_iframe_id) {

            args.embedded_iframe_id = o.embedded_iframe_id;
          }


          var message = {
            name: "resizeIframe",
            params: args
          };
          window.parent.postMessage(message, '*');
        }

      }


      view_drawScrubProgress();

      // draw_curr_time();


      if (o.settings_trigger_resize > 0) {

        if (o.parentgallery && $(o.parentgallery).get(0) !== undefined && $(o.parentgallery).get(0).api_handleResize !== undefined) {
          $(o.parentgallery).get(0).api_handleResize();
        }
      }

    }


    function

    draw_canvas_inter_func() {
      // console.log('draw_canvas_inter_func', 'skinwave_wave_mode_canvas_waves_number - ', o.skinwave_wave_mode_canvas_waves_number);


      // console.log(cthis,"_scrubbarbg_canvas.get(0) -> ",_scrubbarbg_canvas.get(0));
      dzsapWaveFunctions.view_drawCanvases(selfClass, cthis.attr('data-pcm'), 'canvas_normal_pcm');

      draw_canvas_inter = 0;
    }

    function

    volume_handleMouse(e) {
      var _t = $(this);
      /**
       * from 0 to 1
       * @type number
       */
      var mouseXRelativeToVolume = null;

      //var mx = e.clientX - selfClass.$controlsVolume.offset().left;
      if (selfClass.$controlsVolume.find('.volume_static').length) {

        mouseXRelativeToVolume = Number((e.pageX - (selfClass.$controlsVolume.find('.volume_static').eq(0).offset().left)) / (selfClass.$controlsVolume.find('.volume_static').eq(0).width()));
      }

      if (!mouseXRelativeToVolume) {
        return false;
      }
      if (e.type === 'mousemove') {
        if (volume_dragging) {

          if (_t.parent().hasClass('volume-holder') || _t.hasClass('volume-holder')) {
            // todo: nothing ?
          }

          if (o.design_skin === 'skin-redlights') {
            mouseXRelativeToVolume *= 10;
            mouseXRelativeToVolume = Math.round(mouseXRelativeToVolume);
            //console.log(mouseXRelativeToVolume);
            mouseXRelativeToVolume /= 10;
          }


          volume_setVolume(mouseXRelativeToVolume, {
            call_from: "set_by_mousemove"
          });
          isMuted = false;
        }

      }
      if (e.type === 'mouseleave') {

      }
      if (e.type === 'click') {

        //console.log(_t, _t.offset().left)


        if (_t.parent().hasClass('volume-holder')) {


          mouseXRelativeToVolume = 1 - ((e.pageY - (selfClass.$controlsVolume.find('.volume_static').eq(0).offset().top)) / (selfClass.$controlsVolume.find('.volume_static').eq(0).height()));

        }
        if (_t.hasClass('volume-holder')) {
          mouseXRelativeToVolume = 1 - ((e.pageY - (selfClass.$controlsVolume.find('.volume_static').eq(0).offset().top)) / (selfClass.$controlsVolume.find('.volume_static').eq(0).height()));

          // console.log(mouseXRelativeToVolume);

        }

        //console.log(mouseXRelativeToVolume);

        volume_setVolume(mouseXRelativeToVolume, {
          call_from: "set_by_mouseclick"
        });
        isMuted = false;
      }

      if (e.type === 'mousedown') {

        volume_dragging = true;
        cthis.addClass('volume-dragging');


        if (_t.parent().hasClass('volume-holder')) {


          mouseXRelativeToVolume = 1 - ((e.pageY - (selfClass.$controlsVolume.find('.volume_static').eq(0).offset().top)) / (selfClass.$controlsVolume.find('.volume_static').eq(0).height()));

        }

        // console.log('mouseXRelativeToVolume - ', mouseXRelativeToVolume);

        volume_setVolume(mouseXRelativeToVolume, {
          call_from: "set_by_mousedown"
        });
        isMuted = false;
      }
      if (e.type === 'mouseup') {

        volume_dragging = false;
        cthis.removeClass('volume-dragging');

      }

    }

    function handleMouseOnScrubbar(e) {
      var mousex = e.pageX;


      if ($(e.target).hasClass('sample-block-start') || $(e.target).hasClass('sample-block-end')) {
        return false;
      }

      if (e.type === 'mousemove') {
        selfClass._scrubbar.children('.scrubBox-hover').css({
          'left': (mousex - selfClass._scrubbar.offset().left)
        });


        if (o.scrub_show_scrub_time === 'on') {

          // console.log('selfClass.$currTime - ',selfClass.$currTime);

          if (selfClass.timeModel.getVisualTotalTime()) {
            var aux = (mousex - selfClass._scrubbar.offset().left) / selfClass._scrubbar.outerWidth() * selfClass.timeModel.getVisualTotalTime();


            if (selfClass.$currTime) {
              selfClass.$currTime.html(dzsapHelpers.formatTime(aux));
              selfClass.$currTime.addClass('scrub-time');

            }

            isScrubShowingCurrentTime = true;
          }
        }

      }
      if (e.type === 'mouseleave') {

        isScrubShowingCurrentTime = false;

        if (selfClass.$currTime) {
          selfClass.$currTime.removeClass('scrub-time');

        }

        view_drawCurrentTime();

      }
      if (e.type === 'click') {


        if (cthis.hasClass('prevent-bubble')) {

          if (e && e.stopPropagation) {
            e.preventDefault();
            e.stopPropagation();

            // return false;
          }
        }


        if (scrubbarWidth === 0) {

          scrubbarWidth = selfClass._scrubbar.width();
        }
        if (scrubbarWidth === 0) {
          scrubbarWidth = 300;
        }
        var targetPositionOnScrub = ((e.pageX - (selfClass._scrubbar.offset().left)) / (scrubbarWidth) * selfClass.timeModel.getVisualTotalTime());


        if (selfClass.pseudo_sample_time_start === 0) {

          if (selfClass.sample_time_start > 0) {
            targetPositionOnScrub -= selfClass.sample_time_start;
          }
        }

        if (selfClass._actualPlayer) {


          setTimeout(function () {
            if (selfClass._actualPlayer.get(0) && selfClass._actualPlayer.get(0).api_pause_media) {

              selfClass._actualPlayer.get(0).api_seek_to_perc(targetPositionOnScrub / selfClass.timeModel.getVisualTotalTime(), {
                'call_from': 'from_feeder_to_feed'
              });
            }
          }, 50);
        }


        seek_to(targetPositionOnScrub, {
          'call_from': 'handleMouseOnScrubbar'
        });

        if (o.autoplay_on_scrub_click === 'on') {

          if (selfClass.player_playing === false) {
            play_media({
              'called_from': 'handleMouseOnScrubbar'
            });
          }
        }

        if (cthis.hasClass('from-wc_loop')) {
          return false;
        }
      }

    }

    function

    seek_to_perc(argperc, pargs) {
      seek_to((argperc * selfClass.timeModel.getVisualTotalTime()), pargs);
    }

    /**
     * seek to seconds
     * @param targetTimeMediaScrub - number of settings
     * @param pargs -- optiona arguments
     * @returns {boolean}
     */
    function

    seek_to(targetTimeMediaScrub, pargs) {
      //arg = nr seconds

      var margs = {
        'call_from': 'default'
        , 'deeplinking': 'off' // -- default or "auto" or "user action"
        , 'call_from_type': 'default' // -- default or "auto" or "user action"
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      if (margs.call_from === 'from_feeder_to_feed') {

      }
      // console.log('%c seek_to() - margs - ', ConstantsDzsAp.DEBUG_STYLE_1, margs, 'arg - ', targetTimeMediaScrub);
      // console.trace();

      if (margs.deeplinking === 'on') {
        var newlink = dzsapHelpers.add_query_arg(window.location.href, 'audio_time', targetTimeMediaScrub);


        var stateObj = {foo: "bar"};
        history.pushState(stateObj, null, newlink);
      }


      // console.log('seek_to arg - ',arg, 'type - ',type, cthis);
      targetTimeMediaScrub = dzsapHelpers.sanitizeToIntFromPointTime(targetTimeMediaScrub);


      // console.log('targetTime before sample time start', targetTime, 'selfClass.timeModel.sampleTimeEnd - ', selfClass.timeModel.sampleTimeEnd);
      targetTimeMediaScrub = selfClass.timeModel.getActualTargetTime(targetTimeMediaScrub);
      // console.log('targetTime after sample time start', targetTime);


      // console.log('cthis.hasClass(\'first-played\') - ',cthis.hasClass('first-played'));

      // console.log('curr_time_first_set - ',curr_time_first_set);
      if (selfClass._actualPlayer) {
        var args = {
          type: selfClass.actualDataTypeOfMedia,
          fakeplayer_is_feeder: 'on'
        }
        if (selfClass._actualPlayer.length && selfClass._actualPlayer.data('feeding-from') !== cthis.get(0)) {
          // -- the actualPlayer is not rendering this feed player
          if (margs.call_from !== 'handle_end' && margs.call_from !== 'from_playfrom' && margs.call_from !== 'last_pos' && margs.call_from !== 'playlist_seek_from_0') {
            // -- if it is not user action, ( handle_end or anything else )
            args.called_from = 'seek_to from player source->' + (cthis.attr('data-source')) + ' < -  ' + 'old call from - ' + margs.call_from;
            if (selfClass._actualPlayer.get(0).api_change_media) {
              selfClass._actualPlayer.get(0).api_change_media(cthis, args);
            } else {
              console.log('not inited ? ', selfClass._actualPlayer);
            }
          } else {
            // -- NORMAL call

            cthis.data('promise-to-play-footer-player-from', targetTimeMediaScrub);
          }
        }


        setTimeout(function () {

          if (selfClass._actualPlayer.get(0) && selfClass._actualPlayer.get(0).api_pause_media) {
            if (margs.call_from !== 'from_playfrom' && margs.call_from !== 'last_pos') {
              selfClass._actualPlayer.get(0).api_seek_to(targetTimeMediaScrub, {
                'call_from': 'from_feeder_to_feed'
              });
            }
          }
        }, 50);

        return false;
      }


      if (selfClass.audioType === 'youtube') {
        try {
          selfClass.$mediaNode_.seekTo(targetTimeMediaScrub);
        } catch (err) {
          console.log('yt seek err - ', err);
        }
      }

      handleEnterFrame({
        'fire_only_once': true
      })
      setTimeout(function () {
        handleEnterFrame({
          'fire_only_once': true
        })
      }, 20);


      if (selfClass.audioType === 'selfHosted') {
        if (0) {

          //console.log('arg - ',arg);
          selfClass.lastTimeInSeconds = targetTimeMediaScrub;

          pause_media({
            'audioapi_setlasttime': false
          });
          play_media({
            'called_from': 'audio_buffer ( seek_to() )'
          });
        } else {

          // console.log('seek to -> ', arg);
          if (selfClass.$mediaNode_ && typeof (selfClass.$mediaNode_.currentTime) !== 'undefined') {

            try {
              selfClass.$mediaNode_.currentTime = targetTimeMediaScrub;
            } catch (e) {
              console.log('error on scrub', e, ' arg - ', targetTimeMediaScrub);

            }

            // console.log('selfClass.$mediaNode_.currentTime -> ',selfClass.$mediaNode_.currentTime);
          }

          return false;

        }

      }


    }

    /**
     * seek to ( only visual )
     * @param argperc
     */
    function

    seek_to_visual(argperc) {


      curr_time_first_set = true;


      handleEnterFrame({
        'fire_only_once': true
      })
      setTimeout(function () {
        handleEnterFrame({
          'fire_only_once': true
        })
      }, 20);
    }

    /**
     * playback speed
     * @param {float} arg 0 - 10
     */
    function

    set_playback_speed(arg) {

      if (selfClass.audioType === 'youtube') {
        selfClass.$mediaNode_.setPlaybackRate(arg);
      }
      if (selfClass.audioType === 'selfHosted') {
        selfClass.$mediaNode_.playbackRate = arg;

      }

    }

    /**
     * outputs a volume from 0 to 1
     * @param {number} arg 0 <-> 1
     * @param pargs
     * @returns {boolean}
     */
    function

    volume_setVolume(arg, pargs) {

      var margs = {

        'call_from': 'default'
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      if (arg > 1) {
        arg = 1;
      }
      if (arg < 0) {
        arg = 0;
      }

      // console.log('[dzsap] [volume] volume_setVolume()', arg, margs, selfClass.cthis);


      if (margs.call_from === 'from_fake_player_feeder_from_init_loaded') {
        // -- lets prevent call from the init_loaded set_volume if the volume has been changed
        if (selfClass._sourcePlayer) {
          if (o.default_volume !== 'default') {
            volume_set_by_user = true;
          }
          if (volume_set_by_user) {
            return false;
          } else {
            volume_set_by_user = true;
            // console.log("SET VOLUME BY USER", cthis);
          }
        }
      }

      if (margs.call_from === 'set_by_mouseclick' || margs.call_from === 'set_by_mousemove') {
        volume_set_by_user = true;
      }

      // console.log("set_volume()",arg, cthis, margs);

      if (selfClass.audioType === 'youtube') {
        if (selfClass.$mediaNode_ && selfClass.$mediaNode_.setVolume) {
          selfClass.$mediaNode_.setVolume(arg * 100);
        }
      }
      if (selfClass.audioType === 'selfHosted') {
        if (selfClass.$mediaNode_) {

          selfClass.$mediaNode_.volume = arg;
        } else {
          if (selfClass.$mediaNode_) {
            $(selfClass.$mediaNode_).attr('preload', 'metadata');
          }
        }
      }

      //console.log(selfClass.$controlsVolume.children('.volume_active'));


      volume_setOnlyVisual(arg, margs);

      if (selfClass._sourcePlayer) {
        margs.call_from = ('from_fake_player')
        if (selfClass._sourcePlayer.get(0) && selfClass._sourcePlayer.get(0).api_visual_set_volume(arg, margs)) {
          selfClass._sourcePlayer.get(0).api_visual_set_volume(arg, margs);
        }
      }

      if (selfClass._actualPlayer) {
        // console.log('try to set volume on actual player ( fake player ) ', 'selfClass._actualPlayer - ', selfClass._actualPlayer, margs);
        if (margs.call_from !== ('from_fake_player')) {
          // margs.call_from = ('from_fake_player_feeder')
          if (margs.call_from === 'from_init_loaded') {

            margs.call_from = ('from_fake_player_feeder_from_init_loaded')
          } else {

            margs.call_from = ('from_fake_player_feeder')
          }
          if (selfClass._actualPlayer && selfClass._actualPlayer.get(0) && selfClass._actualPlayer.get(0).api_set_volume) {
            selfClass._actualPlayer.get(0).api_set_volume(arg, margs);
          }
        }
      }

    }


    function volume_setOnlyVisual(arg, margs) {

      // console.log('')


      if (selfClass.$controlsVolume.hasClass('controls-volume-vertical')) {
        selfClass.$controlsVolume.find('.volume_active').eq(0).css({
          'height': (selfClass.$controlsVolume.find('.volume_static').eq(0).height() * arg)
        });
      } else {

        if (selfClass.initOptions.design_skin === 'skin-redlights') {

          selfClass.$controlsVolume.find('.volume_active').eq(0).css({
            'clip-path': 'inset(0% ' + (Math.abs(1 - arg) * 100) + '% 0% 0%)'
          });
        } else {

          selfClass.$controlsVolume.find('.volume_active').eq(0).css({
            'width': (selfClass.$controlsVolume.find('.volume_static').eq(0).width() * arg)
          });
        }
      }


      if (o.design_skin === 'skin-wave' && o.skinwave_dynamicwaves === 'on') {
        //console.log(arg);
        selfClass._scrubbar.find('.scrub-bg-img').eq(0).css({
          'transform': 'scaleY(' + arg + ')'
        })
        selfClass._scrubbar.find('.scrub-prog-img').eq(0).css({
          'transform': 'scaleY(' + arg + ')'
        })

      }


      if (localStorage !== null && selfClass.the_player_id) {

        //console.log(selfClass.the_player_id);

        localStorage.setItem('dzsap_last_volume_' + selfClass.the_player_id, arg);

      }

      volume_lastVolume = arg;
    }


    function volume_handleClickMuteIcon(e) {

      if (isMuted === false) {
        last_vol_before_mute = volume_lastVolume;
        volume_setVolume(0, {
          call_from: "from_mute"
        });
        isMuted = true;
      } else {
        volume_setVolume(last_vol_before_mute, {
          call_from: "from_unmute"
        });
        isMuted = false;
      }
    }

    function pause_media_visual(pargs) {


      var margs = {
        'call_from': 'default'
      };


      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      selfClass.$conPlayPause.removeClass('playing');
      cthis.removeClass('is-playing');
      selfClass.player_playing = false;

      //console.log("PAUSE MEDIA VISUAL")


      if (cthis.parent().hasClass('zoomsounds-wrapper-bg-center')) {
        cthis.parent().removeClass('is-playing');
      }
      if (selfClass.$reflectionVisualObject) {
        selfClass.$reflectionVisualObject.removeClass('is-playing');
      }

      if (o.parentgallery) {
        o.parentgallery.removeClass('player-is-playing');
      }


      isNotRenderingEnterFrame = true;


      if (action_audio_pause) {
        action_audio_pause(cthis);
      }
    }

    function pause_media(pargs) {
      //console.log('pause_media()', cthis);


      var margs = {
        'audioapi_setlasttime': true,
        'donot_change_media': false,
        'call_actual_player': true,
      };

      if (destroyed) {
        return false;
      }

      if (pargs) {
        margs = $.extend(margs, pargs);
      }


      pause_media_visual({
        'call_from': 'pause_media'
      });


      if (margs.call_actual_player && margs.donot_change_media !== true) {
        if (selfClass._actualPlayer !== null) {
          var args = {
            type: selfClass.actualDataTypeOfMedia,
            fakeplayer_is_feeder: 'on'
          }
          if (selfClass._actualPlayer && selfClass._actualPlayer.length && selfClass._actualPlayer.data('feeding-from') !== cthis.get(0)) {
            args.called_from = 'pause_media from player ' + cthis.attr('data-source');
            selfClass._actualPlayer.get(0).api_change_media(cthis, args);
          }
          setTimeout(function () {
            if (selfClass._actualPlayer.get(0) && selfClass._actualPlayer.get(0).api_pause_media) {
              selfClass._actualPlayer.get(0).api_pause_media();
            }
          }, 100);

          selfClass.player_playing = false;
          return;
        }
      }


      mediaFunctions.media_pause(selfClass, () => {
        // console.log('selfClass._sourcePlayer - ', selfClass._sourcePlayer, '(cthis) - ', cthis);
        if (selfClass._sourcePlayer) {
          if (selfClass._sourcePlayer.get(0) && selfClass._sourcePlayer.get(0).api_pause_media_visual) {
            selfClass._sourcePlayer.get(0).api_pause_media_visual({
              'call_from': 'pause_media in child player'
            });
          }
        }
      })


      selfClass.player_playing = false;


    }

    function play_media_visual(margs) {


      //return false;
      selfClass.player_playing = true;
      isNotRenderingEnterFrame = false;

      //return false;
      cthis.addClass('is-playing');
      cthis.addClass('first-played');

      if (selfClass.$reflectionVisualObject) {
        selfClass.$reflectionVisualObject.addClass('is-playing');
      }
      if (o.parentgallery) {
        o.parentgallery.addClass('player-is-playing');
      }

      if (selfClass.classFunctionalityInnerPlaylist) {
        selfClass.classFunctionalityInnerPlaylist.player_determineSyncPlayersIndex(selfClass, selfClass._sourcePlayer);
      }
      dzsapHelpers.view_player_globalDetermineSyncPlayersIndex(selfClass);
      // console.log('window.dzsap_syncList_index - ', window.dzsap_syncList_index, window.dzsap_syncList_players);

      dzsapHelpers.view_player_playMiscEffects(selfClass);


      if (selfClass.$stickToBottomContainer) {
        selfClass.$stickToBottomContainer.addClass('audioplayer-loaded');
      }

      //console.log(cthis, margs);

      if (action_audio_play) {
        action_audio_play(cthis);
      }
      if (action_audio_play2) {
        action_audio_play2(cthis);
      }


    }

    function play_media(pargs) {

      //                console.log(dzsap_list);


      var margs = {
        'api_report_play_media': true
        , 'called_from': 'default'
        , 'retry_call': 0
      }
      if (pargs) {
        margs = $.extend(margs, pargs)
      }

      if (!selfClass.isSetupedMedia) {
        setup_media({'called_from': margs.called_from + '[play_media .. not setuped]'});
      }


      // console.log('.play_media() -3 ',margs,cthis, 'selfClass.$mediaNode_ - ', selfClass.$mediaNode_);
      //return false ;
      //return;

      if (margs.called_from === 'api_sync_players_prev') {
        // console.log('o.parentgallery - ',o.parentgallery);

        player_index_in_gallery = cthis.parent().children('.audioplayer,.audioplayer-tobe').index(cthis);

        if (o.parentgallery && o.parentgallery.get(0) && o.parentgallery.get(0).api_goto_item) {
          o.parentgallery.get(0).api_goto_item(player_index_in_gallery);
        }
      }
      // console.log('selfClass.spectrum_audioContext_buffer - ', selfClass.spectrum_audioContext_buffer);
      if (dzsapHelpers.is_ios() && selfClass.spectrum_audioContext_buffer === 'waiting') {
        setTimeout(function () {
          pargs.call_from_aux = 'waiting audioCtx_buffer or ios';
          play_media(pargs);
        }, 500);
        return false;
      }

      if (margs.called_from === 'click_playpause') {
        // -- lets setup the playlist
      }


      if (cthis.hasClass('media-setuped') === false && selfClass._actualPlayer === null) {
        console.log('warning: media not setuped, there might be issues', cthis.attr('id'));
      }


      if (margs.called_from.indexOf('feed_to_feeder') > -1) {
        if (cthis.hasClass('dzsap-loaded') === false) {
          init_loaded();
          var delay = 300;
          if (dzsapHelpers.is_android_good()) {
            delay = 0;
          }
          if (margs.call_from_aux !== 'with delay') {
            if (delay) {
              setTimeout(function () {
                margs.call_from_aux = 'with delay';
                play_media(margs);
              }, delay);
            } else {
              play_media(margs);
            }
            return false;
          }

        }
      }


      //console.log(o.type);
      if (selfClass.audioType !== 'fake') {

        //return false;
      }


      dzsapHelpers.player_stopOtherPlayers(dzsap_list, selfClass);


      if (destroyed_for_rebuffer) {
        setup_media({
          'called_from': 'play_media() .. destroyed for rebuffer'
        });
        if (dzsHelpers.isInt(selfClass.playFrom)) {
          seek_to(selfClass.playFrom, {
            'call_from': 'destroyed_for_rebuffer_playfrom'
          });
        }
        destroyed_for_rebuffer = false;
      }

      // console.log(o.google_analytics_send_play_event, window._gaq, google_analytics_sent_play_event);
      if (o.google_analytics_send_play_event === 'on' && window._gaq && google_analytics_sent_play_event === false) {
        //if(window.console){ console.log( 'sent event'); }
        window._gaq.push(['_trackEvent', 'ZoomSounds Play', 'Play', 'zoomsounds play - ' + dataSrc]);
        google_analytics_sent_play_event = true;
      }
      // console.log(o.google_analytics_send_play_event, window.ga, google_analytics_sent_play_event);

      if (!window.ga) {
        if (window.__gaTracker) {
          window.ga = window.__gaTracker;
        }
      }

      if (o.google_analytics_send_play_event === 'on' && window.ga && google_analytics_sent_play_event === false) {
        if (window.console) {
          console.log('sent event');
        }
        google_analytics_sent_play_event = true;
        window.ga('send', {
          hitType: 'event',
          eventCategory: 'zoomsounds play - ' + dataSrc,
          eventAction: 'play',
          eventLabel: 'zoomsounds play - ' + dataSrc
        });
      }

      //===media functions

      if (selfClass._sourcePlayer) {

        //console.log(cthis, selfClass._sourcePlayer);

        if (selfClass._sourcePlayer.get(0) && selfClass._sourcePlayer.get(0).api_pause_media_visual) {
          selfClass._sourcePlayer.get(0).api_play_media_visual({
            'api_report_play_media': false
          });
        }

      }

      // console.log("TYPE IS ",type, selfClass._actualPlayer);

      if (selfClass._actualPlayer) {
        // -- the actual player is the footer player

        //console.log("SUBMIT PLAY TO fakeplayer", selfClass._actualPlayer);
        var args = {
          type: selfClass.actualDataTypeOfMedia,
          fakeplayer_is_feeder: 'on',
          call_from: 'play_media_audioplayer'
        }

        try {
          if (margs.called_from === 'click_playpause') {
            // -- let us reset up the playlist


            if (o.parentgallery) {
              o.parentgallery.get(0).api_regenerate_sync_players_with_this_playlist();
              selfClass._actualPlayer.get(0).api_regenerate_playerlist_inner();
            }

            // console.log("we regenerate playlist here");
          }

          if (selfClass._actualPlayer && selfClass._actualPlayer.length && selfClass._actualPlayer.data('feeding-from') !== cthis.get(0)) {

            args.called_from = 'play_media from player 22 ' + cthis.attr('data-source') + ' < -  ' + 'old call from - ' + margs.called_from;

            if (selfClass._actualPlayer.get(0).api_change_media) {
              selfClass._actualPlayer.get(0).api_change_media(cthis, args);
            }

            if (cthis.hasClass('first-played') === false) {
              if (cthis.data('promise-to-play-footer-player-from')) {
                seek_to(cthis.data('promise-to-play-footer-player-from'));
                setTimeout(function () {
                  cthis.data('promise-to-play-footer-player-from', '');
                }, 1000);
              }
            }

          }
          setTimeout(function () {
            if (selfClass._actualPlayer.get(0) && selfClass._actualPlayer.get(0).api_play_media) {
              selfClass._actualPlayer.get(0).api_play_media({
                'called_from': '[feed_to_feeder]'
              });
            }
          }, 100);


          // console.log('ajax view submitted', cthis, selfClass.ajax_view_submitted);
          if (selfClass.ajax_view_submitted === 'off') {
            (ajax_submit_views.bind(selfClass))();
          }
          return;


        } catch (err) {
          console.log('no fake player..', err);
        }
      }


      if (selfClass.audioType === 'youtube') {
        dzsap_youtube_playMedia(selfClass, margs, selfClass.youtube_currentId);
      }
      if (selfClass.audioType === 'selfHosted') {


      }


      if (selfClass.audioType === 'youtube') {
        play_media_visual(margs);
      }

      mediaFunctions.media_tryToPlay(selfClass, () => {

        //return false;
        play_media_visual(margs);


        if (o.scrubbar_type === 'wave' && o.skinwave_enableSpectrum === 'on') {
          dzsapHelpers.player_initSpectrum(selfClass);
        }


        //console.log(selfClass.ajax_view_submitted);


        if (selfClass._sourcePlayer) {
          window.dzsap_currplayer_focused = selfClass._sourcePlayer.get(0);
          if (selfClass._sourcePlayer.get(0) && selfClass._sourcePlayer.get(0).api_pause_media_visual) {
            selfClass._sourcePlayer.get(0).api_try_to_submit_view();
          }

        } else {

          window.dzsap_currplayer_focused = cthis.get(0);
          service_submitView();
        }


        if (selfClass.keyboard_controls.play_trigger_step_back === 'on') {
          if (dzsap_currplayer_focused) {
            dzsap_currplayer_focused.api_step_back(selfClass.keyboard_controls.step_back_amount);
          }
        }
      }, (err) => {
        console.log('error autoplay playing -  ', err);
        setTimeout(() => {
          pause_media();
          console.log('trying to pause')
        }, 30);
      })


    }


    function service_submitView() {
      // console.log('try_to_submit_view', cthis, selfClass.ajax_view_submitted);
      if (selfClass.ajax_view_submitted === 'auto') {
        selfClass.ajax_view_submitted = 'off';
      }
      if (selfClass.ajax_view_submitted === 'off') {

        (ajax_submit_views.bind(selfClass))();
      }
    }


  }
}


function register_dzsap_plugin() {
  (function ($) {


    window.dzsap_list_for_sync_build = function () {
    };


    Math.easeIn = function (t, b, c, d) {
      // console.log('math.easein')

      return -c * (t /= d) * (t - 2) + b;

    };


    dzsapHelpers.assignHelperFunctionsToJquery($);


    // -- define player here
    $.fn.audioplayer = function (argOptions) {
      var finalOptions = {};
      var defaultOptions = Object.assign({}, require('./configs/_settingsPlayer').default_opts);
      finalOptions = dzsapHelpers.convertPluginOptionsToFinalOptions(this, defaultOptions, argOptions);


      // console.log('finalOptions -- ',finalOptions);
      this.each(function () {
        var _ap = new DzsAudioPlayer(this, finalOptions, $);
        return this;
      })
    }


    // -- defined gallery here
    // --
    // AUDIO GALLERY
    // --


    dzsapPlaylist.registerToJquery($);


  })(jQuery);
}

window.dzsap_singleton_ready_calls_is_called = false;
window.dzsap_singleton_ready_calls = function () {

  window.dzsap_singleton_ready_calls_is_called = true;


  jQuery('body').append('<style class="dzsap--style"></style>');

  window.dzsap__style = jQuery('.dzsap--style');


  // -- remove focus on input focus
  jQuery(document).on('focus.dzsap', 'input', function () {
    // console.log("FOCUS - ");
    window.dzsap_currplayer_focused = null;
  })
  dzsapHelpers.registerTextWidth(jQuery);
}

window.dzsap_get_base_url = function () {

  window.dzsap_base_url = dzsHelpers.getBaseUrl('dzsap_base_url', 'audioplayer.js');
}

function register_dzsap_callScriptsOnReady() {
  jQuery(document).ready(function ($) {


    // -- main call

    if (!window.dzsap_singleton_ready_calls_is_called) {
      window.dzsap_singleton_ready_calls();
    }


    $('audio.zoomsounds-from-audio').each(function () {
      var _t = $(this);
      //console.log(_t);

      _t.after('<div class="audioplayer-tobe auto-init skin-silver" data-source="' + _t.attr('src') + '"></div>');

      _t.remove();
    })


    dzsag_init('.audiogallery.auto-init', {
      init_each: true
    });


    dzsapHelpers.jQueryAuxBindings($);


  });


}


window.dzsap_currplayer_focused = null;
window.dzsap_currplayer_from_share = null;
window.dzsap_mouseover = false;


window.dzsap_init_allPlayers = function ($) {

  $('.audioplayer.auto-init,.audioplayer-tobe.auto-init').each(function () {
    var _t2 = $(this);

    if (_t2.hasClass('audioplayer-tobe') === true) {
      if (window.dzsap_init) {
        dzsap_init(_t2, {
          init_each: true
        });
      }
    }
  })
}


async function dzsap_jQueryInit(callback, reject) {

  return new Promise((resolve, reject) => {

    if (window.jQuery) {
      resolve('jQuery loaded');
    } else {
      var script = document.createElement('script');
      script.onload = function () {
        if (window.jQuery) {
          resolve('jQuery loaded');
        } else {
          reject('error loading');
        }
      };
      script.src = ConstantsDzsAp.URL_JQUERY;

      document.head.appendChild(script);
    }

    setTimeout(() => {
      reject('error loading');
    }, 15000);
  })
}

dzsap_jQueryInit().then(() => {

  register_dzsap_plugin();
  register_dzsap_callScriptsOnReady();
  // console.log('document.readyState - ', document.readyState);
  jQuery(document).ready(function ($) {
    // console.log('document.readyState - ', document.readyState);
    window.dzsap_init_allPlayers($)
  });
}).catch((err) => {
  console.log(err);
})


window.dzsap_init = function (selector, settings) {

  //console.log(selector);
  if (typeof (settings) !== "undefined" && typeof (settings.init_each) !== "undefined" && settings.init_each === true) {
    var element_count = 0;
    for (var e in settings) {
      element_count++;
    }
    if (element_count === 1) {
      settings = undefined;
    }

    jQuery(selector).each(function () {
      var _t = jQuery(this);
      if (settings && typeof (settings.call_from) === 'undefined') {
        settings.call_from = 'dzsap_init';
      }


      _t.audioplayer(settings)
    });
  } else {
    jQuery(selector).audioplayer(settings);
  }

  window.dzsap_lasto = settings;


  dzsapHelpers.dzsapInitjQueryRegisters();
};
dzsapHelpers.miscFunctions();
