jQuery(document).ready(function($){
    //console.log('ceva', $('.dzstoggle'));
    dzstoggle_initalltoggles();

    //setInterval(function(){
    //
    //    //console.info(window.dzstoggle_curr_toggles);
    //    for(var i in window.dzstoggle_curr_toggles){
    //        var _c = window.dzstoggle_curr_toggles[i].find('.toggle-content').eq(0);
    //
    //        if(_c.height()){
    //
    //
    //            _c.css('height', 'auto');
    //
    //            if(Math.abs(_c.height()-_c.data('last_h')) > 20){
    //
    //                var newh = _c.height();
    //
    //
    //                _c.data('last_h', newh);
    //
    //                _c.css({
    //                    'height' : newh
    //                })
    //            }
    //        }
    //    }
    //}, 2000);
});

window.dzstoggle_curr_toggles = [];

function dzstoggle_initalltoggles(){
    jQuery('.dzstoggle').each(function(){
        var _t = jQuery(this);
        //console.log(_t);
        if(_t.hasClass('inited')){
            return;
        }else{
            dzstoggle_inittoggle(_t);
        }
    });
}
function dzstoggle_inittoggle(arg){
    arg.addClass('inited');
    arg.children('.toggle-title').bind('click', click_toggletitle);
    //console.log(arg.prop('class'))
    if(arg.prop('class').indexOf('skin-') == -1){
        arg.addClass('skin-default');
    }
    if(arg.prop('class').indexOf('transition-') == -1){
        //arg.addClass('transition-default');
    }
    function click_toggletitle(){
        var _t = jQuery(this);
        var cthis = _t.parent();
        var cont = cthis.children('.toggle-content');
        
        var conth = cont.outerHeight();
        //console.log(cont, cont.outerHeight());
        if(cthis.hasClass('active')){
            cthis.removeClass('active');
            if(cthis.hasClass('skin-default')){
                cont.css({'height': conth, 'display': 'block'}); setTimeout( function(){ cont.css({'height': 0}); }, 20);
                
                }



            var index = window.dzstoggle_curr_toggles.indexOf(cthis);

            if (index > -1) {
                window.dzstoggle_curr_toggles.splice(index, 1);
            }

        }else{
            cthis.addClass('active');
            conth = cont.outerHeight();
            if(cthis.hasClass('skin-default')){
                cont.css({'height': 'auto'});
                conth = cont.outerHeight();
                cont.css({'height': 0, 'display': 'block'}); setTimeout( function(){ cont.css({'height': conth}); }, 20);

                setTimeout( function(){ cont.css({'height': 'auto'}); }, 400);

            }

            setTimeout(function(){

                window.dzstoggle_curr_toggles.push(cthis);
            },500)
        }
        //console.log(_t);
    }
}