var $ = (function () {

  function _doAjax(opt) {
    var o = window.XMLHttpRequest ?
      new XMLHttpRequest() :
      new ActiveXObject('Microsoft.XMLHTTP');

    if (!o) throw new Error('您的浏览器不支持异步发起HTTP请求');

    var opt = opt || {},
      type = (opt.type || 'GET').toUpperCase(),
      async = '' + opt.async === 'false' ? false : true,
      dataType = opt.dataType || 'JSON',
      jsonp = opt.jsonp || 'cb',
      jsonpCallback = opt.jsonpCallback || 'jQuery' + randomNum() + '_' + new Date().getTime(),
      url = opt.url,
      data = opt.data || null,
      timeout = opt.timeout || 30000,
      error = opt.error || function () { },
      success = opt.success || function () { },
      // 无论成功、失败、超时、中断都会执行complete函数
      complete = opt.complete || function () { },
      t = null;

    if (!url) {
      throw new Error('您没有填写URL');
    }

    if (dataType.toUpperCase() === 'JSONP' && type !== 'GET') {
      throw new Error('如果dataType为JSONP，请您将type设置为GET');
    }

    if (dataType.toUpperCase() === 'JSONP') {
      var oScript = document.createElement('script');
      oScript.src = url.indexOf('?') === -1
        ? url + '?' + jsonp + '=' + jsonpCallback
        : url + '&' + jsonp + '=' + jsonpCallback;
      document.body.appendChild(oScript);
      document.body.removeChild(oScript);

      window[jsonpCallback] = function (data) {
        success(data);
        delete window[name];
      }

      return;
    }

    o.open(type, url, async);
    type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    o.onreadystatechange = function () {
      if (o.readyState === 4) {
        // 响应状态
        if ((o.status >= 200 && o.status < 300) || o.status === 304) {
          switch (dataType.toUpperCase()) {
            case 'JSON':
              success(JSON.parse(o.responseText));
              break;
            case 'TEXT':
              success(o.responseText);
              break;
            case 'XML':
              success(o.responseXML);
              break;
            default:
              success(JSON.parse(o.responseText));
          }
        } else {
          error();
        }
        complete();
        clearTimeout(t);
        t = null;
        o = null;
      }
    }

    o.send(type === 'GET' ? null : formateDatas(data));

    // 超时设置
    t = setTimeout(function () {
      if (o) {
        o.abort();
        clearTimeout(t);
        t = null;
        o = null;
        throw new Error('This request has been timeout for ' + url);
      }
    }, timeout);
  }

  function formateDatas(obj) {
    var str = '';
    for (var key in obj) {
      str += key + '=' + obj[key] + '&';
    }
    return str.replace(/&$/, '');
  }

  function randomNum() {
    var num = '';
    for (var i = 0; i < 20; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  }

  return {
    ajax: function (opt) {
      // 把参数拿到外边处理
      _doAjax(opt);
    },
    post: function (url, data, dataType, successCB, errorCB, completeCB) {
      _doAjax({
        type: 'POST',
        url: url,
        data: data,
        dataType: dataType,
        success: successCB,
        error: errorCB,
        complete: completeCB
      });
    },
    get: function (url, dataType, successCB, errorCB, completeCB) {
      _doAjax({
        type: 'GET',
        url: url,
        dataType: dataType,
        success: successCB,
        error: errorCB,
        complete: completeCB
      });
    }
  };
})();


function trimSpace(str) {
  return str.replace(/\s+/g, '');
}


function clearTimer(timer) {
  // 清除定时器并且赋值为null
  if (timer) {
    clearTimeout(timer);
  }
  return null;
};

function throttle(func, wait) {
  // init params
  if (typeof func !== 'function') throw new TypeError('func is not a function');
  wait = +wait;
  if (isNaN(wait)) wait = 300;

  // handler
  let timer = null,
    // 记录上一次func触发的时间
    previous = 0;

  /**
   * 假如每隔5ms触发一次operate，我们需要500ms执行一次func，设置一个定时器，等待495ms，执行func
   * 第10ms...如果已经存在一个定时器等待执行了，则啥都不处理即可
   * 到495ms后，把func执行了，如果此时滚动还在继续，我们还需要再设置定时器，再间隔XX时间，去执行func
   */
  return function operate(...params) {
    let now = +new Date(),
      // 当前时间和上一次执行的时间差有没有超过设置的频率wait
      remaining = wait - (now - previous);

    clearTimeout(timer);

    if (remaining <= 0) {
      // 两次触发的时间间隔超过设定的频率，则立即执行函数
      func.call(this, ...params);
      // 每次执行完函数记录最后一次执行的时间
      previous = +new Date();
      timer = clearTimer(timer);
    } else if (!timer) {
      // 间隔时间不足设定的频率，而且还未设置等待的定时器，则设置定时器等待执行函数即可
      timer = setTimeout(() => {
        func.call(this, ...params);
        previous = +new Date();
        // 清除定时器，并且timer赋值为null，下次才能继续设置定时器
        timer = clearTimer(timer);
      }, remaining);
    }
  };
};