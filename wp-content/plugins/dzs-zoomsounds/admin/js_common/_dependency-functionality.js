window.dzs_check_dependency_settings = function (pargs) {

  // -- this checks for all dependencies .. lets make a timer


  if (window.inter_dzs_check_dependency_settings) {
    clearTimeout(window.inter_dzs_check_dependency_settings);

  }

  window.inter_dzs_check_dependency_settings = setTimeout(function () {
    dzs_check_dependency_settings_real(pargs);
  }, 100);


}


window.dzs_check_dependency_settings_real = function (pargs) {
  var margs = {
    target_attribute: 'name'
  }

  var $ = jQuery;
  $('*[data-dependency]').each(function () {
    var _t = $(this);


    // console.info(_t);
    var dep_arr = {};


    var aux_depedency = _t.attr('data-dependency');


    // console.log("%c CALL FROM HERE TOO.. ",'color: #dadfaf;')

    // return false;

    // console.warn('aux_depedency - ',aux_depedency);
    if (aux_depedency.indexOf('"') == 0) {
      aux_depedency = aux_depedency.substr(1, aux_depedency.length);
      aux_depedency = aux_depedency.substr(0, aux_depedency.length - 1);
    }

    // console.warn('aux_depedency - ',aux_depedency);
    aux_depedency = aux_depedency.replace(/{quotquot}/g, '"');

    // console.warn('aux_depedency - ',aux_depedency);
    try {
      dep_arr = JSON.parse(aux_depedency);

      //console.warn(_t, dep_arr);

      if (dep_arr[0]) {


        //console.info(dep_arr[0]);

        var $sourceDependency = null;


        var target_attribute = margs.target_attribute;

        var target_con = $(document);


        if (_t.hasClass('check-label')) {
          target_attribute = 'data-label';
        }
        if (_t.hasClass('check-parent1')) {
          target_con = _t.parent();
        }
        if (_t.hasClass('check-parent2')) {
          target_con = _t.parent().parent();
        }
        if (_t.hasClass('check-parent3')) {
          target_con = _t.parent().parent().parent();
        }


        // console.warn('target_con - ',target_con);
        // console.warn('target_attribute - ',target_attribute);


        if (dep_arr[0].lab) {
          $sourceDependency = target_con.find('*[' + target_attribute + '="' + dep_arr[0].lab + '"]:not(.fake-input)').eq(0);
          if ($sourceDependency.length == 0 && dep_arr[0].lab == 'name') {
            $sourceDependency = target_con.find('*[name="0-settings-' + dep_arr[0].lab + '"]:not(.fake-input)').eq(0);
            // console.log('%c selector - ','color: #00ffdd;','*[name="'+dep_arr[0].lab+'"]:not(.fake-input)');
          }
        }
        if (dep_arr[0].label) {
          $sourceDependency = target_con.find('*[' + target_attribute + '="' + dep_arr[0].label + '"]:not(.fake-input)').eq(0);

          if ($sourceDependency.length == 0 && dep_arr[0].label == 'name') {
            $sourceDependency = target_con.find('*[name="0-settings-' + dep_arr[0].label + '"]:not(.fake-input)').eq(0);
            // console.log('%c selector - ','color: #00ffdd;','*[name="'+dep_arr[0].lab+'"]:not(.fake-input)');
          }
        }
        if (dep_arr[0].element) {


          // -- if it's player generator there is no dzsap_meta_
          if ($('body').hasClass('zoomsounds_page_dzsap-mo')) {
            dep_arr[0].element = String(dep_arr[0].element).replace('dzsap_meta_', '');
          }
          if(_t.attr('data-option-name') === 'dzsap_meta_download_custom_link'){
            // console.log('dep_arr - ap 5 ', dep_arr);
            // console.log('target_attribute - ap 5 ', target_attribute);
          }


          $sourceDependency = target_con.find('*[' + target_attribute + '="' + dep_arr[0].element + '"]:not(.fake-input)').eq(0);
        }


        if (dep_arr[0].element && dep_arr[0].element == 'dzsap_meta_download_custom_link_enable') {
          // console.info('_c - ',_c);
        }

        if(_t.attr('data-option-name') === 'dzsap_meta_download_custom_link'){
          // console.log('_c - ap 5 ', _c);
        }

        var cval = $sourceDependency.val();


        if ($sourceDependency.attr('type') == 'checkbox') {
          if ($sourceDependency.prop('checked')) {

          } else {
            cval = '';
          }
        }

        var sw_show = false;

        if (dep_arr[0].val) {
          for (var i3 in dep_arr[0].val) {

            //console.info(_c, cval, dep_arr[0].val[i3]);
            if (cval == dep_arr[0].val[i3]) {
              sw_show = true;
              break;

            }
          }
        }

        if (dep_arr.relation) {


          // console.error(dep_arr.relation);

          for (var i in dep_arr) {
            if (i == 'relation') {
              continue;
            }


            if (dep_arr[i].value) {
              if (dep_arr.relation == 'AND') {
                sw_show = false;
              }


              if (dep_arr[0].element) {
                $sourceDependency = target_con.find('*[' + target_attribute + '="' + dep_arr[i].element + '"]:not(.fake-input)').eq(0);
              }


              for (var i3 in dep_arr[i].value) {


                // console.info('_c.val() -  ',_c.val(), dep_arr[i].value[i3]);
                if ($sourceDependency.val() == dep_arr[i].value[i3]) {


                  if ($sourceDependency.attr('type') == 'checkbox') {
                    if ($sourceDependency.val() == dep_arr[i].value[i3] && $sourceDependency.prop('checked')) {

                      sw_show = true;
                    }
                  } else {

                    sw_show = true;
                  }

                  break;

                }


                if (dep_arr[i].value[i3] == 'anything_but_blank' && cval) {

                  sw_show = true;
                  break;
                }
              }

              // console.info('sw_show - ',sw_show);
            }

          }

        } else {

          if (dep_arr[0].value) {

            for (var i3 in dep_arr[0].value) {
              if ($sourceDependency.val() == dep_arr[0].value[i3]) {


                if ($sourceDependency.attr('type') == 'checkbox') {
                  if ($sourceDependency.val() == dep_arr[0].value[i3] && $sourceDependency.prop('checked')) {

                    sw_show = true;
                  }
                } else {

                  sw_show = true;
                }

                break;

              }


              if (dep_arr[0].value[i3] == 'anything_but_blank' && cval) {

                sw_show = true;
                break;
              }
            }
          }
        }


        if (sw_show) {
          _t.show();
        } else {
          _t.hide();
        }


      }


    } catch (err) {
      console.info('cannot parse depedency json', "'", aux_depedency, "'", err, _t);
    }
  })
};


window.dzs_handle_submit_dependency_field = function (e) {
  var _t = jQuery(this);

  if (e.type == 'change') {
    //console.info(_t);
    if (_t.hasClass('dzs-dependency-field')) {
      // console.info("ceva");
      dzs_check_dependency_settings();
    }
  }
}

window.dzs_dependency_on_document_ready = function () {
  // console.log('dzs_dependency_on_document_ready - ' );
  var $ = jQuery;


  $(document).off('change', '.dzs-dependency-field', dzs_handle_submit_dependency_field);
  $(document).on('change', '.dzs-dependency-field', dzs_handle_submit_dependency_field);


  setTimeout(function () {

    // console.info($('.dzs-dependency-field'));
    $('.dzs-dependency-field').trigger('change');


    // console.info('hmm',$('.edit_form_line input[name=source], .wrap input[name=source]'));
  }, 800);


}

