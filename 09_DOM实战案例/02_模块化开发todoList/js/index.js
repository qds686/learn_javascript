init();

function init() {
  // 控制需要立即生效的模块
  initTodoList;
}

var initTodoList = (function () {
  var showInput = document.getElementsByClassName('j-show-input')[0],
    inputWrap = document.getElementsByClassName('input-wrap')[0],
    addItem = document.getElementsByClassName('j-add-item')[0],
    textInput = document.getElementById('textInput'),
    oList = document.getElementsByClassName('j-list')[0],
    inputShow = false,
    // 是否为编辑状态
    isEdit = false,
    // 当前的索引
    curIdx = null;

  // 点击“+”实现inputWrap的显示和隐藏，用标记inputShow判断
  addEvent(showInput, 'click', function () {
    if (inputShow) {
      inputWrapShow('close');

      // 点击编辑按钮后再点击加号要恢复
      restoreStatus();
    } else {
      inputWrapShow('open');
    }
  });

  // 点击增加项目
  // 添加li，1.input为空，不做处理 2.去重 3.判断编辑或添加状态
  addEvent(addItem, 'click', function () {
    var content = textInput.value,
      contentLen = content.length,
      // 动态的获取所有的LI
      oItems = document.getElementsByClassName('item'),
      itemLen = oItems.length,
      itemText;

    // input中没有任何值，则不做处理
    if (contentLen <= 0) return;

    // 添加LI的时候先循环LI去重
    if (itemLen > 0) {
      for (var i = 0; i < itemLen; i++) {
        itemText = elemChildren(oItems[i])[0].innerText;

        if (itemText === content) {
          alert('此项目已经存在！');
          textInput.value = '';
          inputWrapShow('close');
          return;
        }
      }
    }

    // 判断状态
    if (isEdit) {
      var itemP = elemChildren(oItems[curIdx])[0];
      itemP.innerText = content;
    } else {
      // 创建LI并且添加到ul中
      var oLi = document.createElement('li');
      oLi.className = 'item';
      oLi.innerHTML = itemTpl(content);
      oList.appendChild(oLi);
    }
    restoreStatus();

    inputWrapShow('close');
  });

  // 给ul添加事件代理
  addEvent(oList, 'click', function (e) {
    var e = e || window.event,
      tar = e.target || e.srcElement,
      tarName = tar.className,
      oItems = document.getElementsByClassName('item'),
      oParent = elemParent(tar, 2),
      tarIdx = Array.prototype.indexOf.call(oItems, oParent),
      itemLen = oItems.length,
      item;

    if (tarName === 'edit-btn fa fa-edit') {

      // 1.点击编辑，首先让inputWrap显示
      inputWrapShow('open');

      // 2.点击一项背景变为active类，把当前项的内容显示到input中，改变增加项目的内容
      for (var i = 0; i < itemLen; i++) {
        item = oItems[i];
        item.className = 'item';
      }
      oParent.className += ' active';

      // 3.让li中p的innerText显示到input中
      textInput.value = elemChildren(oParent)[0].innerText;

      // 4.修改增加项目
      curIdx = tarIdx;
      addItem.innerHTML = `编辑第${curIdx + 1}项`;
      isEdit = true;
    } else if (tarName === 'remove-btn fa fa-times') {
      // 把这个节点删除，关闭inputWrap，初始化数据
      oParent.remove();
      inputWrapShow('close');
      restoreStatus();
    }
  });

  function inputWrapShow(action) {
    if (action === 'open') {
      inputWrap.style.display = 'block';
      inputShow = true;
    } else if (action === 'close') {
      inputWrap.style.display = 'none';
      inputShow = false;
    }
  }

  function restoreStatus() {
    isEdit = false;
    curIdx = null;
    textInput.value = '';
    addItem.innerHTML = '增加项目';
  }

  function itemTpl(text) {
    return (
      `<p class="item-content">${text}</p>
      <div class="btn-group">
        <a href="javascript:;" class="edit-btn fa fa-edit"></a>
        <a href="javascript:;" class="remove-btn fa fa-times"></a>
      </div>`
    );
  }
})();