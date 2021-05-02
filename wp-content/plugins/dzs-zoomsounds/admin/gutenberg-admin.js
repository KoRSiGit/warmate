jQuery(document).ready(function($){


  setInterval(function(){
    // console.info()

    $('.audiogallery:not(.inited)').each(function(){
      var _t2 = $(this);
      dzsag_init(_t2);
    })
    $('.audioplayer-tobe').each(function(){
      var _t2 = $(this);
      _t2.audioplayer();
    });

    // console.info('tinymce - ',window.tinyMCE,window.tinyMCE.editors,window.tinyMCE.get('mce_0'));
  },2000);
});