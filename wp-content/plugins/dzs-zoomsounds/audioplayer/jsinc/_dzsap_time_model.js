import * as dzsapHelpers from "./_dzsap_helpers";

export class PlayerTime {
  constructor(selfClass) {

    this.timeCurrent = 0;
    this.timeTotal = 0;
    this.sampleTimeStart = null;
    this.sampleTimeEnd = null;
    this.sampleTimeTotal = null;

    this.referenceMediaCurrentTime = 0;
    this.referenceMediaTotalTime = 0;

    this.visualCurrentTime = null;
    this.visualTotalTime = null;

    // console.log('inited');
    this.dzsapInstance = selfClass;
    this.init();
  }

  init() {

    setInterval(this.check500ms, 500);



  }

  initObjects(){

    var selfClass = this.dzsapInstance;
    var timeInstance = this;


    // -- set current time
    selfClass.cthis.get(0).api_set_timeVisualCurrent = function (arg) {
      timeInstance.visualCurrentTime = arg;

      // this.visualCurrentTime = selfClass.sample_time_start + this.visualCurrentTime;

    }
    selfClass.cthis.get(0).api_get_time_total = function() {

      return timeInstance.getVisualTotalTime();
    }
    selfClass.cthis.get(0).api_get_time_curr = function() {
      return timeInstance.getVisualCurrentTime();
    };

    // -- set total time
    selfClass.cthis.get(0).api_set_timeVisualTotal = function (arg) {
      // time_total_for_visual = arg;
      // curr_time_first_set = true;
      // console.log('api_set_timeVisualTotal - ',arg, selfClass.cthis);
      timeInstance.visualTotalTime = arg;
      timeInstance.refreshTimes();
      // if(selfClass.cthis.attr('id')==='player1'){
      //   debugger;
      // }
    };
  }



  /**
   * called from enterFrame and other places
   * @param pargs
   */
  refreshTimes() {

    var selfClass = this.dzsapInstance;



    // console.log('get_times () margs - ',margs,'type - ',type,o.type);
    // -- trying to get current time
    // console.log('selfClass.audioType -' , selfClass.audioType);
    if ((selfClass.audioType === 'selfHosted' || (selfClass.audioType === 'fake' && selfClass._actualPlayer))) {
      if (selfClass.dataType !== 'shoutcast') {


        if (selfClass.$mediaNode_ && isNaN(selfClass.$mediaNode_.duration) === false) {
          this.referenceMediaTotalTime = selfClass.$mediaNode_.duration;
        }

        if (0 && selfClass.spectrum_audioContext_buffer && selfClass.spectrum_audioContext_buffer !== 'placeholder' && selfClass.spectrum_audioContext_buffer !== 'waiting') {

          if (selfClass._actualPlayer === null) {
            this.referenceMediaCurrentTime = selfClass.spectrum_audioContext.currentTime;
          }

        } else {

          // -- normal
          if (selfClass.$mediaNode_) {
            if (selfClass._actualPlayer === null) {
              this.referenceMediaCurrentTime = selfClass.$mediaNode_.currentTime;
            }
          }
        }


        if (selfClass.playFrom === 'last' && selfClass.playFrom_ready) {
          if (typeof Storage !== 'undefined') {
            localStorage['dzsap_' + selfClass.the_player_id + '_lastpos'] = selfClass.timeCurrent;
          }
        }


      }


    }


    if (selfClass._sourcePlayer && selfClass._sourcePlayer.get(0)) {
      if (selfClass._sourcePlayer.get(0).api_get_time_curr) {
        if (isNaN(selfClass._sourcePlayer.get(0).api_get_time_total()) || selfClass._sourcePlayer.get(0).api_get_time_total() === '' || selfClass._sourcePlayer.get(0).api_get_time_total() < 1) {
          selfClass._sourcePlayer.get(0).api_set_timeVisualTotal(this.getVisualTotalTime());
        }
      }
    }


    // -- setting real times ( if actual player is not there )
    if (selfClass._actualPlayer === null && this.referenceMediaCurrentTime > -1) {
      selfClass.timeCurrent = this.referenceMediaCurrentTime;
    }

    if (selfClass._actualPlayer === null && this.referenceMediaTotalTime > -1) {
      selfClass.timeTotal = this.referenceMediaTotalTime;
    }




    if (this.sampleTimeStart) {

      if (this.visualCurrentTime < selfClass.pseudo_sample_time_start) {
        this.visualCurrentTime = selfClass.pseudo_sample_time_start;
      }


      if (this.sampleTimeEnd) {
        if (selfClass.timeCurrent > this.sampleTimeEnd) {

          var args = {
            'call_from': 'time_curr>pseudo_sample_time_end'
          }
          selfClass.handle_end(args);

          selfClass.isMediaEnded = true;

          clearTimeout(selfClass.inter_isEnded);
          selfClass.inter_isEnded = setTimeout(function () {

            selfClass.isMediaEnded = false;
          }, 1000);
        }
      }
    }
  }

  processCurrentFrame(){

    var selfClass = this.dzsapInstance;
    if (selfClass._sourcePlayer) {
      if (selfClass._sourcePlayer.get(0)) {
        if (selfClass._sourcePlayer.get(0).api_get_time_curr) {
          selfClass._sourcePlayer.get(0).api_set_timeVisualCurrent(selfClass.timeCurrent);
        }
      }


      if (selfClass._sourcePlayer.get(0) && selfClass._sourcePlayer.get(0).api_seek_to_visual) {
        var temp_time_curr = selfClass.timeCurrent;
        // TODO: to be continued
        if (selfClass.pseudo_sample_time_start === 0) {

          if (selfClass.sample_time_start) {
            temp_time_curr -= selfClass.sample_time_start;
          }
        }


        selfClass._sourcePlayer.get(0).api_seek_to_visual(temp_time_curr / selfClass.timeTotal);
      } else {
        console.log('warning .. no seek to visual');
      }

    }


    // -- check end track
    if (selfClass.isSafeToChangeTrack && selfClass.timeTotal > 1 && selfClass.timeCurrent >= selfClass.timeTotal - 0.07) {
      var args = {
        'call_from': 'selfClass.timeTotal > 0 && selfClass.timeCurrent >= selfClass.timeTotal - 0.07 ... '
      }

      if (selfClass._actualPlayer === null) {

        selfClass.handle_end(args);
        selfClass.isMediaEnded = true;


        clearTimeout(selfClass.inter_isEnded);
        selfClass.inter_isEnded = setTimeout(function () {
          selfClass.isMediaEnded = false;
        }, 1000);
      }
    }

  }

  getVisualCurrentTime(){

    var selfClass = this.dzsapInstance;
    // if(this.sampleTimeTotal){
    //   return this.sampleTimeTotal;
    // }

    if (selfClass._actualPlayer === null && this.referenceMediaCurrentTime > -1) {
      return this.referenceMediaCurrentTime;
    }
    // todo: actualPlayer



    if(this.visualCurrentTime){
      return this.visualCurrentTime;
    }


    if(selfClass.playFrom){
      return selfClass.playFrom;
    }

    // todo: offsetVisual
    // if (selfClass._actualPlayer === null) {
    //   if (selfClass.pseudo_sample_time_start === 0) {
    //     if (selfClass.sample_time_start > 0) {
    //       time_curr_for_visual = selfClass.sample_time_start + time_curr_for_real;
    //     }
    //   }
    // }

    return 0;
  }

  /**
   *
   * @returns {null|number}
   */
  getVisualTotalTime(){
    var selfClass = this.dzsapInstance;
    // if(selfClass.cthis.attr('id')==='player1'){
    //   console.log('player1');
    // }
    if(this.sampleTimeTotal){
      return this.sampleTimeTotal;
    }


    if (selfClass._actualPlayer === null){
      if(this.referenceMediaTotalTime > -1) {
        return this.referenceMediaTotalTime;
      }
    }else{
      // -- has footer player

      if(this.visualTotalTime){
        return this.visualTotalTime;
      }
      //-- last resort
      if(this.referenceMediaTotalTime > -1) {
        return this.referenceMediaTotalTime;
      }
    }


    return 0;
  }

  /**
   * compare target scrub time with sample times
   * @param targetTime
   * @returns {*}
   */
  getActualTargetTime(targetTime){
    if (this.sampleTimeStart) {
      if (targetTime < this.sampleTimeStart) {
        targetTime = this.sampleTimeStart;
      }
      if (targetTime > this.sampleTimeEnd) {
        targetTime = this.sampleTimeEnd;
      }
    }

    return targetTime;
  }

  getSampleTimesFromDom($targetPlayer = null) {
    var selfClass = this.dzsapInstance;

    selfClass.sample_time_start = 0;
    selfClass.sample_time_total = 0;
    selfClass.sample_time_start = 0;
    selfClass.pseudo_sample_time_end = 0;


    if($targetPlayer===null){
      $targetPlayer = selfClass.cthis;
    }



    if ($targetPlayer.attr('data-sample_time_start')) {
      this.sampleTimeStart = Number($targetPlayer.attr('data-sample_time_start'));
    }
    if ($targetPlayer.attr('data-sample_time_end')) {
      this.sampleTimeEnd = Number($targetPlayer.attr('data-sample_time_end'));
    }
    if ($targetPlayer.attr('data-sample_time_total')) {
      this.sampleTimeTotal = Number($targetPlayer.attr('data-sample_time_total'));
    }

    // console.log($targetPlayer, this, this.sampleTimeStart, this.sampleTimeEnd);

    selfClass.sample_perc_start = selfClass.sample_time_start / selfClass.sample_time_total;
    selfClass.sample_perc_end = selfClass.sample_time_end / selfClass.sample_time_total;


    if ((this.sampleTimeTotal && this.sampleTimeStart) || (this.sampleTimeStart && this.sampleTimeEnd)) {
      selfClass.isSample = true;
    } else {
      selfClass.isSample = false;
    }

  }
}
