; (function (doc) {
  var searchInput = doc.getElementsByClassName('J_searchInput')[0],
    wdList = doc.getElementsByClassName('J_wdList')[0],
    listWrap = wdList.parentNode,
    listTpl = doc.getElementById('J_listTpl').innerHTML,
    lkBtn = doc.getElementsByClassName('J_lkBtn')[0],
    dataArr = [];

  var init = function () {
    bindEvent();
  }

  function bindEvent() {
    searchInput.addEventListener('input', editInput, false);

    /* 
    blur 事件比 click 事件先触发的问题:
      + 当 input 失去焦点（blur）时，如果用户点击下拉列表中的选项，
      + 由于 blur 事件先触发，会导致下拉列表被隐藏，从而 click 事件无法正常触发。
    解决：
      + 使用 mousedown 替代 click，mousedown 事件在 blur 之前触发：
      + 延迟执行 blur 操作  
    */
    searchInput.addEventListener('blur', function () {
      var t = setTimeout(function(){
        listWrap.style.display = 'none';
        clearTimeout(t);
        t = null;
      }, 200);
    }, false);

    searchInput.addEventListener('focus', function () {
      var val = _trimSpace(searchInput.value),
        valLen = val.length;

      if (valLen) renderList(dataArr);
    }, false);
  }

  // 模板渲染list
  function renderList(data) {
    var list = '',
      val = _trimSpace(searchInput.value),
      dataLen = data.length,
      item;

    if (dataLen) {
      data.forEach(function (elem, index) {
        list += listTpl.replace(/{{(.*?)}}/gim, function (node, key) {
          return {
            wd: elem,
            suggest: _setWdStyle(val, elem)
          }[key];
        });
      });
      wdList.innerHTML = list;
      listWrap.style.display = 'block';
    } else {
      wdList.innerHTML = '';
      listWrap.style.display = 'none'
    }
  }

  // 随着输入获取data
  function editInput() {
    var val = _trimSpace(searchInput.value),
      valLen = val.length;
    
    // 点击百度一下，立即跳转
    lkBtn.setAttribute("href", "https://www.baidu.com/s?wd=" + val);

    if (valLen > 0) {
      getDatas(val, 'setDatas');
    } 
  }

  // JSONP跨域访问数据
  function getDatas(value, callbackName) {
    // var oScript = doc.createElement('script');
    // oScript.src = 'https://www.baidu.com/sugrec?prod=pc&wd=' + value + '&cb=' + callbackName;
    // doc.body.appendChild(oScript);
    // doc.body.removeChild(oScript);

    $.ajax({
      url: 'https://www.baidu.com/sugrec?prod=pc&wd=' + value,
      type: 'GET',
      dataType: 'JSONP',
      jsonp: 'cb',
      // jsonpCallback: ''
      success: function (data) {
        data = filterDatas(data);

        dataArr = data;
        renderList(data);
      }
    });
  }

  // 对data进行过滤
  function filterDatas(data) {
    if (!data.g) return [];

    return data.g.reduce(function (prev, elem) {
      prev.push(elem.q);
      return prev;
    }, []);
  }

  // JSONP callback的函数，用于返回数据
  // window.setDatas = function (data) {
  //   dataArr = data;
  //   renderList(dataArr);
  // }

  // 去掉空格
  function _trimSpace(str) {
    return str.replace(/\s+/g, '');
  }

  // 设置item中关键字和其他字的样式
  function _setWdStyle(value, word) {
    // 如果是大写，改成小写，不然会错误拼接显示输入AA ->显示 AAaabc -> 应该是aabc
    value = value.toLowerCase();
    return '<span class="font-normal">' + value + '</span>' + word.replace(value, '');
  }

  init();
})(document);