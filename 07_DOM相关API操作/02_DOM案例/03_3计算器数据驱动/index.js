; (function () {
  var oComputedBox = document.getElementById('computedBox'),
    data = JSON.parse(document.getElementsByClassName('J_data')[0].innerHTML),
    tpl = document.getElementById('J_tpl').innerHTML,
    oList = document.getElementsByClassName('list')[0],
    oBottom = document.getElementsByClassName('bottom')[0],
    oBottomTpl = document.getElementById('J_totalTpl').innerHTML;

  var init = function init() {
    renderList(data);
    renderTotal(data);
    // 事件代理
    oList.addEventListener('click', computed, false);
  }

  var renderList = function renderList(data) {
    var list = '';

    data.forEach(item => {
      list += tpl.replace(/{{(.*?)}}/g, function (node, key) {
        return {
          id: item.id,
          count: item.count,
          price: item.price,
          subtotal: item.count * item.price
        }[key];
      });
      oList.innerHTML = list;
    });
  };

  var renderTotal = function renderTotal(data) {
    var list = '',
      counts = 0,
      prices = 0,
      arr = [0];
    data.forEach(item => {
      counts += item.count;
      prices += item.price * item.count;
      if (item.count > 0) arr.push(item.price);
    });
    list += oBottomTpl.replace(/{{(.*?)}}/g, function (node, key) {
      return {
        counts: counts,
        prices: prices,
        maxPrice: Math.max(...arr)
      }[key];
    });
    oBottom.innerHTML = list;
  }

  // 点击按钮，控制data中的某一项count的改变，数据改变视图则改变 MVC
  var computed = function computed(e) {
    var e = e || window.event,
      tar = e.target || e.srcElement,
      tagName = tar.tagName.toLowerCase(),
      className = tar.className,
      oParent = tar.parentNode,
      listItems = document.getElementsByClassName('list-item'),
      // 想要获取索引，也可以在数据绑定的时候给增加自定义属性
      curIdx = Array.prototype.indexOf.call(listItems, oParent);

    // 点击的是 加号 或者 减号
    if (tagName === 'i') {
      var obj = data[curIdx];
      if (className === 'minus') {
        obj.count--;
        obj.count < 0 ? obj.count = 0 : null;
      }
      if (className === 'plus') {
        obj.count++;
        obj.count > 10 ? obj.count = 10 : null;

      }
      renderList(data);
      renderTotal(data);
    }
  }

  init();
})();


