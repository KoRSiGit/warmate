
function postAjax(url, data, success) {
  var params = typeof data == 'string' ? data : Object.keys(data).map(
    function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');

  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
    // debugger;
    if (xhr.readyState>3 && xhr.status===200) { success(xhr.responseText); }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}
function decode_json(arg) {
  var fout = {};

  if(arg){

    try{

      fout=JSON.parse(arg);
    }catch(err){
      console.log(err, arg);
    }
  }

  return fout;
}
function add_query_arg(purl, key,value){
  key = encodeURIComponent(key); value = encodeURIComponent(value);

  //if(window.console) { console.info(key, value); };

  var s = purl;
  var pair = key+"="+value;

  var r = new RegExp("(&|\\?)"+key+"=[^\&]*");


  //console.info(pair);

  s = s.replace(r,"$1"+pair);
  //console.log(s, pair);
  var addition = '';
  if(s.indexOf(key + '=')>-1){


  }else{
    if(s.indexOf('?')>-1){
      addition = '&'+pair;
    }else{
      addition='?'+pair;
    }
    s+=addition;
  }

  //if value NaN we remove this field from the url
  if(value=='NaN'){
    var regex_attr = new RegExp('[\?|\&]'+key+'='+value);
    s=s.replace(regex_attr, '');
  }


  //if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};

  return s;
}


export {postAjax,decode_json,add_query_arg};