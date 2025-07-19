// 模块中写函数
var initCourseTab = (function (doc) {

  var oCourseTabLks = doc.getElementsByClassName('course-tab-lk'),
    oSearchInput = doc.getElementById('js-search-input'),
    oCourseCardList = doc.getElementsByClassName('js-course-card-list')[0],

    courseData = JSON.parse(doc.getElementById('js-course-data').innerHTML),
    tpl = doc.getElementById('js-card-item-tpl').innerHTML,

    oCourseTabLksLen = oCourseTabLks.length;

  return {
    searchCourse: function () {
      var val = oSearchInput.value,
        len = val.length;

      if (len > 0) {
        var data = this.searchData(courseData, val);

        oCourseCardList.innerHTML = data && data.length > 0
          ? this.makeList(data)
          : this.showTip('没有搜索到相关课程');
      } else {
        this.restoreList();
      }
    },

    tabClick: function (e) {
      var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className;

      if (className === 'course-tab-lk') {
        var field = tar.getAttribute('data-field');
        this.changeTabCurrent(tar);
        oCourseCardList.innerHTML = this.makeList(this.filterData(courseData, field));
      }
    },

    makeList: function (data) {
      var list = '';

      data.forEach(function (item) {
        list += tpl.replace(/{{(.*?)}}/g, function (node, key) {
          return {
            img: item.img,
            courseName: item.course,
            isFree: item.is_free === '1' ? 'free' : 'vip',
            price: item.is_free === '1' ? '免费' : `￥${item.price}.00`,
            hours: item.classes
          }[key];
        });
      });
      return list;
    },

    changeTabCurrent: function (currentDom) {
      var item;
      for (var i = 0; i < oCourseTabLksLen; i++) {
        item = oCourseTabLks[i];
        item.className = 'course-tab-lk';
      }
      currentDom.className += ' current';
    },

    restoreList: function () {
      this.changeTabCurrent(oCourseTabLks[0]);
      oCourseCardList.innerHTML = this.makeList(courseData);
    },

    showTip: function (text) {
      return `<div class="course-list-tip">
        <span>${text}</span>
      </div>`;
    },

    filterData: function (data, field) {
      if (field === 'all') {
        return data;
      }

      return data.filter(function (elem) {
        switch (field) {
          case "all":
            return true;
            break;
          case 'free':
            return elem.is_free === '1';
            break;
          case 'vip':
            return elem.is_free === '0';
            break;
          default:
            return true;
        }
      });
    },

    initCourseList: function () {
      oCourseCardList.innerHTML = this.makeList(courseData);
    },

    searchData: function (data, keyword) {
      return data.reduce(function (prev, elem) {
        var res = elem.course.indexOf(keyword);

        if (res !== -1) {
          prev.push(elem);
        }

        return prev;
      }, []);
    }
  }
})(document);

// 公共的函数和事件处理函数的绑定
; (function (doc) {
  var oSearchInput = doc.getElementById('js-search-input'),
    oTabList = doc.getElementsByClassName('js-course-tab-list')[0];

  var init = function () {
    bindEvent();
    initCourseTab.initCourseList();
  }

  function bindEvent() {
    oSearchInput.addEventListener('input', initCourseTab.searchCourse.bind(initCourseTab), false);
    oTabList.addEventListener('click', initCourseTab.tabClick.bind(initCourseTab), false);
  }

  init();
})(document);