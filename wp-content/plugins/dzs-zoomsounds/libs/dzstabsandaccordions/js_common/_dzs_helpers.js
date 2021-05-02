exports.can_history_api = function () {
  return !!(window.history && history.pushState);
}


exports.get_query_arg = function (purl, key) {
  if (purl.indexOf(key + '=') > -1) {
    //faconsole.log('testtt');
    var regexS = "[?&]" + key + "=.+";
    var regex = new RegExp(regexS);
    var regtest = regex.exec(purl);


    if (regtest != null) {
      var splitterS = regtest[0];
      if (splitterS.indexOf('&') > -1) {
        var aux = splitterS.split('&');
        splitterS = aux[1];
      }
      var splitter = splitterS.split('=');

      return splitter[1];

    }
    //$('.zoombox').eq
  }
}


exports.add_query_arg = function (purl, key, value) {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  //if(window.console) { console.info(key, value); };

  var s = purl;
  var pair = key + "=" + value;

  var r = new RegExp("(&|\\?)" + key + "=[^\&]*");


  //console.info(pair);

  s = s.replace(r, "$1" + pair);
  //console.log(s, pair);
  var addition = '';
  if (s.indexOf(key + '=') > -1) {


  } else {
    if (s.indexOf('?') > -1) {
      addition = '&' + pair;
    } else {
      addition = '?' + pair;
    }
    s += addition;
  }

  //if value NaN we remove this field from the url
  if (value == 'NaN') {
    var regex_attr = new RegExp('[\?|\&]' + key + '=' + value);
    s = s.replace(regex_attr, '');
  }


  //if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};

  return s;
}
