window.dzsap_part_starRatings_loaded = 'on';


class dzsapStarRatingsSource {
  constructor(dzsapClass) {

    this.dzsap = dzsapClass;

    this.init();


  }

  init() {

    var $ = jQuery;
    var starrating_index = 0;
    var dzsapClass = this.dzsap;


    $(document).on('mousemove', '.star-rating-con', mouse_starrating);
    $(document).on('mouseleave', '.star-rating-con', mouse_starrating);
    $(document).on('click', '.star-rating-con', mouse_starrating);

    function mouse_starrating(e) {
      var $t = $(this);

      // console.log('mouse_starrating() ', e.type, $t);


      if (dzsapClass.cthis.has($t).length === 0) {
        return;
      }

      if (e.type === 'mouseleave') {


        var auxnr = Number(dzsapClass.cthis.find('.star-rating-con').eq(0).attr('data-initial-rating-index')) * 100;


        // console.log('dzsapClass.starrating_alreadyrated - ',dzsapClass.starrating_alreadyrated);
        if (dzsapClass.starrating_alreadyrated > -1 && dzsapClass.starrating_alreadyrated > 0) {
          auxnr = dzsapClass.starrating_alreadyrated * 100 / 5;
        }

        dzsapClass.cthis.find('.rating-prog').css({
          'width': auxnr + '%'
        })


        dzsapClass.cthis.find('.star-rating-set-clip').css({
          'opacity': 1
        })

      }
      if (e.type === 'mousemove') {
        //console.log(_t);
        var mx = e.pageX - $t.offset().left;
        var my = e.pageX - $t.offset().left;

        // console.log('Math.round(mx/ (_t.outerWidth()/5)) - ' , Math.round(mx/ (_t.outerWidth()/5)) );
        // console.log('dzsapClass.starrating_alreadyrated - ' , dzsapClass.starrating_alreadyrated );


        starrating_index = Math.round(mx / ($t.outerWidth() / 5));


        if (starrating_index > 4) {
          starrating_index = 5;
        } else {
          starrating_index = Math.round(starrating_index);
        }

        if (starrating_index < 1) {
          starrating_index = 1;
        }

        //                    console.log(starrating_index, dzsapClass.cthis.find('.star-rating-prog-clip'));

        // console.log('starrating_index - ',starrating_index);
        // console.log('(starrating_index/5 * 100) - ',(starrating_index/5 * 100));
        dzsapClass.cthis.find('.star-rating-prog-clip').css({
          'width': (starrating_index / 5 * 100) + '%'
        })

        dzsapClass.starrating_alreadyrated = -1;


        dzsapClass.cthis.find('.star-rating-set-clip').css({
          'opacity': 0
        })
      }
      if (e.type === 'click') {


        console.log('dzsapClass.starrating_alreadyrated - ', dzsapClass.starrating_alreadyrated);
        //todo:remove
        dzsapClass.starrating_alreadyrated = -1;
        if (dzsapClass.starrating_alreadyrated > -1 && dzsapClass.starrating_alreadyrated > 0) {
          return;
        }

        (ajax_submit_rating.bind(dzsapClass))(starrating_index);
      }


    }

  }
}

function ajax_submit_rating(starrating_index) {
  //only handles ajax call + result
  var selfClass = this;
  var $ = jQuery;
  var mainarg = starrating_index;
  var data = {
    action: 'dzsap_submit_rate',
    postdata: mainarg,
    playerid: selfClass.the_player_id
  };

  //todo:remove
  // selfClass.starrating_alreadyrated = 0;

  // console.log(selfClass.starrating_alreadyrated);
  if (selfClass.starrating_alreadyrated > -1) {
    return;
  }
  // console.log(selfClass.starrating_alreadyrated,selfClass.urlToAjaxHandler )
  selfClass.cthis.find('.star-rating-con').addClass('just-rated');
  let totalWidth = parseInt(selfClass.cthis.find('.star-rating-bg').width(), 10);
  if (selfClass.urlToAjaxHandler) {
    jQuery.ajax({
      type: "POST",
      url: selfClass.urlToAjaxHandler,
      data: data,
      success: function (response) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + response);
        }
        ;


        var resp_arr = {};

        try {
          resp_arr = JSON.parse(response);
        } catch (e) {
          console.log(e);
        }

        var percentSetRating = selfClass.cthis.find('.star-rating-set-clip').outerWidth() / selfClass.cthis.find('.star-rating-bg').outerWidth();
        var nrrates = parseInt(selfClass.cthis.find('.counter-rates .the-number').html(), 10);

        nrrates++;

        var percentFinalRating = ((nrrates - 1) * (percentSetRating * 5) + starrating_index) / (nrrates)

        // console.log({percentSetRating, aux2: percentFinalRating});
        //                        console.log(aux, percentFinalRating, nrrates);

        setTimeout(function () {

          selfClass.cthis.find('.star-rating-con').removeClass('just-rated');
        }, 100);
        selfClass.cthis.find('.counter-rates .the-number').html(resp_arr.number);

        selfClass.cthis.find('.star-rating-con').attr('data-initial-rating-index', Number(resp_arr.index) / 5);
        selfClass.cthis.find('.star-rating-con .rating-prog').css('width', (Number(resp_arr.index) / 5 * 100) + '%');

        if (selfClass.initOptions.parentgallery && $(selfClass.initOptions.parentgallery).get(0) !== undefined && $(selfClass.initOptions.parentgallery).get(0).api_player_rateSubmitted !== undefined) {
          $(selfClass.initOptions.parentgallery).get(0).api_player_rateSubmitted();
        }

      },
      error: function (arg) {
        if (typeof window.console != "undefined") {
          // console.log('Got this from the server: ' + arg, arg);
        }
        ;


        var widthStarRatingClip = selfClass.selfClass.cthis.find('.star-rating-set-clip').outerWidth() / selfClass.cthis.find('.star-rating-bg').outerWidth();
        var nrrates = parseInt(selfClass.cthis.find('.counter-rates .the-number').html(), 10);

        nrrates++;

        var aux2 = ((nrrates - 1) * (widthStarRatingClip * 5) + starrating_index) / (nrrates)

        // console.log({aux2});

        //                        console.log(aux, aux2, nrrates);
        selfClass.cthis.find('.star-rating-set-clip').width(aux2 * (totalWidth / 5));
        selfClass.cthis.find('.counter-rates .the-number').html(nrrates);

        if (selfClass.initOptions.parentgallery && $(selfClass.initOptions.parentgallery).get(0) !== undefined && $(selfClass.initOptions.parentgallery).get(0).api_player_rateSubmitted !== undefined) {
          $(selfClass.initOptions.parentgallery).get(0).api_player_rateSubmitted();
        }

      }
    });
  }
}


window.dzsap_init_starRatings_from_dzsap = function (dzsapClass) {
  var dzsapStarRatingsSourceInstance = new dzsapStarRatingsSource(dzsapClass);
}
