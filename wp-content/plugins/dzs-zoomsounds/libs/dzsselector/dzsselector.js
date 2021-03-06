

window.dzssel_startup_init = true;
window.dzssel_click_triggered = false;

function dzs_slide_up(_arg, pargs){


  var margs = {
    duration: 300
    ,queue:false
    ,complete: function(){

    }
  };


  if(pargs){
    margs = jQuery.extend(margs,pargs);
  }

  _arg.css('height', _arg.outerHeight());


  // console.info()

  _arg.animate({
    'height': 0
  },margs)
}


function dzs_slide_down(_arg, pargs){


  var margs = {
    duration: 300
    ,queue:false
    ,complete: function(){

    }
  };


  if(pargs){
    margs = jQuery.extend(margs,pargs);
  }

  _arg.css('height', 'auto');


  var realh = _arg.outerHeight();

  _arg.css('height', '0px');

  if(realh){
    _arg.animate({
      'height': realh
    },margs)
  }
}



(function($) {


  $.fn.dzsselector = function(o) {

    //==default options
    var defaults = {
      'opener': ''
      ,'placeholder': 'default'

    };

//        console.info(this, o);

    if (typeof o == 'undefined') {
      if (typeof $(this).attr('data-options') != 'undefined' && $(this).attr('data-options') != '') {
        var aux = $(this).attr('data-options');
        aux = 'var aux_opts = ' + aux;
        eval(aux);
        o = aux_opts;
      }
    }
    o = $.extend(defaults, o);


    this.each(function () {
      var _t = $(this);
      var _t_class = String(_t.attr('class'));
      var _theSelect = null;
      var _feeder = null

      var _wrapper = null;

      var cthis = null;

      var _opener_wrap = null;
      var _opener_main = null;




      var type='select';



      init();

      function init(){
        _t_class = _t_class.replace('dzs-style-me', '');

        if(_t.hasClass('opener-listbuttons')){
          o.opener = 'opener-listbuttons';
        }
        if(_t.hasClass('opener-bigoptions')){
          o.opener = 'opener-bigoptions';
        }
        if(_t.hasClass('opener-radio')){
          o.opener = 'opener-radio';
        }
        if(_t.hasClass('opener-list')){
          o.opener = 'opener-list';
        }

        if(_t.hasClass('type-checkbox')){
          type = 'checkbox';
        }


        if(_t.get(0) && _t.get(0).nodeName=="INPUT"){
          return false;
        }

        //console.info(o);


        if(_t.next().hasClass('dzs-style-me-feeder')){
          _feeder = _t.next();
        }
        //console.info(_t);



        // -- if we have treated this , we have parent
        if(_t.hasClass('treated') || _t.parent().hasClass('dzs-select-wrapper') || _t.parent().hasClass('select-wrapper')){

          if(_t.hasClass('skin-justvisible')){

            _wrapper = _t.parent();

            if(_theSelect){

              _theSelect = _wrapper.find('select').eq(0);
            }

            if(_wrapper){
              _wrapper.find('.dzs-select-wrapper-head').unbind('click');
              _wrapper.find('.dzs-select-wrapper-head').bind('click', function(){
                //console.info(_theSelect);
                //_theSelect.click(function(){
                //    //do stuff here
                //});
                //_theSelect.click();

                openSelect(_theSelect);
              })
            }
          }

          return false;
        }
        _t.addClass('treated');
        // console.info('we treated', _t);

        var str_w = '';




        if(_t.get(0).style && _t.get(0).style.width!='' && !isNaN(parseInt(_t.get(0).style.width,10))){
          str_w = 'width: '+parseInt(_t.get(0).style.width,10)+'px';
        }



        _t.wrap('<div class="dzs-select-wrapper fake-input '+_t_class+'" style="'+str_w+'"></div>');

        _wrapper = _t.parent();
        cthis = _wrapper;



        if(_t.parent().find('select').length){

          _theSelect = _t.parent().find('select').eq(0);
        }

        var val = '';

        if(_theSelect && _theSelect.find(':selected').text()){
          // val = $(this).find(':selected').text();
          val = _theSelect.find(':selected').text();
        }


        if(o.placeholder=='default'){
          if(_wrapper.find('.label-all').length){
            o.placeholder = _wrapper.find('.label-all').eq(0).html();
          }
        }

        if(o.placeholder=='default'){
          o.placeholder = 'Search ...';
        }


        if(val==''){
          val = o.placeholder;
        }



        var aux2 = '<div class="dzs-select-wrapper-head">';



        if(_wrapper.find('.label-curr-selected').length){
          aux2+='<span class="the-text the-text--curr-selected">'+_wrapper.find('.label-curr-selected').eq(0).html()+'</span>';
          // o.placeholder = _wrapper.find('.label-all').eq(0).html();
        }

        aux2+='<span class="the-text the-text--placeholder">'+val+'</span>';



        if(cthis.hasClass('skin-charm')){
          aux2+='<span class="plus-sign"><svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 12 12" enable-background="new 0 0 12 12" xml:space="preserve"> <circle fill="#999999" cx="6" cy="6" r="6"/><rect class="rect1" x="5" y="2" fill="#FFFFFF" width="2" height="8"/><rect class="rect2" x="2" y="5" fill="#FFFFFF" width="8" height="2"/></svg></span>';
        }

        aux2+='</div>';

        _wrapper.prepend(aux2);




        // -- if we have ul element
        if(_t.get(0) && _t.get(0).nodeName=='UL'){
          var aux3 = '<select name="'+_t.attr('data-name')+'">';

          for(i=0;i<_t.children().length;i++){
            aux3+='<option value="'+_t.children().eq(i).attr('data-value')+'">'+_t.children().eq(i).attr('data-value')+'</option>';
          }

          aux3+='</select>';
          _t.after(aux3);
        }


        if(_t.parent().find('select').length){

          _theSelect = _t.parent().find('select').eq(0);
        }


        if(_theSelect){

          _theSelect.on('change.dzssel', function(){


            // -- on change
            if(_theSelect.attr('name')=='type'){

              // console.info('_theSelect changed', _theSelect, _theSelect.attr('name'), _theSelect.val());
            }

            //console.info(_t.parent().find('.dzs-select-wrapper-head .the-text'));
            var val = '';


            val = $(this).find(':selected').html();


            // console.info('selector val for text -',val);

            if(val==''){
              val = "Select ...";
            }
            // console.info('selector final val for text -',val);

            _t.parent().find('.dzs-select-wrapper-head .the-text').html(val);

            var curr_sel_ind = 0;

            for(var i in _theSelect.children()){
              if(_theSelect.val() == _theSelect.children().eq(i).html()){

                if(_theSelect.attr('name')=='type'){

                  // console.info('found i ' ,i);
                }

                curr_sel_ind = i;
              }
            }


            if(String(_t_class).indexOf('opener-')>-1){

            }

          });



          if(_theSelect.hasClass('do-not-trigger-change-on-init')==false) {
            _theSelect.trigger('change');
          }


          _theSelect.get(0).selector_wrap = _wrapper;

          _theSelect.bind('focus', function(){

            if(_wrapper.hasClass('skin-beige')){
              _wrapper.addClass('select-focused');
            }
          })

          _theSelect.bind('focusout', function(){
            _wrapper.removeClass('select-focused');

          })



        }



        if(String(_t_class).indexOf('opener-')>-1){

          // console.info('_t.parent() - ',_t.parent());


          var _c = _t.parent().find('.dzs-select-wrapper-head');


          _c.data('selector_wrap', _wrapper)

          // console.info('_c - ',_c);

          _c.on('click',function(e){
            var _t2 = $(this).data('selector_wrap');



            // console.info(_t2);

            // console.info(e, $(e.target), $(e.target).hasClass('search-field'));


            if($(e.target).hasClass('search-field') ) {


            }else{



              if(_t2.hasClass('active-animation')){

                if(type!='checkbox'){

                }
                close_opener({
                  'call_from':'opener click'
                });

              }else{
                open_opener();
              }

            }


            setTimeout(function(){

              var auxoptions = {
                columnWidth: 1,
                itemSelector: '.masonry-gallery--item'
              };

              //console.log( _t.parent().find('.dzslayouter .items-con'));
              if($.fn.masonry){

                _t.parent().find('.dzslayouter .items-con').masonry(auxoptions);
              }
            },500)

          })
        }else{

          //console.info(_wrapper);
          if(_wrapper){
            _wrapper.find('.dzs-select-wrapper-head').bind('click', function(){
              //console.info(_theSelect);
              //_theSelect.click(function(){
              //    //do stuff here
              //});
              //_theSelect.click();

              openSelect(_theSelect);
            })
          }
        }


        //console.log(_wrapper);
        setTimeout(function(){

          _wrapper.addClass('init-readyall')
        },100);

        if(_t.parent().hasClass('opener-bigoptions') || o.opener == ('opener-listbuttons') || o.opener == ('opener-radio') ||  o.opener == ('opener-list')){

          var aux = '<div class="'+ String(o.opener)+'-wrap real-opener-wrap">';

          if(o.opener=='opener-list' || o.opener=='opener-bigoptions'){

            // -- we just need opener-list for search
            if(o.opener=='opener-list' && _t.parent().hasClass('disable-search')==false) {
              aux += '<input class="search-field"/>';
            }
            aux+='<div class="'+ String(o.opener)+' real-opener">';
          }
          //console.info(o, o.opener,aux);





          var selectedind = 0;

          // console.info('_t - ',_t);
          // console.info('_t.children() - ',_t.children());
          for(var i=0;i<_t.children().length;i++){
            var _c = _t.children().eq(i);
            if(_c.prop('selected')==true){
              selectedind = i;
            }
          }



          if(o.opener=='opener-bigoptions'){
            aux+='</div>';
          }

          aux+='</div>';





          _t.parent().append(aux);


          if(o.opener=='opener-bigoptions' || o.opener=='opener-list'){
            _opener_wrap = cthis.find('.'+o.opener+'-wrap');
            _opener_main = cthis.find('div.'+o.opener+'.real-opener');

          }


          if(o.opener=='opener-listbuttons' || o.opener=='opener-radio'){
            _opener_wrap = cthis.find('.'+o.opener+'-wrap');
            _opener_main = cthis.find('div.'+o.opener+'-wrap');

          }


          // console.info('selectedind - ',selectedind, _t.parent(), _t.parent().find('.select-option'), _opener_main);


          // console.info("WHERE IS WHERE", _t.parent());
          _t.parent().off('click');
          _t.parent().on('click','.select-option', handle_mouse);


          reinit();



          if(_opener_main){

            _opener_main.find('.select-option').eq(selectedind).addClass('active-checked');

            // console.info(_opener_main, _opener_main.children(), _opener_main.find('.select-option').eq(selectedind));
          }
        }




        if(_theSelect){

          _theSelect.get(0).api_reinit = reinit;
          _theSelect.get(0).api_destroy = destroy;
          _theSelect.get(0).api_recheck_value_from_input = recheck_value_from_input;
        }

        _wrapper.on('keyup.dzssel', '.search-field', handle_change);



      }

      function destroy(){


        console.info('destroying', _theSelect);

        if(_theSelect.prev().hasClass('dzs-select-wrapper-head')){
          _theSelect.prev().remove();
        }

        if(_theSelect.next().hasClass('opener-listbuttons-wrap')){
          _theSelect.next().remove();
        }

        if(_theSelect.parent().hasClass('dzs-select-wrapper')){
          _theSelect.unwrap();
        }
      }

      function recheck_value_from_input(){

        // -- we can call this from api

        console.log('recheck_value_from_input() ')

        var ind = 0;
        _theSelect.children().each(function(){
          var _t2 = $(this);

          // console.info('_t2 - ',_t2);
          // console.info('_t2.prop(checked) - ',_t2.prop('selected'));

          if(_t2.prop('selected')){

            // console.info('final ind - ',ind);


            if(_opener_wrap) {

              _opener_wrap.children().removeClass('active-checked');
              _opener_wrap.children().eq(ind).addClass('active-checked');
            }
            _t.parent().find('.dzs-select-wrapper-head .the-text').html(_t2.html());
            return false;
          }

          ind++;



        })


        // console.info(_opener_main);
        // console.info(_opener_wrap);

      }

      function close_opener(pargs){


        var margs = {
          call_from:'default'
        };


        if(pargs){
          margs = jQuery.extend(margs,pargs);
        }


        console.info('close_opener',margs);

        var delay = 300;

        cthis.removeClass('active-animation');
        if(o.opener=='opener-list'){
          delay = 0;
        }
        setTimeout(function(){
          cthis.removeClass('active-checked');
        },delay);


        if(String(_t_class).indexOf('opener-bigoptions')>-1){


          dzs_slide_up(_opener_wrap, {
            duration: delay
            ,queue:false
            ,complete: function(){

            }

          })

          ;
        }

        cthis.find('.search-field').val('').trigger('keyup');
      }

      function open_opener(){
        cthis.addClass('active-checked');
        setTimeout(function(){
          cthis.addClass('active-animation');
        },50);


        // console.info(_t_class);
        if(String(_t_class).indexOf('opener-bigoptions')>-1){


          dzs_slide_down(_opener_wrap, {
            duration: 300
            ,queue:false
            ,complete: function(){

            }
          })
        }

        if(o.opener=='opener-list'){

        }
      }


      function reinit(){


        // console.info('reinit()');


        // console.info('_t - ',_t);
        // console.info('_t.children() - ',_t.children());

        if(_opener_main){
          // console.info('_opener_main - ',_opener_main);
          _opener_main.html('');
        }else{

          console.warn('o.opener - ',o.opener);
          if(o.opener=='opener-bigoptions' || o.opener=='opener-list'){
            _opener_wrap = cthis.find('.'+o.opener+'-wrap');
            _opener_main = cthis.find('div.'+o.opener+'');

          }


          if(o.opener=='opener-listbuttons' || o.opener=='opener-radio'){
            _opener_wrap = cthis.find('.'+o.opener+'-wrap');
            _opener_main = cthis.find('div.'+o.opener+'-wrap');

          }
        }



        if(_feeder){
          for(var i=0;i<_feeder.children().length;i++){


            var aux ='';
            //console.log(_t.children().eq(i));

            var tag = 'div';


            if(_feeder.children().eq(i).get(0).nodeName=='LABEL'){
              tag = 'label';
            }
            if(_feeder.children().eq(i).get(0).nodeName=='SECTION'){
              tag = 'section';
            }

            aux+='<'+tag+' class="bigoption select-option';

            // console.warn('_feeder.children().eq(i) - ',_feeder.children().eq(i));
            if(_feeder.children().eq(i).hasClass('active-checked')){
              aux+=' active-checked';
            }

            aux+='">'+_feeder.children().eq(i).html();

            if(o.opener=='opener-radio'){
              aux+='<div class="small-bubble"></div>';
            }

            aux+='</'+tag+'>';




            if(_opener_main){
              _opener_main.append(aux);

              _opener_main.children().last().addClass(_feeder.children().eq(i).attr('class'));
            }else{
              _opener_wrap.append(aux);
              _opener_wrap.children().last().addClass(_feeder.children().eq(i).attr('class'));
            }
          }
        }else{
          // -- no feeder

          var _c = _t;

          if(type=='checkbox'){
            if(_t.children('.dzs-style-me-feeder').length){
              _c = _t.children('.dzs-style-me-feeder').eq(0);
            }
          }
          for(i=0;i<_c.children().length;i++){
            var aux ='';
            //console.log(_t.children().eq(i));


            var tag = 'div';


            var _cach = _c.children().eq(i);


            // console.info('_cach - ',_cach);
            if(_cach.get(0).nodeName=='LABEL'){
              tag = 'label';
            }
            if(_cach.get(0).nodeName=='SECTION'){
              tag = 'section';
            }





            // console.info('_t - ',_t);
            // console.info('_t.children() - ',_t.children());
            aux+='<'+tag+' class="bigoption select-option';


            // console.warn('_feeder.children().eq(i) - ',_feeder.children().eq(i));
            if(_cach.hasClass('active')){
              aux+=' active-checked';
              // todo: what is active-checked ?
            }


            aux+='"';

            if(_cach.attr('data-term_slug')){
              aux+=' data-term_slug="'+_cach.attr('data-term_slug')+'"'
            }
            if(_cach.attr('data-term_id')){
              aux+=' data-term_id="'+_cach.attr('data-term_id')+'"'
            }
            if(_cach.attr('data-type')){
              aux+=' data-type="'+_cach.attr('data-type')+'"'
            }

            aux+='>'+_cach.html()+'</'+tag+'>';


            if(_opener_main){
              _opener_main.append(aux);
            }else{
              _opener_wrap.append(aux);
            }
          }

          if(_c.hasClass('dzs-style-me-feeder')){

            _c.children().remove();
          }


        }

        setTimeout(function(){
          if(_theSelect && _theSelect.hasClass('do-not-trigger-change-on-reinit')==false) {
            _theSelect.trigger('change');
          }
          cthis.find('.search-field').trigger('keyup');


          if(_opener_wrap){

            var aux = _opener_wrap.html();

            // console.info('aux - ',aux);


            if(aux.indexOf('{{starssvg}}')>-1){
              aux = aux.replace(/{{starssvg}}/g, window.svg_star+window.svg_star+window.svg_star+window.svg_star+window.svg_star)
              _opener_wrap.html(aux);
            }


          }




        },100);
      }



      function handle_mouse(e){
        var _t = $(this);

        if(e.type=='click'){
          if(_t.hasClass('select-option')){

            if(window.dzssel_click_triggered==false){
              var _t2 = $(this);

              console.log('click .. select-option', _t2, e);

              // -- active

              var sw_had_active = false;
              var sw_is_anyone_active = false;

              if(_t2.hasClass('active-checked')){
                sw_had_active = true;
              }



              _t2.removeClass('active-checked');


              // -- if it is select, remove other selected
              _t2.parent().children().removeClass('active-checked');

              if(sw_had_active===false){
                _t2.addClass('active-checked');
              }

              // console.info('sw_had_active - ',sw_had_active, _t2)

              var ind = _t2.parent().children('.select-option').index(_t2);


              if(_theSelect){

                _theSelect.children().eq(ind).prop('selected',true);



                // console.warn("TRIGGER SELECT FROM HERE", 'hmm', _theSelect);
                _theSelect.trigger('change');
              }



              var str_curr_selected = '';

              _t2.parent().children().each(function(){
                var _t22 = $(this);

                if(_t22.hasClass('active-checked')){

                  sw_is_anyone_active = true;

                  if(str_curr_selected){
                    str_curr_selected+=', ';
                  }

                  str_curr_selected+=_t22.find('.the-label--name').text();
                }
              })


              console.info('sw_is_anyone_active  active-checked - ',sw_is_anyone_active, _wrapper.find('.the-text--curr-selected'));
              if(sw_is_anyone_active==false){
                _wrapper.find('.the-text--curr-selected').addClass('empty');
              }else{

                _wrapper.find('.the-text--curr-selected').removeClass('empty');
                _wrapper.find('.the-text--curr-selected').text(str_curr_selected);

              }



              window.dzssel_click_triggered = true;

              setTimeout(function(){
                window.dzssel_click_triggered = false;
              },50);

              // e.stopPropagation();
              // e.preventDefault();

            }


          }
        }
      }



      function handle_change(e){
        var _t = $(this);

        if(e.type=='keyup'){
          if(_t.hasClass('search-field')){
            // console.info(_opener_main);


            _opener_main.children().each(function(){
              var _t2 = $(this);

              // console.info(_t2.text());

              if(String(_t2.text()).toLowerCase().indexOf( String(_t.val()).toLowerCase() ) > -1){
                _t2.show();
              }else{
                _t2.hide();
              }

              if(_t.val()==''){
                _t2.show();
              }
            })
          }
        }
      }




    });



  };



  window.dzssel_init = function(selector, settings) {

    // console.info('dzssel_init -  ',selector,settings);
    if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
      var element_count = 0;
      for (var e in settings) { element_count++; }
      if(element_count==1){
        settings = undefined;
      }

      $(selector).each(function(){
        var _t = $(this);
        // console.info('dzssel_init _t ',_t);
        _t.dzsselector(settings)
      });
    }else{
      $(selector).dzsselector(settings);
    }

  };
})(jQuery);

jQuery(document).ready(function($){

  // console.info("$('select.dzs-style-me') - ", $('select.dzs-style-me'));

  if(window.dzssel_startup_init){

    dzssel_init('*.dzs-style-me', {init_each: true
      ,'call_from': 'dzssel startup'});
  }
});

var openSelect = function(selector){
  var element = jQuery(selector)[0],
    worked = false
  ;
  if (document.createEvent) { // all browsers
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    worked = element.dispatchEvent(e);
  } else if (element.fireEvent) { // ie
    worked = element.fireEvent("onmousedown");
  }
  if (!worked) { // unknown browser / error
    alert("It didn't worked in your browser.");
  }
}


window.svg_star = '<svg enable-background="new -1.23 -8.789 141.732 141.732" height="141.732px" id="Livello_1" version="1.1" viewBox="-1.23 -8.789 141.732 141.732" width="141.732px" xml:space="preserve" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g id="Livello_100"><path d="M139.273,49.088c0-3.284-2.75-5.949-6.146-5.949c-0.219,0-0.434,0.012-0.646,0.031l-42.445-1.001l-14.5-37.854   C74.805,1.824,72.443,0,69.637,0c-2.809,0-5.168,1.824-5.902,4.315L49.232,42.169L6.789,43.17c-0.213-0.021-0.43-0.031-0.646-0.031   C2.75,43.136,0,45.802,0,49.088c0,2.1,1.121,3.938,2.812,4.997l33.807,23.9l-12.063,37.494c-0.438,0.813-0.688,1.741-0.688,2.723   c0,3.287,2.75,5.952,6.146,5.952c1.438,0,2.766-0.484,3.812-1.29l35.814-22.737l35.812,22.737c1.049,0.806,2.371,1.29,3.812,1.29   c3.393,0,6.143-2.665,6.143-5.952c0-0.979-0.25-1.906-0.688-2.723l-12.062-37.494l33.806-23.9   C138.15,53.024,139.273,51.185,139.273,49.088"/></g><g id="Livello_1_1_"/></svg>';