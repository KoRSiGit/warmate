// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
 * Author: Digital Zoom Studio
 * Website: http://digitalzoomstudio.net/
 * Portfolio: http://codecanyon.net/user/ZoomIt/portfolio?ref=ZoomIt
 * This is not free software.
 * Advanced Scroller v1.44
 */

"use strict";
window.dzscsc_self_options = {};

var helpersDzsCommon = require('./js_common/_helpers');
var helpersCsc = require('./js_csc/_csc_helpers');
var ConstantsCsc = require('./js_csc/_constants').constants;

class DzsContentScroller {


  constructor(argThis, argOptions, $) {

    this.argThis = argThis;
    this.argOptions = argOptions;
    this.$ = $;


    this.slideshowTime = 0;
    this.margin = 0;
    this.design_itemwidth = 0;

    this.cthis = null;

    this.totalComponentWidth = 0;
    this.totalComponentHeight = 0;
    this.totalItemContainerClipWidth = 0;
    this.totalItemContainerClipHeight = 0;
    this.totalItemContainerWidth = 0;
    this.totalItemContainerHeight = 0;

    this.pag_total_pages = 0;
    this.currPage = -1;
    this.currPageX = 0;
    this.currPageY = -1;
    this.numberOfItems;

    this.itemsOnCurrPage = []; // -- items on the current page ( will return only the first for mode onlyone )

    this.hasSpaceToScroll = false;

    this.componentId = null;

    this.init();
  }

  init() {
    var selfClass = this;

    var $ = selfClass.$;
    var o = selfClass.argOptions;

    var cthis = $(selfClass.argThis)
    ;
    selfClass.cthis = cthis;

    var currNr = -1;
    var i = 0
      , startIndex = 0
    ;
    var ww
      , tw_last // total width of the container and h
      , page_w_calculated = 0 // -- one item calculated width
    ;
    var
      items_per_page = 0
    ;
    var
      _items
      , _thumbsCon
      , _thumbsClip
      , _thumbsConItems
      , _bulletsCon
      , _arrowsCon
    ;

    var target_swiper;

    var _outerThumbs = null
    ;
    var
      pag_total_thumbsizes = 0
      , pag_total_thumbnr = 0 // -- total number of thumbnails
      , pag_last_total_pages = 0 //  -- the last total pages
      , pag_excess_thumbnr = 0 // -- the excess thumbs which go

    ;
    var _currPage = null
      , tempPage = 0
      , lastArg = 0 // -- the last current transitioning item
    ;
    //===slideshow vars
    var slideshowInter
      , slideshowCount = 0
      , inter_wait_loaded = null
    ;


    var loadedArray = []
      , lazyLoadingArray = []
      , itemsToBeArray = []
    ;


    var action_call_on_gotoItem = null;

    var inter_calculate_hard = 0
      , inter_check_if_loaded = 0
    ;
    var is_over = false;
    var misc_has_height_same_as_width_elements = false;


    var duration_viy = 10
      , target_viy = 0
      , target_vix = 0
      , begin_viy = 0
      , begin_vix = 0
      , finish_viy = 0
      , finish_vix = 0
      , change_viy = 0
      , change_vix = 0
      , cthis_offset_x = 0
      , _t_offset_x_parent = 0
      , _t_offset_x = 0
      , _t_offset_rel_x = 0
      , is_scroll_vertical = 0
      , is_scroll_horizontal = 0
      , has_space_to_scroll
    ;


    var assets = require('./js_common/_assets');


    var responsive_per_row = 0;

    var viewIndexX = 0;


    //console.info(selfClass.cthis, o.design_forceitemwidth>0);

    // console.info(selfClass.cthis, o,o.settings_swipeOnDesktopsToo);
    init();


    function init() {
      if (selfClass.cthis.hasClass('inited')) {
        return;
      }

      selfClass.gotoPrevPage = gotoPrevPage;
      selfClass.gotoNextPage = gotoNextPage;


      helpersCsc.init_sanitizeInitialOptions(selfClass, o);


      if (responsive_per_row == 1) {
        o.settings_onlyone = 'on';
      }

      selfClass.cthis.addClass('only-one-' + o.settings_onlyone);


      selfClass.cthis.css('opacity', '');

      selfClass.cthis.addClass('mode-' + o.settings_mode);
      selfClass.cthis.addClass('nav-type-' + o.nav_type);
      selfClass.cthis.addClass('transition-' + o.settings_transition);

      if (o.design_arrowsize == 'default') {
        o.design_arrowsize = 40;
      }
      if (o.design_bulletspos == 'default') {
        o.design_bulletspos = 'bottom';
      }

      if (o.design_disableArrows == 'default') {
        o.design_disableArrows = 'off';
      }
      if (o.settings_onlyone == 'on') {
        selfClass.cthis.addClass('is-onlyone');
      }


      setup_structure();

      selfClass.numberOfItems = _items.children().length;

      if (selfClass.cthis.find('.js-height-same-as-width')) {
        misc_has_height_same_as_width_elements = true;
      }


      // console.info('o - ',o);
      // console.info('_outerThumbs - ',_outerThumbs);


      reinit();


      //console.log(selfClass.cthis.find('.needs-loading'));


      selfClass.cthis.addClass('inited');


      //console.info('inited');
      selfClass.cthis.get(0).api_set_action_call_on_gotoItem = function (arg) {
        //console.info(arg);
        action_call_on_gotoItem = arg;
      };


//                console.info(lazyLoadingArray);


      if (o.nav_type == 'slide') {

        if (is_android() == false) {

          handle_frame();


          selfClass.cthis.bind('mousemove', handle_mouse);
        }
      }

      if (_outerThumbs) {
        _outerThumbs.on('click', '.csc-item', function () {
          var _t = $(this);

          var ind = _t.parent().children().index(_t);

          _t.parent().children().removeClass('active');
          _t.addClass('active');

          gotoPage(ind, {call_from: 'click cscitem'});
        });

        _outerThumbs.find('.csc-item').eq(0).addClass('active');
      }


      // console.info('contentscroller - init()');
      if (selfClass.cthis.find('.csc-item.needs-loading:not(.loaded)').length > 0 && o.settings_force_immediate_load == 'off') {
        //console.log('ceva');
        checkWhenLoaded();
      } else {
        if (o.settings_force_immediate_load == 'on') {
          checkWhenLoaded();
        }
        init_setup();
      }

    }


    function setup_structure() {


      if (o.design_bulletspos == 'top') {
        // selfClass.cthis.append('<div class="bulletsCon"></div>');
      }
      selfClass.cthis.append('<div class="thumbsClip"><div class="thumbsCon"></div></div>');
      if (o.design_bulletspos == 'bottom') {
        selfClass.cthis.append('<div class="bulletsCon"></div>');
      }


      if (o.design_disableArrows != 'on') {

        if (selfClass.cthis.children('.arrowsCon').length == 0) {

          selfClass.cthis.append('<div class="arrowsCon"></div>');
        }
      }


      if (o.settings_autoHeight == 'off') {
        selfClass.cthis.addClass('autoheight-off');
      }

      if (o.outer_thumbs) {

        _outerThumbs = $(o.outer_thumbs);

        if (_outerThumbs.length) {

        } else {
          _outerThumbs = null;
        }
      }

      selfClass.cthis.addClass('direction-' + o.settings_direction);

      _items = selfClass.cthis.children('.items').eq(0);
      _bulletsCon = selfClass.cthis.children('.bulletsCon').eq(0);
      _thumbsCon = selfClass.cthis.find('.thumbsCon').eq(0);
      _thumbsClip = selfClass.cthis.find('.thumbsClip').eq(0);
      _arrowsCon = selfClass.cthis.find('.arrowsCon').eq(0);


      if (_arrowsCon.children('.arrow-left').length == 0) {

        _arrowsCon.append('<div class="cs-arrow cs-arrow-left">' + assets.svg_arrow_left + '</div>');
        _arrowsCon.append('<div class="cs-arrow cs-arrow-right">' + assets.svg_arrow_right + '</div>');
      }
    }


    function handle_frame() {

      // -start handleframe


      if (isNaN(target_viy)) {
        target_viy = 0;
      }

      if (duration_viy === 0) {
        requestAnimFrame(handle_frame);
        return false;
      }


      // console.info(nav_thumbs_dir_hor);
      if (o.settings_direction == 'horizontal' && selfClass.hasSpaceToScroll) {
        begin_vix = target_vix;
        change_vix = finish_vix - begin_vix;

        // console.info('duration_viy - ',duration_viy);

        target_vix = Number(Math.easeIn(1, begin_vix, change_vix, duration_viy).toFixed(4));


        // console.info(finish_vix);

        // _thumbsCon.css({
        //     'left':target_vix+'px'
        // })
        _thumbsCon.css({
          'transform': 'translate3d(' + target_vix + 'px,0,0)'
        })


      }


      if (o.settings_direction == 'vertical' && selfClass.hasSpaceToScroll) {
        begin_vix = target_vix;
        change_vix = finish_vix - begin_vix;

        // console.info('duration_viy - ',duration_viy);

        target_vix = Number(Math.easeIn(1, begin_vix, change_vix, duration_viy).toFixed(4));

        // console.log('target_vix - ', target_vix);
        _thumbsCon.css({
          'transform': 'translate3d(0,' + target_vix + 'px,0)'
        })


      }

      //console.info(_blackOverlay,target_bo);;

      requestAnimFrame(handle_frame);
    }


    function reinit() {


      var ind = 0;

      itemsToBeArray = _items.children('.csc-item');

      //console.info(_thumbsClip);
      _items.children('.csc-item').each(function () {
        var _t = $(this);
        var ind2 = _t.parent().children().index(_t);


        // -- each csc item
        var _c2 = _t.find('.divimage,img');
        if (_c2.length && _c2.eq(0).attr('data-src')) {
          _t.addClass('needs-loading');

          if (_c2.attr('data-src')) {
            _c2.css('background-image', 'url(' + _c2.attr('data-src') + ')')
          }
        } else {

        }

        _t.wrapInner('<div class="csc-item--inner"></div>');


        //console.log(_t, _t.parent().children(), ind);
        var itemWidth = selfClass.design_itemwidth;
        //console.info(aux);
        // _t.addClass('item').removeClass('item-tobe');
        if (itemWidth != 'auto' && itemWidth != '' && selfClass.cthis.hasClass('is-onlyoneitem') == false) {
          _t.css({
            'width': itemWidth
          });
        }
        _thumbsCon.append(_t);

        if (o.settings_lazyLoading == 'on') {
          if (_t.find('.imagediv').length == 0 && _t.find('img.imageimg').length == 0) {
            lazyLoadingArray[ind] = 'tobeloaded';
          } else {
            lazyLoadingArray[ind] = 'loaded';
          }
        }

        loadedArray[ind] = 1;
        ind++;


      });

      if (o.settings_lazyLoading == 'on') {

//                    console.info(_thumbsCon);
        prepareForLoad(startIndex);
        if (_thumbsCon.children().eq(startIndex).hasClass('type-inline') == false) {
          _thumbsCon.children().eq(startIndex).addClass('needs-loading');
        }
      } else {
        for (i = 0; i < lazyLoadingArray.length; i++) {
          loadItem(lazyLoadingArray[i]);
        }
      }

      _thumbsConItems = _thumbsCon.children();
    }

    function setup_sizes() {
      // console.log('setup_sizes() - ');

      // -- autoheight OFF
      if (o.settings_autoHeight == 'off' && o.settings_onlyone == 'on') {
        selfClass.cthis.find('.csc-item').each(function () {
          var _t = $(this);
          // -- assign the thumbs clip height to each item
          _t.css('height', _thumbsClip.outerHeight() + 'px');
        })

      }
    }

    /**
     * setup load handlers
     */
    function checkWhenLoaded() {
      console.log('checkWhenLoaded()', ConstantsCsc.DEBUG_STYLE_3);

      selfClass.cthis.find('.csc-item').each(function () {
        var _t = $(this);
        var ind = _t.parent().children().index(_t);


        // console.info('_t - ', _t);


        if (_t.html() == '') {
          loadedArray[ind] = 1;
          return;
        }

        if (_t.find('.divimage').length > 0) {


          var _cach = _t.find('.divimage').eq(0);
          var toload = _cach.get(0);


          var aux = '';
          if (_cach.attr('data-src')) {

            aux = _cach.attr('data-src');
          } else {

            aux = _t.find('.divimage').eq(0).css('background-image');
          }


          var img = new Image();
          aux = helpersDzsCommon.sanitize_background_url(aux);


          img.onload = function (e) {

            var args = {
              dzscsc_index: ind
              , target: e.target.realparent
              , call_from: 'img onload 561'
            };

            loadedImage(args);
          };


          toload.dzscsc_index = ind;
          toload.realimg = img;
          img.realparent = toload;


          if (aux) {
            loadedArray[ind] = 0;
            img.src = aux;
          } else {

            loadedArray[ind] = 1;
          }


        } else {
          toload = _t.find('img.imageimg').eq(0).get(0);
        }

        if (typeof (toload) == "undefined") {

          var delay = 500;
          var args = {


            call_from: 'toload undefined'
          };

          if (_t.find('.vplayer').length > 0) {
            toload = _t.find('.vplayer').eq(0);
          } else {
            args._con = _t;
            delay = 0;
          }

          loadedArray[ind] = 1;
          args.dzscsc_index = ind;
          args.target = toload;
          //console.info("FROM SETTIMEOUT NONE FOUND",ind, args);
          setTimeout(loadedImage, delay, args);
        } else {

          // console.info('toload -8 ', toload);
          loadedArray[ind] = 0;

          if (toload && $(toload).attr('data-src')) {

            var args = {
              dzscsc_index: ind
              , target: toload
              , call_from: 'hmm'
            };

            toload.dzscsc_index = ind;
          } else {

            var args = {


              call_from: 'toload undefined'
            };
            args.dzscsc_index = ind;
            args.target = toload;
            loadedArray[ind] = 1;
            setTimeout(loadedImage, delay, args);
          }


          //console.info(toload,toload.complete==true,toload.naturalWidth)


          if (toload.complete == true && toload.naturalWidth != 0) {
            //console.info("FROM SET TIMEOUT LOADED");
            setTimeout(loadedImage, 500, args);
          } else {
            $(toload).bind('load', loadedImage);
          }
        }
      });
    }

    function loadedImage(pargs) {
      var ind = 0;
      var _t = $(this);
      var _cscItem = null;

      var margs = {
        dzscsc_index: null
        , target: null
        , _cscItem: null
        , call_from: 'default'
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
        if (pargs.currentTarget) {
          margs.target = pargs.currentTarget;
          if (margs.target && margs.target.dzscsc_index) {
            margs.dzscsc_index = margs.target.dzscsc_index;
          }
        }
      }


      console.info('%c loadedImage -5', ConstantsCsc.DEBUG_STYLE_2, margs);

      if (margs.dzscsc_index) {
        ind = margs.dzscsc_index;
      }
      if (margs.target) {
        _t = $(margs.target);
      }
      if (margs._cscItem) {
        _cscItem = $(margs._cscItem);
      }


      //console.info('$(this) - ',$(this));
      //console.info('margs.target - ',margs.target  );
      //console.info('margs.dzscsc_index -   ',margs.dzscsc_index  );
      //console.info('margs.call_from -  ',margs.call_from  );

      if (_t) {
        _t.addClass('image-is-loaded');

      }
      //console.info(_t,ind);


      if (_t.hasClass('divimage')) {

        if (_t.get(0).style.height == '' || _t.get(0).style.height == 'auto' || _t.hasClass('fullheight') == false) {
          if (_t.hasClass('full-square')) {

            _t.css('height', '0');
          } else {
            if (o.settings_autoHeight == 'on') {
              // -- do we really need this ?
              _t.css({
                'padding-top': Number(Number(_t.get(0).realimg.naturalHeight) / Number(_t.get(0).realimg.naturalWidth) * 100).toFixed(2) + '%'
              })
            }
          }
        }
        _t.data('natural_w', _t.get(0).realimg.naturalWidth);
        _t.data('natural_h', _t.get(0).realimg.naturalHeight);
        _t.data('ratio_wh', (_t.get(0).realimg.naturalWidth / _t.get(0).realimg.naturalHeight));
      }
      loadedArray[ind] = 1;

      //console.info('loaded ind - ',ind);

      //console.info(loadedArray);


      _cscItem = helpersCsc.determineConInLoadedImage(_cscItem, _t);

      //console.info('con - ', _cscItem);


      //console.warn(margs, _t,_cscItem);
      if (_cscItem) {
        var _img = _t.get(0);

        //console.info(ind, _t);

        if (_t.get(0).realimg) {
          _img = _t.get(0).realimg;
        }

        var isImage = !!(_img && _img.naturalWidth && _img.naturalHeight);

        if (isImage) {
          _cscItem.data('naturalWidth', _img.naturalWidth);
        }
        if (isImage) {
          _cscItem.data('naturalHeight', _img.naturalHeight);
        }


        //console.info(_t);
        if (!(isImage)) {
          helpersCsc.treatCscItemVplayer(_cscItem, _t);
        }

        _cscItem.addClass('image-loaded');

        $(_cscItem).data('cscItemParameters', {
          'realImg': _img,
          'isImage': isImage
        })
      }


      var sw = false;

      var tempNr = currNr;

      if (tempNr == -1) {
        tempNr = 0;
      }

      if (loadedArray[tempNr] != 1) {
        sw = true;
      }

      // -- if something is not loaded we wait some more


      if (sw == false) {
        var args = {
          from_check_loaded: true
        };
        init_setup(args);
      }
    }

    function init_setup(pargs) {
      // -- this is where we will setup


      var margs = {
        from_check_loaded: false
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      // console.log('init_setup() - ',margs);
      if (o.settings_force_immediate_load == 'on' && margs.from_check_loaded) {
        //console.info("CHECK LOADED");
        handleResize();
      }


      if (selfClass.cthis.hasClass('init-setuped')) {
        return;
      }
      selfClass.cthis.addClass('init-setuped');

      //console.info('contentscroller - init_setup()');

      setup_sizes();

      pag_total_thumbnr = _thumbsCon.children().length;
      _thumbsCon.children().each(function () {
        var _t = $(this);
        var ind = _t.parent().children().index(_t);
        //console.log(_t, _t.parent().children(), ind);
        if (ind == 0) {
          //_t.addClass('first');
        }
        if (ind == _thumbsCon.children().length - 1) {
          // _t.addClass('last');
        }


        if (o.design_forceitemwidth > 0) {
          //_t.css('width', o.design_forceitemwidth);
        }

        //console.info(_t);

        //console.log(_t.css('margin-left'));

        // -- no margin for PERCENTAGE allowed
        pag_total_thumbsizes += _t.outerWidth(true);
      });
      selfClass.totalComponentWidth = selfClass.cthis.outerWidth(false);
      selfClass.totalComponentHeight = o.design_itemheight;

      _thumbsCon.css({
        //'width' : (pag_total_thumbsizes)
      });


      //console.log(selfClass.cthis);


      // $(document).delegate('.bullet', 'click', click_bullet);

      _arrowsCon.children().bind('click', click_arrow);

      selfClass.cthis.get(0).api_gotoNextPage = gotoNextPage;
      selfClass.cthis.get(0).api_gotoPrevPage = gotoPrevPage;
      selfClass.cthis.get(0).api_destroy_listeners = destroy_listeners;


      helpersCsc.conditionalAddSwiping(o);


      $(window).on('resize', handleResize);

      selfClass.cthis.get(0).api_force_resize = handleResize;
      selfClass.cthis.get(0).api_handleResize = handleResize;
      //selfClass.cthis.get(0).api_force_resize = handleResize;

      calculate_dims({'donotcallgotopage': 'on', 'called_from': 'init_setup()'});

      setTimeout(function () {

        calculate_dims({'donotcallgotopage': 'on', 'called_from': 'init_setup() timeout'});
      }, 1000);

      if (selfClass.slideshowTime > 0) {
        slideshowInter = setInterval(handleHeartBeat, 1000);
      }

      selfClass.cthis.unbind('mouseenter');
      selfClass.cthis.bind('mouseenter', handle_mouseenter);
      selfClass.cthis.unbind('mouseleave');
      selfClass.cthis.bind('mouseleave', handle_mouseleave);


      selfClass.cthis.on('click', '.bulletsCon > .bullet,.cs-arrow', handle_mouse);

      var tempPage = 0;

      //console.info(_thumbsConItems, tempPage);


      var sw_needs_loading = false;
      if (o.settings_onlyone == 'on') {

        if (_thumbsConItems.eq(tempPage).children().length == 1) {

          // console.info('_thumbsConItems.eq(tempPage).children() - 2', _thumbsConItems.eq(tempPage).children());

          if (_thumbsConItems.eq(tempPage).children().get(0).nodeName == 'IMG') {

            // console.info('_thumbsConItems.eq(tempPage).children().get(0).nodeName -', _thumbsConItems.eq(tempPage).children().get(0).nodeName);

            sw_needs_loading = true;
          } else {

          }
        }
      }

      if (sw_needs_loading) {
        inter_check_if_loaded = setInterval(check_if_loaded, 100);
      } else {
        init_allloaded();
      }
      // -- end init_setup()
    }

    function check_if_loaded() {

      if (_thumbsConItems.eq(0).children().get(0).nodeName == 'IMG') {
        if (_thumbsConItems.eq(0).children().get(0).naturalHeight) {
          init_allloaded();
        }
      }
    }


    function init_allloaded() {

      // -- handleLoaded aka
      clearInterval(inter_check_if_loaded);

      selfClass.cthis.addClass('inited-allloaded');

      selfClass.cthis.children('.preloader, .preloader-semicircles').fadeOut('slow');
      // _thumbsClip.animate({'opacity' : 1}, 500);


      //console.info('tempPage - ', tempPage);

      gotoPage(tempPage, {call_from: 'init_allloaded'});
      selfClass.cthis.get(0).api_goto_page = gotoPage;
      handleResize();
    }


    function handle_mouse(e) {
      var _t = $(this);

      if (e.type == 'click') {
        if (_t.hasClass('cs-arrow')) {
          if (_t.hasClass('cs-arrow-left')) {
            gotoPrevPage();
          }
          if (_t.hasClass('cs-arrow-right')) {
            gotoNextPage();
          }

        }
        if (_t.hasClass('bullet')) {

          var ind = _t.parent().children().index(_t);
          if (selfClass.cthis.find(_t).length < 1) {
            return;
          }

          gotoPage(ind, {called_from: 'bullet'});
        }
      }
      if (e.type == 'mousemove') {

        var mx = e.clientX - _thumbsClip.offset().left;
        var aux_rat = mx / selfClass.totalComponentWidth;


        if (o.settings_direction == 'vertical') {
          mx = e.clientY - _thumbsClip.offset().top;
          aux_rat = mx / selfClass.totalComponentHeight;
          // -- normalize 25px
          aux_rat += ((aux_rat - 0.5) * 50) / selfClass.totalComponentHeight;
        }
        viewIndexX = aux_rat * (selfClass.totalItemContainerWidth - selfClass.totalItemContainerClipWidth);


        if (o.settings_direction == 'vertical') {
          // console.log('aux_rat -11 ', aux_rat)
          viewIndexX = aux_rat * (selfClass.totalItemContainerHeight - selfClass.totalItemContainerClipHeight);

          // -- normalize
          if (viewIndexX < 0) {
            viewIndexX = 0;
          }
          // console.log('viewIndexX', viewIndexX, '(ch - cth) - ', (ch - cth));
          if (viewIndexX > Math.abs(selfClass.totalItemContainerHeight - selfClass.totalItemContainerClipHeight)) {
            viewIndexX = Math.abs(selfClass.totalItemContainerHeight - selfClass.totalItemContainerClipHeight);
          }
        }

        viewIndexX = -viewIndexX;
        finish_vix = viewIndexX;


      }
      if (e.type == 'mouseover') {
        if (_t.hasClass('bullet')) {

          var ind = _t.parent().children().index(_t);
          if (selfClass.cthis.find(_t).length < 1) {
            return;
          }

          gotoPage(ind, {called_from: 'mouseover'});
        }
      }
    }


    function destroy_listeners() {

      selfClass.cthis.unbind('mouseenter');
      selfClass.cthis.unbind('mouseleave');
      _arrowsCon.children().unbind('click', click_arrow);

      $(document).undelegate('.bullet', 'click', click_bullet);
      $(window).off('resize', handleResize);
    }

    function handle_mouseenter() {
      is_over = true;
      //console.log(selfClass.cthis);
    }

    function handle_mouseleave() {
      is_over = false;
      //console.log(selfClass.cthis);
    }

    function calculateDimsForCurrPage(pargs) {


      var margs = {
        donotcallgotopage: 'off'
        , calculate_auto_height: true
        , calculate_auto_height_proportional: true
        , calculate_auto_height_default_h: 0
        , calculate_thumbsClip_height: true
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      // console.log('%c calculateDimsForCurrPage()', ConstantsCsc.DEBUG_STYLE_1);

      // o.settings_direction=='horizontal' &&
      // -- autoheight calculationseb
      // console.log('o.settings_autoHeight -16 ', o.settings_autoHeight, '_currPage - ', _currPage)
      if (o.settings_autoHeight == 'on' && _currPage) {
        // -- why horizontal ?

        var currPageHeight = 0;
        if (o.settings_onlyone == 'on') {
          // -- ONLYONE
          currPageHeight = _currPage.find('.csc-item--inner').eq(0).outerHeight();
          //console.info(_c, _c.outerHeight());
          if (_currPage.children('.vplayer').length > 0) {
            currPageHeight = _currPage.width() * 0.562;
          }
        } else {
          // -- lets see if each item is within page


          _thumbsCon.children().each(function () {


            var _t = $(this);
            var isWithinCurrPage = !!(_t_offset_rel_x + -(_t_offset_x_parent) >= -selfClass.currPageX - (selfClass.margin / 2) && _t_offset_rel_x + -(_t_offset_x_parent) < -selfClass.currPageX + page_w_calculated);


            _t_offset_x = _t.offset().left;
            _t_offset_rel_x = _t_offset_x - cthis_offset_x;
            _t_offset_x_parent = parseInt(_t.parent().css('left'), 10);

            if (isWithinCurrPage) {
              if (_t.outerHeight() > currPageHeight) {
                currPageHeight = _t.outerHeight();
              }
            }

            // console.log('isWithingCurrPage - ', isWithingCurrPage);


          })
        }
        // -- finished calculating some vars


        if (o.settings_direction == 'horizontal') {

          if (o.settings_autoHeight_proportional == 'on') {
            if (_currPage.find('.divimage').eq(0).data('natural_w')) {

              var nw = Number(_currPage.find('.divimage').eq(0).data('natural_w'));
              var nh = Number(_currPage.find('.divimage').eq(0).data('natural_h'));

              currPageHeight = selfClass.totalComponentWidth * nh / nw;
              if (currPageHeight > o.settings_autoHeight_proportional_max_height) {
                currPageHeight = o.settings_autoHeight_proportional_max_height;
              }
              currPageHeight += 'px';
            }
          }
        }


        // -- if we have force width
        if (margs.force_width && margs.force_width > 0) {
          _currPage.find('img').eq(0).width(margs.force_width);
          _currPage.find('img').eq(0).addClass('width-already-set');

          _thumbsClip.width(margs.force_width);
          _thumbsClip.addClass('width-already-set');
        }

        if (margs.force_height && margs.force_height > 0) {

          currPageHeight = margs.force_height;
        }

        // console.info('margs.force_height - ',margs.force_height);


        // console.info('currPageHeight calculating height -5 ', currPageHeight);

        _thumbsClip.css({
          //'height' : currPageHeight
        });

        // console.log('currPageHeight - ', currPageHeight);

        if (currPageHeight === 0) {
          setTimeout(calculateDimsForCurrPage, 300)
        }
        _thumbsCon.css({
          'height': currPageHeight
        });
        selfClass.cthis.css({
          'height': 'auto'
        });
      }
    }

    function calculate_dims(pargs) {


      var margs = {
        donotcallgotopage: 'off',
        called_from: 'default'
        , calculate_auto_height: true
        , calculate_auto_height_proportional: true
        , calculate_auto_height_default_h: 0
        , calculate_thumbsClip_height: true
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      // console.log('calculate_dims -5 ', margs);

      selfClass.totalComponentHeight = selfClass.cthis.outerHeight(false);


      page_w_calculated = _thumbsClip.outerWidth();
      cthis_offset_x = selfClass.cthis.offset().left;

      // console.info('selfClass.cthis_offset_x- ',selfClass.cthis_offset_x);


      // console.info('ww - ',ww);
      responsive_per_row = o.per_row;
      if (ww < 600) {

        // console.info('responsive_per_row - ',responsive_per_row);
        if (o.per_row == 4 || o.per_row == 5 || o.per_row == 6) {
          responsive_per_row = 2;
        }
      }


      if (o.settings_onlyone == 'off') {

        helpersCsc.calculateDimensionsForEachItem(selfClass, _thumbsCon, responsive_per_row, o);
      }


      // console.log('we arrive here');
      calculateDimsForCurrPage(margs);
      selfClass.totalItemContainerWidth = _thumbsCon.width(); // -- total width con width
      selfClass.totalItemContainerHeight = _thumbsCon.height();


      setTimeout(function () {
        selfClass.totalItemContainerWidth = _thumbsCon.width();
      }, 1000);


      if (selfClass.currPage == -1) {
        selfClass.currPage = 0;
      }


      // console.info('isw - ',isw, sw_tw);


      helpersCsc.determineIfHasSpaceToScroll(selfClass, _thumbsCon, _thumbsClip, o);
      helpersCsc.determineTotalNumberOfPages(selfClass, selfClass.numberOfItems, o);


      // console.info('selfClass.pag_total_pages - ',selfClass.pag_total_pages, ish, th);


      if (margs && margs.donotcallgotopage == 'on') {

      } else {
      }


      if (pag_last_total_pages != selfClass.pag_total_pages) {

        _bulletsCon.html('');
        for (i = 0; i < selfClass.pag_total_pages; i++) {
          _bulletsCon.append('<span class="bullet"></span>')
        }
      }
      // console.info('calculate_dims()');


      pag_last_total_pages = selfClass.pag_total_pages;


      // console.info('margs.calculate_thumbsClip_height - ', margs.calculate_thumbsClip_height);
      if (margs.calculate_thumbsClip_height) {

        // -- auto-height means that height will adjust via content and not via javascript


        if (selfClass.cthis.hasClass('auto-height') == false) {
          if (o.settings_direction == 'vertical') {
            // console.info(selfClass.currPage);


          }

          //console.info('selfClass.currPage - ',selfClass.currPage);


          if (o.settings_onlyone == 'on') {

            //_thumbsClip.height(_thumbsCon.children().eq(selfClass.currPage).height());
          }
        }
      }

      if (o.outer_thumbs_keep_same_height == 'on') {
        _outerThumbs.css('height', selfClass.totalComponentHeight + 'px');
      }

    }


    function calculate_dims_hard() {


      selfClass.totalItemContainerWidth = _thumbsCon.outerWidth(); // --- swiper total width
      selfClass.totalItemContainerClipWidth = _thumbsClip.width() // --- swiper image width ( visible )


      setup_sizes();

      if (tw_last && tw_last != selfClass.totalComponentWidth) {
        gotoPage(selfClass.currPage, {'called_from': 'tw_last!=tw' + ' tw - ' + selfClass.totalComponentWidth + 'th - ' + selfClass.totalComponentHeight});
      }
      tw_last = selfClass.totalComponentWidth;

    }


    function handleHeartBeat() {
      slideshowCount++;
      //console.log(selfClass.cthis, slideshowCount, slideshowTime);
      if (o.settings_slideshowDontChangeOnHover == 'on') {
        if (is_over == true) {
          return;
        }
      }

      if (slideshowCount >= selfClass.slideshowTime) {
        gotoNextPage();
        slideshowCount = 0;
      }
    }


    function handleResize(e, pargs) {


      var margs = {

        calculate_auto_height: true
        , calculate_auto_height_default_h: 0
      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }


      ww = window.innerWidth;
      // ww = document.body.clientWidth;
      selfClass.totalComponentWidth = selfClass.cthis.width();
      selfClass.totalComponentHeight = selfClass.cthis.height();

      selfClass.totalItemContainerClipWidth = selfClass.totalComponentWidth;
      selfClass.totalItemContainerClipHeight = selfClass.totalComponentHeight;

      // console.info('handleResize from cs', tw,'window.innerWidth -' ,window.innerWidth);


      if (selfClass.totalComponentWidth < 720) {
        selfClass.cthis.addClass('under-720');

        if (o.responsive_720_design_itemwidth) {
          selfClass.design_itemwidth = o.responsive_720_design_itemwidth;
        }
      } else {

        selfClass.cthis.removeClass('under-720');


        if (o.responsive_720_design_itemwidth) {
          selfClass.design_itemwidth = o.design_itemwidth;
        }

      }

      if (selfClass.currPage > -1) {

        margs.called_from = 'handleResize()';
        calculate_dims(margs);
      }


      clearTimeout(inter_calculate_hard);
      inter_calculate_hard = setTimeout(calculate_dims_hard, 100);

      //console.log(tw);
    }

    function click_arrow() {
      var _t = $(this);
      // console.log(_t);
      if (_t.hasClass('arrow-left')) {
        gotoPrevPage();
      }
      if (_t.hasClass('arrow-right')) {
        gotoNextPage();
      }
    }

    function click_bullet() {
      var _t = $(this);
      var ind = _t.parent().children().index(_t);
      if (selfClass.cthis.find(_t).length < 1) {
        return;
      }

      gotoPage(ind);
    }

    function prepareForLoad(arg) {
      var tempNextNr = arg + 1;
      var tempPrevNr = arg - 1;

      if (tempPrevNr <= -1) {
        tempPrevNr = selfClass.numberOfItems - 1;
      }
      if (tempNextNr >= selfClass.numberOfItems) {
        tempNextNr = 0;
      }


      //console.info(tempPrevNr);

      loadItem(tempPrevNr);
      loadItem(arg);
      loadItem(tempNextNr);
    }

    function loadItem(arg) {


      // console.info('lazyLoadingArray -', lazyLoadingArray, arg);
      if (lazyLoadingArray[arg] === 'tobeloaded') {
        var _t = _thumbsCon.children().eq(arg);
//                    console.info(_t);
//                    _t.addClass('needs-loading');

        if (_t.attr('data-source')) {
//                        _t.append('<div class="divimage" style="background-image:url('+_t.attr('data-source')+')"></div>');
          _t.append('<img class="fullwidth" src="' + _t.attr('data-source') + '"/>');
        }
        if (_t.attr('data-divimage_source')) {
//                        _t.append('<div class="divimage" style="background-image:url('+_t.attr('data-source')+')"></div>');
          _t.append('<div class="divimage" style="background-image: url(' + _t.attr('data-divimage_source') + ');" ></div>');
        }

        lazyLoadingArray[arg] = 'loading';
      }


      checkWhenLoaded();

    }

    function gotoNextPage() {
      tempPage = selfClass.currPage + 1;
      if (tempPage > selfClass.pag_total_pages - 1) {
        tempPage = 0;
      }
      //console.log(tempPage, selfClass.currPage);
      gotoPage(tempPage);
    }

    function gotoPrevPage() {
      tempPage = selfClass.currPage - 1;
      if (tempPage < 0) {
        tempPage = selfClass.pag_total_pages - 1;
      }
      //console.log(tempPage);
      //console.log(tempPage, selfClass.currPage);
      gotoPage(tempPage);
    }

    function gotoPage(arg, pargs) {

      var margs = {

        'called_from': 'default',
        'called_from_resize': false

      };

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      // console.log('%cgotoPage() -c ', ConstantsCsc.DEBUG_STYLE_3, arg, margs);


      if (arg > selfClass.pag_total_pages - 1) {
        arg = selfClass.pag_total_pages - 1;
      }


      lastArg = arg;

      if (o.settings_mode == 'onlyoneitem' && o.settings_lazyLoading == 'on') {
        prepareForLoad(arg);
      }


      if (o.settings_transition_only_when_loaded == 'on' && _thumbsCon.children().eq(arg).hasClass('needs-loading') && _thumbsCon.children().eq(arg).hasClass('loaded') == false) {

        //console.info('what');

        inter_wait_loaded = setTimeout(function () {
          gotoPage(arg, margs)
        }, 500);

        return false;
      } else {
        //console.info('what wait');
        clearTimeout(inter_wait_loaded);
      }

      //console.info('action_call_on_gotoItem', action_call_on_gotoItem);

      if (arg != selfClass.pag_total_pages - 1 || o.settings_mode == 'onlyoneitem') {
        selfClass.currPageX = -((items_per_page) * arg) * _thumbsCon.children().eq(0).outerWidth(true);
        selfClass.cthis.removeClass('islastpage');
      } else {
        selfClass.currPageX = -((items_per_page) * arg - (items_per_page - pag_excess_thumbnr)) * _thumbsCon.children().eq(0).outerWidth(true);
        selfClass.cthis.addClass('islastpage');
      }


      if (o.settings_direction == 'vertical') {
        if (o.settings_onlyone == 'on') {
          selfClass.currPageY = _thumbsCon.children().eq(arg).offset().top;

          // console.info('_thumbsCon.children().eq(arg).offset().top, _thumbsCon.eq(0).offset().top - ', _thumbsCon.children().eq(arg).offset().top, _thumbsCon.eq(0).offset().top);

          selfClass.currPageY = -(_thumbsCon.children().eq(arg).offset().top - _thumbsCon.eq(0).offset().top);
        } else {

        }
      }
      if (o.settings_direction == 'horizontal') {
        if (o.settings_onlyone == 'on') {

          if (_thumbsCon && _thumbsCon.children().length) {

            selfClass.currPageY = _thumbsCon.children().eq(arg).offset().top;

            // console.info('_thumbsCon.children().eq(arg).offset().top, _thumbsCon.eq(0).offset().top - ', _thumbsCon.children().eq(arg).offset().top, _thumbsCon.eq(0).offset().top);

            selfClass.currPageX = -(_thumbsCon.children().eq(arg).offset().left - _thumbsCon.eq(0).offset().left);
          }
        } else {


          // if we scroll one page of a time
          selfClass.currPageX = -arg * selfClass.totalItemContainerClipWidth;


          var slide_max_offset = _thumbsClip.outerWidth() - _thumbsCon.outerWidth() + selfClass.margin * 2;
          if (selfClass.currPageX < slide_max_offset) {

            selfClass.currPageX = slide_max_offset;
          }

        }
      }

      // console.log('%c selfClass.currPageX - ', ConstantsCsc.DEBUG_STYLE_2, selfClass.currPageX);

      //console.log(selfClass.cthis, o.settings_transition)


      var animation_time = 500;
      if (selfClass.currPage > -1 && selfClass.currPage != arg && o.settings_onlyone == 'on') {

        var _c = _thumbsCon.children().eq(selfClass.currPage);

        if (o.settings_onlyone == 'on') {
          //console.info(_c);

          if (_c.find('.vplayer').length > 0) {
            var _cach = _c.find('.vplayer').eq(0);


            //console.info(_cach);
            if (_cach.get(0) && _cach.get(0).api_pauseMovie) {
              _cach.get(0).api_pauseMovie();
            }
          }

          _c.addClass('visible-item');


          _c.addClass('transitioning-out');


        }


      }


      var _c2 = _thumbsCon.children().eq(arg);
      _currPage = _c2;
      // console.log('_currPage -11 ', _currPage);
      if (o.settings_mode == 'onlyoneitem') {
        _c2.addClass('visible-item');
      }


      // console.info(o.settings_transition);


      if (margs.called_from_resize == false && action_call_on_gotoItem) {
        selfClass.cthis.get(0).api_do_transition = do_transition;
        //console.info('ceva');
        action_call_on_gotoItem(selfClass.cthis, _thumbsCon.children().eq(arg), {arg: arg});

      }


      do_transition();


      calculate_dims({'donotcallgotopage': 'on', 'called_from': 'gotoPage'});


      _bulletsCon.children().removeClass('active');
      _bulletsCon.children().eq(arg).addClass('active');

      //console.info('_bulletsCon.children().eq(arg) - ',_bulletsCon.children().eq(arg));

    }


    function do_transition(pargs) {

      // console.info('do_transition()', selfClass.cthis, pargs);
      //console.info('do_transition() - ', pargs);
      var margs = {

          'force_width': 0
          , 'force_height': 0
          , 'arg': 0
          , 'called_from_resize': false
        }
      ;

      if (pargs) {
        margs = $.extend(margs, pargs);
      }

      var arg = lastArg;

      if (margs.arg) {
        arg = margs.arg;
      }


      if (o.settings_onlyone == 'on') {

        //------- only one item
        var _c = _thumbsCon.children().eq(arg);
        //console.info(arg,_c);
        _thumbsCon.children().removeClass("currItem");
        //if(arg!=1){

        // console.log('o.settings_transition -', o.settings_transition);

        if (o.settings_transition == 'fade' || o.settings_transition == 'slide' || o.settings_transition == 'wipeoutandfade' || o.settings_transition == 'flyout') {

          _c.addClass('currItem');


          //console.info(_c.children().eq(0),_c.children().eq(0).hasClass('is-video'))
          if (_c.children().eq(0).hasClass('is-video')) {
            //_c.find('.vplayer').eq(0).width(margs.force_width);
            //_c.find('.vplayer').eq(0).height(margs.force_height);
            //_c.data('wipeoutandfade_forced_sizes','on')
          }
        }

        if (margs.called_from_resize !== true) {

          _c.addClass('transitioning-in');
        }


        if (o.settings_transition == 'slide') {

          if (!selfClass.cthis.hasClass('no-need-for-nav')) {
            _thumbsCon.css({
              'left': selfClass.currPageX
            });
          }

        }


        if (o.settings_transition == 'fade') {

        }

        if (o.settings_direction == 'vertical') {

          _thumbsCon.css({
            'top': selfClass.currPageY
          });
        } else {

          if (selfClass.currPageX > 0) {
            selfClass.currPageX = 0;
          }
          _thumbsCon.css({
            'left': selfClass.currPageX
          });
        }

      } else {
        if (!selfClass.cthis.hasClass('no-need-for-nav')) {
          if (o.settings_direction == 'vertical') {
            _thumbsCon.css({
              'top': selfClass.currPageY
            });
          } else {
            if (selfClass.currPageX > 0) {
              selfClass.currPageX = 0;
            }
            _thumbsCon.css({
              'left': selfClass.currPageX
            });
          }
        }


      }


      selfClass.currPage = arg;
      slideshowCount = 0;


      if (_outerThumbs) {
        _outerThumbs.find('.csc-item').removeClass('active');
        _outerThumbs.find('.csc-item').eq(selfClass.currPage).addClass('active');
      }


      if (o.settings_transition == 'fade') {

        setTimeout(function () {
          do_transition_end();
        }, 300)
      }


      //setTimeout(calculate_dims, 500);
    }

    function do_transition_end() {

      //console.info('do_transition_end() - ');

      _thumbsCon.children().removeClass('transitioning-in transitioning-out')


    }

  }
}


(function ($) {


  Math.easeIn = function (t, b, c, d) {

    return -c * (t /= d) * (t - 2) + b;

  };


  $.fn.contentscroller = function (argOptions) {

    var finalOptions = {};
    var cscSettings = require('./js_csc/_settings');
    var defaults = Object.assign({}, cscSettings.default_opts);


    //console.info(o, $(this).attr('data-options'));

    //console.info(typeof o);
    if (typeof argOptions == 'undefined') {
      if (typeof $(this).attr('data-options') != 'undefined') {
        var aux = $(this).attr('data-options');
        try {
          var aux_json = JSON.parse(aux);
          argOptions = $.extend({}, aux_json);

        } catch (err) {
          console.error(err);

          var aux = $(this).attr('data-options');
          aux = 'window.dzscsc_self_options  = ' + aux;
          try {
            eval(aux);
          } catch (err) {
            console.warn('eval error', err);
          }
          // console.info($(this), $(this).attr('data-options'), window.dzscsc_self_options);
          argOptions = $.extend({}, window.dzscsc_self_options);
          window.window.dzscsc_self_options = $.extend({}, {});
        }


        //console.warn(o);

      }
    }
    finalOptions = $.extend(defaults, argOptions);

    //console.info(o);
    this.each(function () {

      var _ag = new DzsContentScroller(this, finalOptions, $);
      return this;

      return this;
    })
  };


  window.dzscsc_init = function (selector, settings) {
    if (typeof (settings) != "undefined" && typeof (settings.init_each) != "undefined" && settings.init_each == true) {
      var element_count = 0;
      for (var e in settings) {
        element_count++;
      }
      if (element_count == 1) {
        settings = undefined;
      }

      $(selector).each(function () {
        var _t = $(this);
        _t.contentscroller(settings)
      });
    } else {
      $(selector).contentscroller(settings);
    }

  };
})(jQuery);


window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();


jQuery(document).ready(function ($) {
  dzscsc_init('.contentscroller.auto-init', {init_each: true})
});
