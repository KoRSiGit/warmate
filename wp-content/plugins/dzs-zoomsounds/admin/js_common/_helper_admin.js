// returns the favorite book
export function addUploaderButtons() {

  var $ = jQuery;
  $(document).off('click.dzswup', '.dzs-wordpress-uploader');
  $(document).on('click.dzswup', '.dzs-wordpress-uploader', function (e) {
    var _t = $(this);
    var _targetInput = _t.prev();


    if (_t.parent().hasClass('upload-for-target-con')) {
      _targetInput = _t.parent().find('input').eq(0);
    } else {
      if (_t.parent().parent().parent().hasClass('upload-for-target-con')) {
        _targetInput = _t.parent().parent().parent().find('input').eq(0);
      }
    }


    var searched_type = '';

    if (_targetInput.hasClass('upload-type-audio')) {
      searched_type = 'audio';
    }
    if (_targetInput.hasClass('upload-type-video')) {
      searched_type = 'video';
    }
    if (_targetInput.hasClass('upload-type-image')) {
      searched_type = 'image';
    }

    console.log('addUploaderButtons()');


    var frame = wp.media.frames.dzsp_addimage = wp.media({
      title: "Insert Media",
      library: {
        type: searched_type
      },

      // Customize the submit button.
      button: {
        // Set the text of the button.
        text: "Insert Media",
        close: true
      }
    });

    // When an image is selected, run a callback.
    frame.on('select', function () {
        // Grab the selected attachment.
        var attachment = frame.state().get('selection').first();
        var filename = attachment && attachment.attributes && attachment.attributes.filename ? attachment.attributes.filename : '';
        var attachmentId = attachment.attributes ? attachment.attributes.id : 0;

        //console.log(attachment.attributes.url);
        var sourceForDzsap = attachment.attributes.url;

        if (_t.hasClass('insert-id')) {
          sourceForDzsap = attachment.attributes.id;
        }

        _targetInput.val(sourceForDzsap);
        _targetInput.trigger('change');

        if (filename && filename.length > 5 && (filename.indexOf('.mp3') > filename.length - 5 || filename.indexOf('.wav') > filename.length - 5 || filename.indexOf('.m4a') > filename.length - 5)) {
          window.dzsap_waveform_autogenerateWithId(attachmentId)
        }

        var _con = null;

        if (_targetInput.parent().parent().hasClass('tab-content')) {
          _con = _targetInput.parent().parent();


        }


        if (_targetInput.attr('name') == 'dzsap_meta_item_source') {


          console.info('narayana');
          if (_con) {


            console.info('attachment.attributes - ', attachment.attributes);
            console.info('attachment.attributes.artist - ', attachment.attributes.artist);
            console.info('attachment.attributes.artist - ', attachment.attributes['artist']);


            setTimeout(function (arg) {

              // -- for  some reason there is a delay...
              console.info('attachment.attributes - ', arg.attributes);
              console.info('attachment.attributes.artist - ', arg.attributes.artist);
              console.info('attachment.attributes.artist - ', arg.attributes['artist']);


              if (arg.attributes.title) {

                var lab = 'the_post_title';
                if (_con.find('*[name="' + lab + '"]').eq(0).val() == '') {
                  _con.find('*[name="' + lab + '"]').eq(0).val(arg.attributes.title);
                }
                setTimeout(function (arg2) {
                  arg2.trigger('change');
                }, 500, _con.find('*[name="' + lab + '"]').eq(0))
              }
              if (arg.attributes.artist) {

                var lab = 'artistname';

                // console.info('_con.find(\'*[name="\'+lab+\'"]\') - ',_con.find('*[name="'+lab+'"]'));
                if (_con.find('*[name="' + lab + '"]').eq(0).val() == '') {
                  _con.find('*[name="' + lab + '"]').eq(0).val(arg.attributes.artist);
                }

                setTimeout(function (arg2) {
                  arg2.trigger('change');
                }, 500, _con.find('*[name="' + lab + '"]').eq(0))
              }
            }, 500, attachment);

          }
        }

        if (_targetInput.attr('name').indexOf('item_source') > -1 || _targetInput.attr('name') == 'source') {

          // console.info('_targetInput.parent().find(\'.dzsap_meta_source_attachment_id\') - ',_targetInput.parent().find('*[name="dzsap_meta_source_attachment_id"]'));
          _targetInput.parent().find('*[name="dzsap_meta_source_attachment_id"]').eq(0).val(attachment.attributes.id)
        }
        // console.info('_targetInput - ',_targetInput);
//            frame.close();
      }
    );

    // Finally, open the modal.
    frame.open();

    e.stopPropagation();
    e.preventDefault();
    return false;
  })
  ;


  $(document).off('click', '.dzs-btn-add-media-att');
  $(document).on('click', '.dzs-btn-add-media-att', function () {
    var _t = $(this);

    var args = {
      title: 'Add Item',
      button: {
        text: 'Select'
      },
      multiple: false
    };

    if (_t.attr('data-library_type')) {
      args.library = {
        'type': _t.attr('data-library_type')
      }
    }

    // console.info(_t);

    var item_gallery_frame = wp.media.frames.downloadable_file = wp.media(args);

    item_gallery_frame.on('select', function () {

      var selection = item_gallery_frame.state().get('selection');
      selection = selection.toJSON();

      var ik = 0;
      for (ik = 0; ik < selection.length; ik++) {

        var _c = selection[ik];
        //console.info(_c);
        if (_c.id == undefined) {
          continue;
        }

        if (_t.hasClass('button-setting-input-url')) {

          _t.parent().parent().find('input').eq(0).val(_c.url);
        } else {

          _t.parent().parent().find('input').eq(0).val(_c.id);
        }


        _t.parent().parent().find('input').eq(0).trigger('change');

      }
    });


    // Finally, open the modal.
    item_gallery_frame.open();

    return false;
  });


  $('.uploader-target').off('change');
  $('.uploader-target').on('change', function () {

    var _t = $(this);
    var val = _t.val();
    var _previewer = null;

    if (_t.prev().hasClass('uploader-preview')) {
      _previewer = _t.prev();
    }

    if (_previewer) {


      // console.info(val);

      if (val && isNaN(Number(val)) == false) {


        var data = {
          action: 'dzs_get_attachment_src'
          , id: val
        };


        jQuery.ajax({
          type: "POST",
          url: window.ajaxurl,
          data: data,
          success: function (response) {

            console.warn(response, (response && (response.indexOf('.jpg') > -1 || response.indexOf('.jpeg') > -1)));

            if (response && (response.indexOf('.jpg') > -1 || response.indexOf('.jpeg') > -1)) {

              _previewer.css('background-image', 'url(' + response + ')')
              _previewer.html(' ');
              _previewer.removeClass('empty');
            } else {

              _previewer.html('');
              _previewer.addClass('empty');
            }
          },
          error: function (arg) {
            if (typeof window.console != "undefined") {
              console.warn('Got this from the server: ' + arg);
            }

          }
        });
      } else {

        _previewer.css('background-image', 'url(' + val + ')')
        _previewer.html(' ');
        _previewer.removeClass('empty');


      }

      if (val == '') {

        _previewer.html('');
        _previewer.addClass('empty');
      }


    }
  });


  setTimeout(function () {
    $('.uploader-target').trigger('change');
  }, 500);
}

export function addGutenbergButtons() {
  return setInterval(function () {
    // console.info(' tinymce - ',window.tinyMCE,window.tinyMCE.editors);

    if (window.tinyMCE) {
      for (var i in window.tinyMCE.editors) {
        var _el = window.tinyMCE.editors[i];
        var $_el = _el.$();

        // -- gutenberg ..

        if ($_el.hasClass('wp-block-freeform')) {
          if ($_el.parent().parent().parent().find('.wp-content-media-buttons').length === 0) {
            // $_el.parent().parent().before('<div class="wp-content-media-buttons"></div>');
            $_el.parent().parent().parent().find('.block-library-classic__toolbar').append('<div class="wp-content-media-buttons"></div>');

          }
          window.dzsap_add_media_buttons();
        }


        // console.info('_el - ',_el);
        // console.info('_el - ',_el.$());
        // console.info('el - ',el);
        // console.info('el - ',el());
      }
    }
  }, 2000);
}


export function reskin_select() {
  for (var i = 0; i < jQuery('select').length; i++) {
    var _cache = jQuery('select').eq(i);
    //console.log(_cache.parent().attr('class'));

    if (_cache.hasClass('styleme') == false || _cache.parent().hasClass('select_wrapper') || _cache.parent().hasClass('select-wrapper') || _cache.parent().hasClass('dzs--select-wrapper')) {
      continue;
    }
    var sel = (_cache.find(':selected'));
    _cache.wrap('<div class="dzs--select-wrapper"></div>')
    _cache.parent().prepend('<span>' + sel.text() + '</span>')
  }
  jQuery(document).off("change.dzsselectwrap");
  jQuery(document).on("change.dzsselectwrap", ".dzs--select-wrapper select", change_select);


  function change_select() {
    var selval = (jQuery(this).find(':selected').text());
    jQuery(this).parent().children('span').text(selval);
  }

}

// exports the variables and functions above so that other modules can use them
// module.exports.addGutenbergButtons = addGutenbergButtons;
// module.exports.addUploaderButtons = addUploaderButtons;
// module.exports.reskin_select = reskin_select;


window.wp_pseudoHighlightMenuItem = function(topLevelPageName, topLevelPostName){
  var $ = jQuery;
  $("#toplevel_page_"+topLevelPageName+", #toplevel_page_"+topLevelPageName+" > a").addClass("wp-has-current-submenu");
  $("#toplevel_page_"+topLevelPageName+" .wp-first-item").addClass("current");
  $("#menu-posts-"+topLevelPostName+", #menu-posts-"+topLevelPostName+">a").removeClass("wp-has-current-submenu wp-menu-open");
}

export function show_feedback(arg, pargs) {


  var margs = {
    extra_class: ''
  }


  if (pargs) {
    margs = jQuery.extend(margs, pargs);
  }
  var _feedbacker = jQuery('.feedbacker').eq(0);


  var theclass = 'feedbacker ' + margs.extra_class;

  if (margs.extra_class == '') {
    //console.info(arg.indexOf('success - '));
    if (arg.indexOf('success - ') == 0) {
      arg = arg.substr(10);
    }
    if (arg.indexOf('error - ') == 0) {
      arg = arg.substr(8);
      theclass = 'feedbacker is-error';
    }
  }

  _feedbacker.attr('class', theclass);

  _feedbacker.html(arg);
  _feedbacker.fadeIn('fast');


  setTimeout(function () {

    _feedbacker.fadeOut('slow');
  }, 2000);

}

export function parse_response(response) {

  var arg = {};
  try {
    arg = JSON.parse(response);


  } catch (err) {
    console.log('did not parse', response);
  }

  return arg;
}