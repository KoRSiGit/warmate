import * as dzsapHelpers from '../_dzsap_helpers';

import {ConstantsDzsAp} from "../../configs/_constants";
import * as dzsHelpers from "../../js_common/_dzs_helpers";

window.dzsap_wavesurfer_load_attempt = 0;
window.dzsap_wavesurfer_is_trying_to_generate = null;


var dzsapWaveRender = this;

/**
 * called on init_loaded
 * @param selfClass
 * @param pargs
 * @returns {boolean}
 */
export function scrubModeWave__checkIfWeShouldTryToGetPcm(selfClass, pargs) {


  var margs = {
    'call_from': 'default'
    , 'call_attempt': 0
  };
  if (pargs) {
    margs = jQuery.extend(margs, pargs);
  }

  // console.groupCollapsed('scrubModeWave__checkIfWeShouldTryToGetPcm()')
  // console.log(selfClass, selfClass.cthis);
  // console.trace();
  // console.groupEnd();

  // -- retry
  if (window.dzsap_wavesurfer_is_trying_to_generate) {
    setTimeout(function () {
      // console.log('margs.call_attempt - ', margs.call_attempt);
      margs.call_attempt++;
      if (margs.call_attempt < 10) {
        scrubModeWave__checkIfWeShouldTryToGetPcm(selfClass, margs);
        ;
        console.log('%c [dzsap] trying to regenerate ', ConstantsDzsAp.DEBUG_STYLE_1, window.dzsap_wavesurfer_is_trying_to_generate);
      }
    }, 1000)
    return false;
  }



  // console.log({isWeShouldGeneratePcm}, 'isWeCanGeneratePcm(selfClass) - ', isWeCanGeneratePcm(selfClass));
  if (selfClass.isPcmRequiredToGenerate) {

    if (isWeCanGeneratePcm(selfClass)) {

      window.dzsap_wavesurfer_is_trying_to_generate = selfClass;


      window.dzsap_get_base_url();

      let wavesurferUrl = window.dzsap_base_url ? window.dzsap_base_url + '/parts/wavesurfer/dzsap-wave-generate.js' : ConstantsDzsAp.URL_WAVESURFER_HELPER_BACKUP;

      // wavesurferUrl = ConstantsDzsAp.URL_WAVESURFER_HELPER_BACKUP;
      // console.log({wavesurferUrl});

      window.scrubModeWave__view_transitionIn = scrubModeWave__view_transitionIn;

      // console.log('[load dzsap-wave-generate] --- window.scrubModeWave__initGenerateWaveData - ', window.scrubModeWave__initGenerateWaveData, selfClass.cthis);
      dzsHelpers.loadScriptIfItDoesNotExist(wavesurferUrl, window.scrubModeWave__initGenerateWaveData).then((resolveStr) => {
        // console.log('resolveStr - ', resolveStr);
        scrubModeWave__initGenerateWaveData(selfClass);
      });
    }
  }
}

function isWeCanGeneratePcm(selfClass) {

  if (selfClass.isAlreadyHasRealPcm) {
    return false;
  }
  return selfClass.data_source != 'fake';

}

export function view_drawCanvases(selfClass, argpcm, calledFrom) {
  var o = selfClass.initOptions;

  draw_canvas(selfClass._scrubbarbg_canvas.get(0), argpcm, "#" + o.design_wave_color_bg, {
    call_from: calledFrom + '_bg',
    selfClass,
    'skinwave_wave_mode_canvas_waves_number': parseInt(o.skinwave_wave_mode_canvas_waves_number, 10),
    'skinwave_wave_mode_canvas_waves_padding': parseInt(o.skinwave_wave_mode_canvas_waves_padding, 10)
  });
  draw_canvas(selfClass._scrubbarprog_canvas.get(0), argpcm, '#' + o.design_wave_color_progress, {
      call_from: calledFrom + '_prog',
      selfClass,
      'skinwave_wave_mode_canvas_waves_number': parseInt(o.skinwave_wave_mode_canvas_waves_number, 10),
      'skinwave_wave_mode_canvas_waves_padding': parseInt(o.skinwave_wave_mode_canvas_waves_padding, 10),
    },
    true);
}

/**
 * called after random
 * called on wavesurfer error / success
 * @param selfClass
 * @param argpcm
 */
export function scrubModeWave__view_transitionIn(selfClass, argpcm) {

  // console.log('scrubModeWave__view_transitionIn()');


  selfClass._scrubbar.find('.scrub-bg-img,.scrub-prog-img').removeClass('transitioning-in');
  selfClass._scrubbar.find('.scrub-bg-img,.scrub-prog-img').addClass('transitioning-out');
  ;

  dzsapHelpers.scrubbar_modeWave_setupCanvas({
    'prepare_for_transition_in': true
  }, selfClass);

  view_drawCanvases(selfClass, argpcm, 'canvas_generate_wave_data_animate_pcm');


  setTimeout(() => {
    dzsapHelpers.scrubbar_modeWave_clearObsoleteCanvas(selfClass);
  }, 300);

  // -- warning - not always real pcm
  selfClass.isAlreadyHasRealPcm = true;
  selfClass.scrubbar_reveal();
}


/**
 * draw canvas here
 * @param $canvas_
 * @param pcm_arr
 * @param hexcolor
 * @param pargs
 * @param isProgressScrubContext
 * @returns {boolean}
 */
export function draw_canvas($canvas_, pcm_arr, hexcolor, pargs, isProgressScrubContext) {
  var margs = {
    'call_from': 'default',
    'is_sample': false,
    'selfClass': null,
    'sample_time_start': 0,
    'sample_time_end': 0,
    'sample_time_total': 0,
    'skinwave_wave_mode_canvas_waves_number': 2,
    'skinwave_wave_mode_canvas_waves_padding': 1,
  };

  var $ = jQuery;
  if (pargs) {
    margs = Object.assign(margs, pargs);
  }

  hexcolor = dzsapHelpers.sanitizeToHexColor(hexcolor);

  var _canvas = $($canvas_);
  var __canvas = $canvas_;
  let isWithinSample = false;
  var {selfClass, skinwave_wave_mode_canvas_waves_number, skinwave_wave_mode_canvas_waves_padding} = margs;

  // -- sanitize
  if (isNaN(Number(skinwave_wave_mode_canvas_waves_number))) {
    skinwave_wave_mode_canvas_waves_number = 2;
  }

  if (isNaN(Number(skinwave_wave_mode_canvas_waves_padding))) {
    if (skinwave_wave_mode_canvas_waves_number !== 1) {
      skinwave_wave_mode_canvas_waves_padding = 1;
    } else {

      skinwave_wave_mode_canvas_waves_padding = 0;
    }
  }


  if (selfClass) {
    var o = selfClass.initOptions;
  }
  // console.log('o - ', o);


  // console.log('[dzsap] draw_canvas() - ', margs, margs.call_from, 'hexcolor - ', hexcolor, _canvas);
  if (_canvas && _canvas.get(0)) {

  } else {
    return false;
  }

  var _canvasContext = _canvas.get(0).getContext("2d");

  var ar_str = pcm_arr;


  var waves = [];
  // console.log('selfClass - ', selfClass);
  if (selfClass && selfClass._scrubbar) {
    if (selfClass._scrubbarprog_canvas) {
      selfClass._scrubbarbg_canvas.width(selfClass._scrubbar.width());
      selfClass._scrubbarprog_canvas.width(selfClass._scrubbar.width());
      $canvas_.width = selfClass._scrubbar.width();
      $canvas_.height = selfClass._scrubbar.height();
    }
  }
  // ctx.translate(0.5, 0.5);
  // ctx.lineWidth = .5;

  _canvasContext.imageSmoothingEnabled = false;
  _canvasContext.imageSmoothing = false;
  _canvasContext.imageSmoothingQuality = "high";
  _canvasContext.webkitImageSmoothing = false;

  if (pcm_arr) {

  } else {
    setTimeout(function () {
      // draw_canvas(_arg,pcm_arr,hexcolor);
    }, 1000);
    return false;
  }

  if (typeof (ar_str) == 'object') {
    waves = ar_str;
  } else {
    try {

      waves = JSON.parse(ar_str);
    } catch (err) {
      // console.error('parse error - ',ar_str, ar_str!='');
    }
  }


  var barIndex = 0,
    max = 0;

  // console.log(ar);

  // -- normalizing
  for (barIndex = 0; barIndex < waves.length; barIndex++) {
    if ((waves[barIndex]) > max) {
      max = (waves[barIndex]);
    }
  }

  var ar_new = [];
  for (barIndex = 0; barIndex < waves.length; barIndex++) {
    ar_new[barIndex] = parseFloat(Math.abs(waves[barIndex]) / Number(max));
  }

  waves = ar_new;


  var widthCanvas;
  var heightCanvas;
  var gradient = null;


  if (selfClass) {

    __canvas.width = selfClass._scrubbar.width();
  }

  widthCanvas = __canvas.width;
  heightCanvas = __canvas.height;


  var barCount = skinwave_wave_mode_canvas_waves_number;
  var bar_space = skinwave_wave_mode_canvas_waves_padding;

  // console.log(bar_len);
  if (barCount == 1) {
    barCount = widthCanvas / barCount;
  }
  if (barCount == 2) {
    barCount = widthCanvas / 2;
  }
  if (barCount == 3) {
    barCount = (widthCanvas) / 3;
  }

  // console.log('bar_len - ',bar_len);
  // console.log('pcm_arr - ',pcm_arr);


  var reflection_size = parseFloat(o.skinwave_wave_mode_canvas_reflection_size);

  if (widthCanvas / barCount < 1) {
    barCount = Math.ceil(barCount / 3);

  }


  // console.log({reflection_size});
  var bar_w = Math.ceil(widthCanvas / barCount);
  var normal_size_ratio = 1 - reflection_size;

  // console.log("bar_w - ",bar_w);
  // console.log({normal_size_ratio});

  if (bar_w == 0) {
    bar_w = 1;
    bar_space = 0;
  }
  if (bar_w == 1) {
    bar_space = bar_space / 2;
  }
  // console.log('bar_w - ', bar_w, bar_space);


  // console.log('chh - ', chh, ' normal_size_ratio - ', normal_size_ratio, 'ar - ', ar);
  var lastBarHeight = 0;
  var searched_index = null;


  // -- left right gradient
  var temp_hex = hexcolor;
  temp_hex = temp_hex.replace('#', '');
  var hexcolors = []; // -- hex colors array
  if (temp_hex.indexOf(',') > -1) {
    hexcolors = temp_hex.split(',');
  }


  var progress_hexcolor = '';
  var progress_hexcolors = '';


  if (margs.call_from == 'spectrum') {
    progress_hexcolor = o.design_wave_color_progress;
    progress_hexcolor = progress_hexcolor.replace('#', '');
    progress_hexcolors = []; // -- hex colors array
    if (progress_hexcolor.indexOf(',') > -1) {
      progress_hexcolors = progress_hexcolor.split(',');

    }
  }


  var spectrum_isBarWithinProgress = false; // -- color the bar in progress colors

  // -- left right gradient END


  /**
   * draw with different color
   * @param i
   * @returns {boolean}
   */
  function isBeforeOrAfterSample(currBarIndex) {

    // console.log('sampleTimes - ', currBarIndex, selfClass.timeModel.sampleTimeStart, selfClass.timeModel.sampleTimeEnd, selfClass.timeModel.sampleTimeTotal);

    if ((currBarIndex / barCount < selfClass.timeModel.sampleTimeStart / selfClass.timeModel.sampleTimeTotal) || currBarIndex / barCount > selfClass.timeModel.sampleTimeEnd / selfClass.timeModel.sampleTimeTotal) {

      return true;
    }
    return false;
  }

  function view_drawBars(isReflection = false) {
    for (barIndex = 0; barIndex < barCount; barIndex++) {
      isWithinSample = false;
      _canvasContext.save();

      // console.log('ar[searched_index] - ', ar[searched_index]);
      searched_index = Math.ceil(barIndex * (waves.length / barCount));

      // -- we'll try to prevent
      if (barIndex < barCount / 5) {
        if (waves[searched_index] < 0.1) {
          waves[searched_index] = 0.1;
        }
      }
      if (waves.length > barCount * 2.5 && barIndex > 0 && barIndex < waves.length - 1) {
        waves[searched_index] = Math.abs(waves[searched_index] + waves[searched_index - 1] + waves[searched_index + 1]) / 3
      }
      // -- normalize end


      // var barh = Math.abs(ar[searched_index] * chh);
      let targetRatio = normal_size_ratio;
      if (isReflection) {
        targetRatio = reflection_size;
      }

      var barHeight = Math.abs(waves[searched_index] * heightCanvas * targetRatio);

      // -- let's try to normalize
      if (o.skinwave_wave_mode_canvas_normalize == 'on') {
        if (isNaN(lastBarHeight)) {
          lastBarHeight = 0;
        }
        barHeight = barHeight / 1.5 + lastBarHeight / 2.5;
      }
      lastBarHeight = barHeight;


      _canvasContext.lineWidth = 0;
      barHeight = Math.floor(barHeight);
      // debugger;
      // if(isReflection){
      //   console.log('isReflection', {bar: waves[searched_index], barHeight, targetRatio, heightCanvas});
      // }

      // var y = chh * normal_size_ratio - barh_normal;
      var barPositionTop = isReflection ? heightCanvas * normal_size_ratio : Math.ceil(heightCanvas * targetRatio - barHeight);

      // if(isReflection){
      //   console.log('isReflection', {barPositionTop});
      // }
      _canvasContext.beginPath();
      _canvasContext.rect(barIndex * bar_w, barPositionTop, bar_w - bar_space, barHeight);

      // console.log('[dzsap] [waveform] draw rect props - ', i * bar_w, bar_w - bar_space ,barh_normal, ' bar_w - ', bar_w, 'bar_space - ',bar_space);
      // console.log('barh_normal - ', barh_normal, ' y - ', y);


      if (margs.call_from == 'spectrum') {
        if (barIndex / barCount < selfClass.timeCurrent / selfClass.timeTotal) {
          spectrum_isBarWithinProgress = true;
        } else {
          spectrum_isBarWithinProgress = false;
        }
      }


      if (selfClass.isSample) {
        isWithinSample = isBeforeOrAfterSample(barIndex);
      }
      // console.log({isWithinSample, spectrum_isBarWithinProgress});

      if (spectrum_isBarWithinProgress) {
        if (isReflection && o.skinwave_wave_mode_canvas_mode !== 'reflecto') {
          _canvasContext.fillStyle = dzsapHelpers.hexToRgb(progress_hexcolor, 0.25);
        } else {
          _canvasContext.fillStyle = isWithinSample ? dzsapHelpers.hexToRgb(progress_hexcolor, 0.5) : '#' + progress_hexcolor;
        }


        if (progress_hexcolors.length) {

          const startColor = isReflection && o.skinwave_wave_mode_canvas_mode !== 'reflecto' ? dzsapHelpers.hexToRgb('#' + progress_hexcolors[0], 0.25) : '#' + progress_hexcolors[0];
          const endColor = isReflection && o.skinwave_wave_mode_canvas_mode !== 'reflecto' ? dzsapHelpers.hexToRgb('#' + progress_hexcolors[1], 0.25) : '#' + progress_hexcolors[1];

          gradient = _canvasContext.createLinearGradient(0, 0, 0, heightCanvas);
          gradient.addColorStop(0, startColor);
          gradient.addColorStop(1, endColor);
          _canvasContext.fillStyle = gradient;
        }

      } else {
        /**
         * normal
         */

        // -- NORMAL not progress
        if (isReflection && o.skinwave_wave_mode_canvas_mode !== 'reflecto') {
          _canvasContext.fillStyle = dzsapHelpers.hexToRgb(hexcolor, 0.25);
        } else {
          // console.log({hexcolor});
          _canvasContext.fillStyle = isWithinSample ? dzsapHelpers.hexToRgb(hexcolor, 0.5) : '' + hexcolor;
        }

        // -- if we have gradient
        if (hexcolors.length) {
          const startColor = isReflection && o.skinwave_wave_mode_canvas_mode !== 'reflecto' ? dzsapHelpers.hexToRgb(dzsapHelpers.utils_sanitizeToColor(hexcolors[0]), 0.25) : '' + dzsapHelpers.utils_sanitizeToColor(hexcolors[0]);
          const endColor = isReflection && o.skinwave_wave_mode_canvas_mode !== 'reflecto' ? dzsapHelpers.hexToRgb(dzsapHelpers.utils_sanitizeToColor(hexcolors[1]), 0.25) : '' + dzsapHelpers.utils_sanitizeToColor(hexcolors[1]);

          gradient = _canvasContext.createLinearGradient(0, 0, 0, heightCanvas);
          gradient.addColorStop(0, startColor);
          gradient.addColorStop(1, endColor);
          _canvasContext.fillStyle = gradient;
        }
        // if (!isReflection && isProgressScrubContext) {
        // console.log('scrubProgress -  _canvasContext.fillStyle - ', _canvasContext.fillStyle, {isWithinSample});
        // }
        // if(isReflection){
        //   console.log('isReflection _canvasContext.fillStyle - ', _canvasContext.fillStyle);
        // }
      }


      if (!(isWithinSample && isProgressScrubContext)) {

        // console.log('ctx.fillStyle - ',ctx.fillStyle);
        _canvasContext.fill();
        _canvasContext.closePath();
      }


      _canvasContext.restore();

    }

  }


  _canvasContext.clearRect(0, 0, widthCanvas, heightCanvas);
  // console.log('bar_len - ', bar_len);
  view_drawBars();
  view_drawBars(true);

  // -- reflection
  setTimeout(function () {
    selfClass.scrubbar_reveal();
  }, 100)
}
