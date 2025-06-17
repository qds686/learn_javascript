; (function () {
  var oBtnGroup = document.getElementsByClassName('btn-group')[0],
    oBtnItems = document.getElementsByClassName('btn-item'),
    oList = document.getElementsByClassName('j-list')[0],
    oTpl = document.getElementById('J_itemTpl').innerHTML,
    oLoading = document.getElementsByClassName('loading')[0],
    cache = {},
    page = 0,
    t = null;

  function init() {
    bindEvent();
    getAjaxCourses(page);
  }

  function bindEvent() {
    addEvent(oBtnGroup, 'click', btnClick);
  }

  function render(data) {
    var len = data.length,
      list = '',
      item;
    for (var i = 0; i < len; i++) {
      item = data[i];
      return list += setTplToHTML(oTpl, regTpl, {
        folder: item.folder,
        classname: item.classname,
        name: item.name,
        watched: item.watched
      });
    }
    oList.innerHTML = list;
  }

  function btnClick(e) {
    var e = e || window.event,
      tar = e.target || e.srcElement,
      oParent = tar.parentNode,
      className = tar.className,
      indexOf = Array.prototype.indexOf,
      idx = -1;

    if (className === 'page-lk') {
      var len = oBtnItems.length,
        idx = indexOf.call(oBtnItems, oParent),
        item;

      page = idx;
      cache[page] ? getCacheCourses() : getAjaxCourses();

      for (var i = 0; i < len; i++) {
        item = oBtnItems[i];
        item.className = 'btn-item';
      }
      if (oParent.className === 'btn-item cur') return;
      oParent.className += ' cur';
    }
  }

  function getAjaxCourses() {
    $.ajax({
      // url: 'http://study.jsplusplus.com/Lfcourses/getCourses',
      url: 'http://study.lfclass.com/Index/getCourses',
      type: 'POST',
      dataType: 'JSON',
      data: {
        page: page
      },
      success: function (data) {
        cache[page] = data;
        oLoading.style.display = 'block';
        t = setTimeout(function () {
          render(data);
          oLoading.style.display = 'none';
        }, 500);
      },
      error: function () {
        console.log('获取错误');
      }
    });
  }

  function getCacheCourses() {
    var data = cache[page];
    render(data);
  }

  init();
})();