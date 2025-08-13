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