; (function (doc) {

  var oNav = doc.getElementsByClassName('J_nav')[0],
    oNavItems = oNav.getElementsByClassName('nav-item'),
    oSearchRow = doc.getElementsByClassName('J_searchRow')[0],
    oTipRow = doc.getElementsByClassName('J_tipRow')[0],
    oWarningTip = doc.getElementsByClassName(' J_warningTip')[0],
    oCourseList = doc.getElementsByClassName('J_courseList')[0],
    oPageBtnRow = doc.getElementsByClassName('J_pageBtnRow')[0],
    oPageBtnList = doc.getElementsByClassName('J_pageBtnList')[0],
    oBtnItems = oPageBtnList.getElementsByClassName('btn-item'),
    // operate span remove or regain
    oCourseInputs = oCourseList.getElementsByClassName('course-name-input'),
    oCourseSpans = oCourseList.getElementsByClassName('course-name'),

    oSearchInput = doc.getElementById('J_searchInput'),
    oNavItemsLen = oNavItems.length,

    listItemTpl = doc.getElementById('J_listItemTpl').innerHTML,
    pageBtnItemTpl = doc.getElementById('J_pageBtnItemTpl').innerHTML;

  var field = 'manage',
    pageNum = 0,
    curId = 0,
    // 设置一个不可用的值
    curIdx = -1;

  var APIs = {
    getCourseList: 'http://localhost:8058/api_for_study/index.php/Home/List/getCourseListForManage',
    getSearchList: 'http://localhost:8058/api_for_study/index.php/Home/List/getSearchListForManage',
    doListItem: 'http://localhost:8058/api_for_study/index.php/Home/List/doListItemForManage',
    updateCourseName: 'http://localhost:8058/api_for_study/index.php/Home/List/updateCourseNameForManage'
  }

  var init = function () {
    // 默认获取列表管理的数据
    getCourseList(field, pageNum);
    bindEvent();
  }

  function bindEvent() {
    // 选项卡切换
    oNav.addEventListener('click', navClick, false);
    // 搜索，防抖：连续输入完成再触发事件，节流：一定时间触发一次事件
    oSearchInput.addEventListener('input', debounce(courseSearch), false);
    // 点击分页器切换，获取页面列表
    oPageBtnList.addEventListener('click', changePage, false);
    // 事件代理——操作item 删除/恢复
    oCourseList.addEventListener('click', listClick, false);
  }

  // 点击切换
  function navClick(e) {
    var e = e || window.event,
      tar = e.target || e.srcElement,
      className = tar.className;

    e.stopPropagation();

    if (className === 'nav-lk') {
      var oParent = tar.parentNode,
        item;

      field = oParent.getAttribute('data-field');

      for (var i = 0; i < oNavItemsLen; i++) {
        item = oNavItems[i];
        item.className = 'nav-item';
      }
      oParent.className += ' active';

      // 点击的是search
      if (field === 'search') {
        showWarningTip(true);
        showSearchInput(true);
        showPageBtnRow(false);
        return;
      }

      // 初始化search
      showSearchInput(false);
      oSearchInput.value = '';

      // 每一次点击初始化pageNum
      pageNum = 0;
      getCourseList(field, pageNum);
    }
  }

  // 展示无数据的部分
  function showWarningTip(show) {
    if (show) {
      oTipRow.className = 'tip-row J_tipRow';
      oCourseList.innerHTML = '';
    } else {
      oTipRow.className += ' hide';
    }
  }

  // 展示input搜索框
  function showSearchInput(show) {
    if (show) {
      oSearchRow.className += ' show'
    } else {
      oSearchRow.className = 'search-row J_searchRow';
    }
  }

  // 获取课程列表数据
  function getCourseList(field, pageNum) {
    $.ajax({
      url: APIs.getCourseList,
      type: 'POST',
      dataType: "JSON",
      data: {
        field: field,
        pageNum: pageNum
      },
      success: function (data) {
        var res = data.res,
          pageCount = data.pages;

        // 需要分页
        _setDatas(field, res, pageCount, pageNum);
      },
      error: function () {
        alert('列表获取失败，请重试！');
      }
    });
  }

  // 课程列表渲染，数据绑定
  function renderList(listField, data) {
    var list = '';

    data.forEach(function (elem) {
      list += listItemTpl.replace(/{{(.*?)}}/g, function (node, key) {
        return {
          id: elem.id,
          course: elem.course,
          hour: elem.hour,
          teacher: elem.teacher,
          field: elem.field,
          type: listField === 'trash' ? 'regain' : 'delete',
          typeText: listField === 'trash' ? '恢复' : '删除'
        }[key];
      });
    });
    return list;
  }

  // 输入的时候获取列表
  function courseSearch(e) {
    var e = e || window.event,
      val = trimSpace(this.value),
      valLen = val.length;

    e.stopPropagation();

    if (valLen > 0) {
      getSearchList(val);
    } else {
      showWarningTip(true);
    }
  }

  // 搜索的列表应该是status=1的所有数据
  function getSearchList(keyWord) {
    $.ajax({
      url: APIs.getSearchList,
      type: 'POST',
      dataType: 'JSON',
      data: {
        keyWord: keyWord
      },
      success: function (data) {
        var res = data.res,
          pageCount = data.pages;

        // 点击课程搜索，搜索到的应该是manage列表，没有分页
        // 搜索到的是manage列表的所有项，我们要对数据进行处理，搜索到对应keyword才显示

        res = dataFilter(res, keyWord);
        _setDatas('manage', res);
      },
      error: function () {
        alert('搜索操作失败，请重试！');
      }
    });
  }

  // Ajax获取到数据，设置数据
  function _setDatas(field, data, pageCount, pageNum) {
    if (data && data.length > 0) {
      // 渲染课程列表
      oCourseList.innerHTML = renderList(field, data);
      showWarningTip(false);

      // 渲染分页器
      if (pageCount > 1 && field !== 'search') {
        oPageBtnList.innerHTML = renderPageBtns(pageCount, pageNum);
        showPageBtnRow(true);
      } else {
        oPageBtnList.innerHTML = '';
        showPageBtnRow(false);
      }
    } else {
      // 没有数据
      showWarningTip(true);
    }
  }

  function dataFilter(data, keyWord) {
    return data.reduce(function (prev, elem) {
      var res = elem.course.indexOf(keyWord);

      if (res !== -1) {
        prev.push(elem);
      }

      return prev;
    }, []);
  }

  // 分页器列表渲染
  function renderPageBtns(pageCount, pageNum) {
    var list = '';

    for (var i = 0; i < pageCount; i++) {
      list += pageBtnItemTpl.replace(/{{(.*?)}}/g, function (node, key) {
        return {
          isCur: i === pageNum ? 'cur' : '',
          pageNum: i + 1
        }[key];
      });
    }

    return list;
  }

  // 是否显示分页器
  function showPageBtnRow(show) {
    if (show) {
      oPageBtnRow.className = 'page-btn-row J_pageBtnRow show';
    } else {
      oPageBtnRow.className = 'page-btn-row J_pageBtnRow';
    }
  }

  // 点击分页器实现切换并获取列表 事件代理
  function changePage(e) {
    var e = e || window.event,
      tar = e.target || e.srcElement,
      className = tar.className;

    e.stopPropagation();

    if (className === 'page-btn') {
      var oParent = tar.parentNode,
        // 每一次点击长度可能不同，删除，增加等
        oBtnItemsLen = oBtnItems.length,
        // 当前li的索引
        pageNum = [].indexOf.call(oBtnItems, oParent),
        item;

      for (var i = 0; i < oBtnItemsLen; i++) {
        item = oBtnItems[i];
        item.className = 'btn-item'
      }
      oParent.className += ' cur';
      getCourseList(field, pageNum);
    }
  }

  function listClick(e) {
    var e = e || window.event,
      tar = e.target || e.srcElement,
      className = tar.className,
      itemId = tar.getAttribute('data-id');

    e.stopPropagation();

    switch (className) {
      case 'list-btn delete':
        var c = confirm('确认删除');
        c && doListItem('remove', pageNum, itemId);
        break;
      case 'list-btn regain':
        var c = confirm('确认恢复');
        c && doListItem('regain', pageNum, itemId);
        break;
      case 'course-name':
        showInput(tar);
        break;
      default:
        break;
    }
  }

  function doListItem(type, pageNum, itemId) {
    $.ajax({
      url: APIs.doListItem,
      type: 'POST',
      dataType: 'JSON',
      data: {
        type: type,
        pageNum: pageNum,
        itemId: itemId
      },
      success: function (data) {
        var res = data.res,
          pageCount = data.pages;

        _setDatas(field, res, pageCount, pageNum);
      },
      error: function () {
        alert('操作列表失败，请重试！');
      }
    });
  }

  // 找到当前input显示
  function showInput(target) {
    var oParent = target.parentNode,
      thisInput = oParent.getElementsByClassName('course-name-input')[0],
      thisInputLen = thisInput.value.length;

    hideAllInput();

    curId = thisInput.getAttribute('data-id');
    curIdx = [].indexOf.call(oCourseInputs, thisInput);

    // 显示、聚焦、全选
    thisInput.className += ' show';
    thisInput.focus();
    thisInput.setSelectionRange(0, thisInputLen);

    // 更新课程名称 点击了document
    document.addEventListener('click', updateCourseName, false);
    // 回车
    document.addEventListener('keyup', updateCourseName, false);
  }

  // 让所有的input隐藏
  function hideAllInput() {
    var inputsLen = oCourseInputs.length,
      item;

    for (var i = 0; i < inputsLen; i++) {
      item = oCourseInputs[i];
      item.className = 'course-name-input';
      item.blur();
    }

    // 解除
    document.removeEventListener('click', updateCourseName, false);
    document.removeEventListener('keyup', updateCourseName, false);
  }

  // 事件处理函数，点击document or input回车
  function updateCourseName(e) {
    var e = e || window.event,
      eventType = e.type;

    if (eventType === 'keyup') {
      var keyCode = e.keyCode;

      if (keyCode === 13) {
        submitNewCourseName(curId, curIdx);
      }
      return;
    }

    submitNewCourseName(curId, curIdx);
  }

  // 提交新的课程名称
  function submitNewCourseName(curId, curIdx) {
    hideAllInput();

    var newVal = oCourseInputs[curIdx].value,
      thisCourseSpan = oCourseSpans[curIdx];

    // 修改后和之前的名字不一样才提交
    if (newVal !== thisCourseSpan.innerHTML) {
      $.ajax({
        url: APIs.updateCourseName,
        type: 'POST',
        dataType: 'JSON',
        data: {
          itemId: curId,
          newVal: newVal
        },
        success: function (data) {
          if (data === 'success') {
            thisCourseSpan.innerHTML = newVal;
          } else {
            alert('更改课程名称失败，请重试！');
          }

          curId = 0;
          curIdx = -1;
        },
        error: function () {
          alert('更改课程名称失败，请重试！');
        }
      });
    }
  }

  init();
})(document);