// $是自执行函数返回一个对象，对象中有需要的方法
// $.xx();
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

    o.open(type, url, async);
    type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    o.onreadystatechange = function () {
      if (o.readyState === 4) {
        if (o.status >= 200 && o.status < 300) {
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
      }
    }

    o.send(type === 'GET' ? null : formateDatas(data));

    t = setTimeout(function () {
      o.abort();
      clearTimeout(t);
      t = null;
      o = null;
      throw new Error('This request has been timeout for ' + url);
    }, timeout);
  }

  function formateDatas(obj) {
    var str = '';
    for (var key in obj) {
      str += key + '=' + obj[key] + '&';
    }
    return str.replace(/&$/, '');
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
    get: function (url, dataType, successCB, errorCB) {
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

// $.ajax({
//   type: 'POST',
//   url: 'http://127.0.0.1:9999/user/login',
//   data: {
//     account: '18310612838',
//     password: md5("1234567890")
//   },
//   success: function (data){
//     console.log(data);
//   }
// });

// $.get("http://127.0.0.1:9999/user/login", function (data){
//     console.log(data);
// });

// $.post("http://127.0.0.1:9999/user/login", {
//   account: '18310612838',
//   password: md5("1234567890")
// }, function (data) {
//   console.log(data);
// })