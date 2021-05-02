import * as dzsapHelpers from "../_dzsap_helpers";

const dzsapMisc = require('../_dzsap_misc');
const dzsapWaveFunctions = require('../wave-render/_wave-render-functions');
import {ConstantsDzsAp} from "../../configs/_constants";

/**
 *
 * @param {DzsAudioPlayer} selfClass
 * @param $
 * @returns {function(*, *=): (boolean|undefined)}
 */
export function media_changeMedia(selfClass, $) {
  /**
   * change media source for the player / change_media("song.mp3", {type:"audio", fakeplayer_is_feeder:"off"});
   * @param {HTMLElement|string} _argSource - can be player dom element
   * @param pargs - {type:"audio", fakeplayer_is_feeder:"off"}
   * @returns {boolean}
   */
  return function (_argSource, pargs = {}) {


    var changeMediaArgsDefaults = {
      type: '',
      fakeplayer_is_feeder: 'off' // -- this is OFF in case there is a button feeding it, and on if it's an actual player
      , called_from: 'default'
      , source: 'default'
      , pcm: ''
      , artist: ""
      , song_name: ""
      , thumb: ""
      , thumb_link: ""
      , autoplay: "on"
      , cue: "on"
      , feeder_type: "player"
      , source_player_do_not_update: "off"
      , playerid: ""
    };


    selfClass.ajax_view_submitted = 'on'; // -- view submitted from caller

    // console.log('margs initial -> ',Object.assign({},margs));
    // console.log('pargs initial -> ',Object.assign({},pargs));
    var handle_resize_delay = 500;
    var changeMediaArgs = {...changeMediaArgsDefaults, ...pargs};
    var o = selfClass.initOptions;
    // margs = Object.assign(margs, pargs);
    // console.log("_argSource -",_argSource,'changeMediaArgs - ',Object.assign({},changeMediaArgs), 'pargs -5 ', Object.assign({},pargs));

    // console.log('%c change_media() -','background-color: #444; color: #dd5555;', changeMediaArgs, selfClass.cthis, pargs);
    var _sourceForChange = _argSource;


    // -- let us decide if we pause old player
    var isGoingToPauseTheOldPlayer = true; // pause previous player
    var isGoingToPauseTheActualPlayer = false; // pause if
    var isSourceAStringSource = false;
    var isSourceA$Object = false;

    let newSource = '';


    if(_sourceForChange && _sourceForChange.attr){
      isSourceA$Object = true;
    }
    //console.log('change_media', "margs - ", margs, cthis, selfClass._sourcePlayer, arg);

    selfClass.reinit_resetMetrics();
    selfClass.reinit_beforeChangeMedia();

    if (typeof _sourceForChange === 'string') {
      isSourceAStringSource = true;
    }

    $('.current-feeder-for-parent-player').removeClass('current-feeder-for-parent-player');

    if(selfClass.$reflectionVisualObject){
      selfClass.$reflectionVisualObject.removeClass('is-playing');
    }

    // console.log('_sourceForChange - ', _sourceForChange);

    if(isSourceAStringSource){
      newSource = _sourceForChange;
    }
    if (isSourceA$Object) {

      newSource = _sourceForChange.attr('data-source');
      selfClass.$reflectionVisualObject = _sourceForChange;
      changeMediaArgs = {...changeMediaArgs, ...dzsapHelpers.sanitizeObjectForChangeMediaArgs(_sourceForChange)};
    }
    if(changeMediaArgs.source && changeMediaArgs.source!='default'){
      newSource = changeMediaArgs.source;
    }



    if (selfClass.data_source === newSource) {
      isGoingToPauseTheOldPlayer = false;
    }

    // -- old feed fake player

    if (isGoingToPauseTheOldPlayer && selfClass._sourcePlayer) {
      selfClass._sourcePlayer.get(0).api_pause_media_visual({
        'call_from': 'change_media'
      });
      selfClass._sourcePlayer.get(0).api_set_timeVisualTotal(0);
    }

    // -- we are in one mode, so we need to preserve the originalSettings of the first item
    if (!(selfClass.cthis.data('original-settings')) && selfClass.data_source !== 'fake') {
      selfClass.cthis.data('original-settings', dzsapHelpers.sanitizeObjectForChangeMediaArgs(selfClass.cthis))
    }


    // console.log('changeMediaArgs here - ', {...changeMediaArgs});
    // console.log('changeMediaArgs here - ', {...changeMediaArgs});

    const oldSource = selfClass.data_source;
    selfClass.data_source = newSource;

    const isSourceHasClassForDomSource = !isSourceAStringSource && !!(_sourceForChange.hasClass('audioplayer') || _sourceForChange.hasClass('is-zoomsounds-source-player'));


    if ((isSourceHasClassForDomSource) || changeMediaArgs.fakeplayer_is_feeder === 'on') {

      selfClass.set_sourcePlayer(_sourceForChange)
      selfClass.cthis.data('feeding-from', selfClass._sourcePlayer.get(0));
      selfClass._sourcePlayer.addClass('current-feeder-for-parent-player');
    }

    if (!isSourceAStringSource && _sourceForChange) {
      if (_sourceForChange && _sourceForChange.attr('data-playerid')) {
        selfClass.cthis.attr('data-feed-playerid', _sourceForChange.attr('data-playerid'));
      } else {
        selfClass.cthis.attr('data-feed-playerid', '');
        changeMediaArgs.playerid = '';
      }
    }



    // console.log(oldSource, newSource, oldSource===newSource);
    if (oldSource === newSource) {
      if(selfClass.cthis.hasClass('is-playing')){
        selfClass.pause_media();
      }else{
        selfClass.play_media();
      }
      return false;
    }


    if (changeMediaArgs.type === 'detect' || changeMediaArgs.type === 'audio' || changeMediaArgs.type === 'normal') {
      changeMediaArgs.type = 'selfHosted';
    }


    selfClass.cthis.removeClass('meta-loaded');


    // -- footer placeholder
    if (selfClass.cthis.parent().hasClass('audioplayer-was-loaded')) {

      selfClass.cthis.parent().addClass('audioplayer-loaded');
      $('body').addClass('footer-audioplayer-loaded');
      selfClass.cthis.parent().removeClass('audioplayer-was-loaded');
    }

    if (selfClass.$stickToBottomContainer) {
      selfClass.$stickToBottomContainer.addClass('audioplayer-loaded');
    }


    selfClass.cthis.removeClass(ConstantsDzsAp.ERRORED_OUT_CLASS);


    selfClass.destroy_media();


    selfClass.cthis.attr('data-source', changeMediaArgs.source);






    var original_type = changeMediaArgs.type;
    if (changeMediaArgs.type === 'mediafile') {
      changeMediaArgs.type = 'audio';
    }
    if (changeMediaArgs.type) {
      if (changeMediaArgs.type === 'soundcloud') {
        changeMediaArgs.type = 'audio';
      }
      if (changeMediaArgs.type === 'album_part') {
        changeMediaArgs.type = 'audio';
      }
      selfClass.cthis.attr('data-type', changeMediaArgs.type);
      selfClass.audioType = changeMediaArgs.type;
      o.type = changeMediaArgs.type;
    }



    if (o.design_skin === 'skin-wave') {
      if (o.skinwave_wave_mode === 'canvas') {
        if (selfClass._sourcePlayer) {
          selfClass.data_source = _sourceForChange.attr('data-source');
        } else {
          if (typeof _sourceForChange === 'string') {

            selfClass.data_source = _sourceForChange;
          }
        }

        if (_sourceForChange && changeMediaArgs.pcm) {

          selfClass.cthis.attr('data-pcm', _sourceForChange.attr('data-pcm'));
          dzsapWaveFunctions.scrubModeWave__view_transitionIn(selfClass, _sourceForChange.attr('data-pcm'));
        } else {

          dzsapHelpers.player_reinit_findIfPcmNeedsGenerating(selfClass);
          // console.log('hasInitialPcmData - ', selfClass.hasInitialPcmData, selfClass.isPcmRequiredToGenerate);
          dzsapWaveFunctions.scrubModeWave__checkIfWeShouldTryToGetPcm(selfClass);
        }

      }


      // console.log(' artist - ',changeMediaArgs.artist, cthis.find('.the-artist'), changeMediaArgs)


      // -- inside skin-wave
      if (changeMediaArgs.thumb) {

        if (selfClass.cthis.find('.the-thumb').length) {

          selfClass.cthis.find('.the-thumb').css('background-image', 'url(' + changeMediaArgs.thumb + ')');
        } else {
          selfClass.cthis.attr('data-thumb', changeMediaArgs.thumb);
          selfClass.setupStructure_thumbnailCon();
        }

      }
    }


    if (changeMediaArgs.thumb) {

      if (selfClass.cthis.find('.the-thumb').length) {

        selfClass.cthis.find('.the-thumb').css('background-image', 'url(' + changeMediaArgs.thumb + ')');
      } else {
        selfClass.cthis.attr('data-thumb', changeMediaArgs.thumb);
        selfClass.setupStructure_thumbnailCon()
      }

      selfClass.cthis.removeClass('does-not-have-thumb');
      selfClass.cthis.addClass('has-thumb');
    } else {
      selfClass.cthis.addClass('does-not-have-thumb');
      selfClass.cthis.removeClass('has-thumb');
    }


    if (changeMediaArgs.pcm === '') {
      selfClass.setup_pcm_random_for_now();
    }

    // console.log('%c selfClass._sourcePlayer.attr(\'data-playerid\') - ','color: #da00ff;',selfClass._sourcePlayer.attr('data-playerid'), selfClass.cthis);


    dzsapHelpers.player_adjustIdentifiers (selfClass);
    // console.log('%c selfClass.identifier_pcm - ','color: #da00ff;',selfClass.identifier_pcm);


    handle_resize_delay = 100;


    if (selfClass._sourcePlayer) {


      // -- .feed-dzsap-for-extra-html-right will be appended to the footer player

      var selector = '';
      var $feedExtraHtmlRightFromSource = null;
      if (selfClass._sourcePlayer.find('.feed-dzsap-for-extra-html-right').length) {
        $feedExtraHtmlRightFromSource = selfClass._sourcePlayer.find('.feed-dzsap-for-extra-html-right').eq(0);
      } else {
        // -- we use this for Shop Builder
        if (selfClass._sourcePlayer.attr('data-playerid') && $(document).find('.feed-dzsap-for-extra-html-right[data-playerid="' + selfClass._sourcePlayer.attr('data-playerid') + '"]').length) {
          $feedExtraHtmlRightFromSource = $(document).find('.feed-dzsap-for-extra-html-right[data-playerid="' + selfClass._sourcePlayer.attr('data-playerid') + '"]').eq(0);

        }
      }
      if ($feedExtraHtmlRightFromSource) {
        selfClass.cthis.find('.extrahtml-in-float-right').eq(0).html($feedExtraHtmlRightFromSource.html());
      }
    }

    if (changeMediaArgs.artist) {
      selfClass.cthis.find('.the-artist').html(changeMediaArgs.artist);
    }
    if (changeMediaArgs.song_name) {
      selfClass.cthis.find('.the-name').html(changeMediaArgs.song_name);
    }


    if (changeMediaArgsDefaults.source_player_do_not_update === 'on') {
      selfClass.set_sourcePlayer(null);
    }


    // console.error('changeMediaArgs.source - ',changeMediaArgs.source,changeMediaArgs.type, type);
    if (original_type === 'soundcloud' && changeMediaArgs.source.indexOf('api.soundcloud') === -1) {
      selfClass.data_source = changeMediaArgs.source;
      // console.log("RETRIEVE SOUNDCLOUD URL");
      selfClass.isPlayPromised = true;
      setTimeout(function () {
        selfClass.isPlayPromised = true;
      }, 501);
      dzsapMisc.retrieve_soundcloud_url(selfClass);

    } else {

      // -- setup media for all sources
      // -- make sure source is not fake
      selfClass.setup_media({
        'called_from': 'change_media'
      });
    }


    selfClass.timeModel.getSampleTimesFromDom(selfClass._sourcePlayer);


    if (selfClass.audioType === 'fake') {
      return false;
    }

    if (selfClass.initOptions.action_audio_change_media) {
      selfClass.initOptions.action_audio_change_media(changeMediaArgs.source, changeMediaArgs);
    }


    //console.log("IS MOBILE - ",dzsapHelpers.dzsap_is_mobile());
    // console.log('%c before autoplay changeMediaArgs - ','color: #dadada;',changeMediaArgs, dzsapHelpers.dzsap_is_mobile());

    // console.log({changeMediaArgs});
    if (changeMediaArgs.autoplay === 'on') {
      selfClass.play_media_visual();

      setTimeout(function () {
        selfClass.play_media({
          'called_from': 'changeMediaArgs.autoplay'
        });
      }, 500);
    }
    selfClass.reinit();
    setTimeout(function () {

      selfClass.handleResize(null, {
        called_from: 'change_media'
      });
    }, handle_resize_delay)
  }
}
