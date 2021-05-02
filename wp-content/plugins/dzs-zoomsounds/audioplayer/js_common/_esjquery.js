let esJquery = class {
  constructor(selector) {

    // console.log('%c typeof selector - ','color: #aaaaaa;', typeof selector, selector);
    if (typeof selector == 'string') {

      this.$el = document.querySelector(selector);
      this.$els = document.querySelectorAll(selector);
    } else {

      this.$el = selector;

      if (isNodeList(selector)) {
        this.$el = selector[0];
      }
      this.$els = [];

      if (isNodeList(selector)) {

        selector.forEach((_el) => {

          this.$els.push(_el);
        })
      } else {

        this.$els.push(this.$el);
      }


    }
  }

  hide() {

    this.$els.forEach(function (el) {
      el.style.display = 'none';
    });
  }

  clone() {
    // -- @only works on first element
    console.log('clone', this.$el);

    const cln = this.$el.cloneNode(true);
    this.$el.parentNode.appendChild(cln)
    return cln;
  }

  show() {

    this.$els.forEach(function (el) {
      el.style.display = '';
    });
  }
  trigger(eventType) {

    this.$els.forEach(function (el) {
      // el.style.display = '';
      const event = new Event(eventType);
      el.dispatchEvent(event);
    });
  }

  addClass(arg) {

    // console.log('addClass',this.$el, this.$els, arg);
    // this.$el.classList.add(arg);


    this.$els.forEach(function (el3) {
      el3.classList.add(arg);
    });
    return this;
  }

  removeClass(arg) {

    // console.log('addClass',this.$el, this.$els, arg);
    // this.$el.classList.add(arg);


    this.$els.forEach(function (el3) {
      el3.classList.remove(arg);
    });
    return this;
  }

  prepend(html) {
    if (typeof html == 'string') {

      const _tempKid = document.createElement("div");
      // _tempKid.innerHTML = html;


      this.$els.forEach(function (el) {
        try {

          el.appendChild(_tempKid);
          el.insertBefore(_tempKid, el.firstChild);
          _tempKid.outerHTML = html;
        } catch (err) {
          console.log('something went wrong .. ', err, this, el);
        }
      })
    }
  }

  get(index) {
    if(index===0){
      return this.$el;
    }
  }
  each(callback) {
    this.$els.forEach((el) => {
        callback($es(el));
      }
    )

  }

  text() {
    // console.log('arguments.length - ', arguments.length);
    if (arguments.length === 0) {

      return this.$el.textContent;
    } else {

      this.$el.textContent = arguments[0];

      return this;
    }
  }
  val() {
    // console.log('arguments.length - ', arguments.length);
    if (arguments.length === 0) {

      return this.$el.value;
    } else {

      this.$el.value = arguments[0];

      return this;
    }
  }

  find(selector) {

    // console.log('this.$el.querySelectorAll(selector) - ',this.$el.querySelectorAll(selector));
    return new esJquery(this.$el.querySelectorAll(selector));
  }

  append(html) {
    if (typeof html == 'string') {

      const _tempKid = document.createElement("div");
      _tempKid.innerHTML = html;


      this.$els.forEach(function (el) {
        try {

          el.appendChild(_tempKid);
        } catch (err) {
          console.log('something went wrong .. ', err, this, el);
        }
      })
    }
  }

  on(evt, sel, handler) {

    // console.log(evt,sel,handler,this.$el);
    this.$el.addEventListener(evt, function (event) {
      var t = event.target;
      while (t && t !== this) {
        if (t.matches(sel)) {
          // console.log('t - ', t);
          handler.call(t, event);
        }
        t = t.parentNode;
      }
    });
    return this;
  }

  hasClass(arg) {
    return this.$el.classList.contains(arg);
  }

  html() {

    const attrArgs = arguments;
    if (attrArgs.length == 0) {
      return this.$el.innerHTML;
    }
    if (attrArgs.length == 1) {

      this.$el.innerHTML = attrArgs[0];

      return this;
    }
  }

  getLast() {
    console.log(this, this.$els);

    if (this.$els.length) {
      return $es(this.$els[this.$els.length - 1]);
    }
    return null;
    // return
  }

  attr() {
    const attrArgs = arguments;
    if (attrArgs.length == 0) {
      console.log('no attrArgs.. ');
    }
    if (attrArgs.length == 1) {
      return this.$el.getAttribute(attrArgs[0]);
    }
    if (attrArgs.length == 2) {
      this.$els.forEach(function (el) {
        el.setAttribute(attrArgs[0], attrArgs[1]);
      });
    }

    return this;
    // console.log('addClass',this.$el, this.$els, arg);
    // this.$el.classList.add(arg);


  }

  remove() {

    console.log('this.$el - ', this.$el);
    this.$el.remove();
  }

  parent() {

    return $es(this.$el.parentNode);
  }

  getEl() {

    return this.$el;
  }

  children() {
    console.log('this.$el.childNodes -', this.$el.childNodes);
    return $es(this.$el.childNodes);
  }

  serialize() {
    var form = this.$el;
    var field, query = '';
    if (typeof form == 'object' && form.nodeName == "FORM") {
      for (var i = 0; i <= form.elements.length - 1; i++) {
        field = form.elements[i];
        if (field.name && field.type != 'file' && field.type != 'reset') {
          if (field.type == 'select-multiple') {
            for (var j = 0; j <= form.elements[i].options.length - 1; j++) {
              if (field.options[j].selected) {
                query += '&' + field.name + "=" + encodeURIComponent(field.options[j].value).replace(/%20/g, '+');
              }
            }
          } else {
            if ((field.type != 'submit' && field.type != 'button')) {
              if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                query += '&' + field.name + "=" + encodeURIComponent(field.value).replace(/%20/g, '+');
              }
            }
          }
        }
      }
    }
    return query.substr(1);
  }
};

function isNodeList(nodes) {
  var stringRepr = Object.prototype.toString.call(nodes);

  return typeof nodes === 'object' &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    (typeof nodes.length === 'number') &&
    (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
}

/**
 * jQuery, but in es6
 * @param query selector
 * @returns {esJquery}
 */
const $es = (arg) => {
  // todo: actually convert to a class maybe..


  return new esJquery(arg)
  // return document.querySelector(arg);
};


window.es_document_ready = function (callback) {
  new Promise((resolutionFunc, rejectionFunc) => {
    // console.log(document.readyState);
    if (document.readyState === 'interactive' || document.readyState === 'complete') {

      resolutionFunc('interactive')

    }

    document.addEventListener('DOMContentLoaded', () => {
      console.log(document.readyState);
      resolutionFunc('DOMContentLoaded')
    }, false);
    setTimeout(() => {

      resolutionFunc('timeout')
    }, 5000);
  }).then(resolution => {
    callback(resolution);
  }).catch(err => {
    callback(err)
  });
}

/** call ajax function
 * {
    'type':'GET',
    'url':'/',
    'data':{},
    'success':null
  }
 */
window.es_ajax = function (pargs) {
  var margs = {
    'type': 'GET',
    'url': '/',
    'data': {},
    'success': null
  };

  if (pargs) {
    margs = Object.assign(margs, pargs);
  }

  let xhr = new XMLHttpRequest();

  xhr.open(margs.type, margs.url);
  var form_data = new FormData();

  // console.log('margs.data - ', margs.data,pargs,margs);
  for (var key in margs.data) {
    form_data.append(key, margs.data[key]);
  }
  // console.log('form_data - ', form_data);

  xhr.send(form_data);
  xhr.addEventListener('load', handle_loaded);

  function handle_loaded(e) {

    // console.log('laded xhr - ',e,xhr);
    if (xhr.status != 200) {

      // console.log('this no status - ', this,e);
    } else { // show the result
      // console.log('this - ', this,e);
      if (margs.success) {
        margs.success(e, this);
      }
    }
  }


}


window.get_query_arg = function (purl, key) {
  //console.info(purl);

  // console.info("THIS", purl, key);
  if (purl.indexOf(key + '=') > -1) {
    //faconsole.log('testtt');
    var regexS = "[?&]" + key + "(.+?)(?=&|$)";
    var regex = new RegExp(regexS);
    var regtest = regex.exec(purl);


    //console.info(regex, regtest);
    if (regtest != null) {
      //var splitterS = regtest;


      if (regtest[1]) {
        var aux = regtest[1].replace(/=/g, '');
        return aux;
      } else {
        return '';
      }


    }
    //$('.zoombox').eq
  }
}


window.add_query_arg = function (purl, key, value) {
  key = encodeURIComponent(key);
  value = encodeURIComponent(value);


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

export default $es;
