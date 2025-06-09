; (function (node) {

  var TodoList = function () {
    var _self = this;

    this.node = node;
    this.inputShow = false;
    this.isEdit = false;
    this.curIdx = null;

    // 默认配置
    this.defaultConfig = {
      "plusBtn": "",
      "inputArea": "",
      "addBtn": "",
      "list": "",
      "itemClass": ""
    };

    // 获取元素
    this.config = this.getConfig();
    this.itemClass = this.config.itemClass;

    // 没有配置参数就报错
    for (var key in this.defaultConfig) {
      if (!this.config.hasOwnProperty(key)) {
        console.log(errorInfo(key));
        return;
      }
    }

    // 获取元素
    this.setConfig();


    addEvent(this.plusBtn, 'click', function () {
      _self.showInput.call(_self);
    });

    addEvent(this.addBtn, 'click', function () {
      _self.addBtnClick();
    });

    addEvent(this.oList, 'click', function (e) {
      var e = e || window.event,
        tar = e.target || e.srcElement;

      _self.listClick.call(_self, tar);
    });
  }

  TodoList.prototype = {
    getConfig: function () {
      // 拿到配置对象
      return JSON.parse(this.node.getAttribute('data-config'));
    },

    setConfig: function () {
      var config = this.config,
        node = this.node;

      this.inputArea = node.getElementsByClassName(config.inputArea)[0];
      this.addBtn = this.inputArea.getElementsByClassName(config.addBtn)[0];
      this.plusBtn = node.getElementsByClassName(config.plusBtn)[0];
      this.oList = node.getElementsByClassName(config.list)[0];
      this.content = document.getElementById('textInput');
    },

    showInput: function () {
      var _self = this;

      if (_self.inputShow) {
        setInputShow.call(_self, 'close');
      } else {
        setInputShow.call(_self, 'open');
      }
    },

    addBtnClick: function () {
      var _self = this,
        content = _self.content.value,
        contentLen = content.length,
        oItems = _self.oList.getElementsByClassName(_self.itemClass),
        itemLen = oItems.length,
        text;

      if (contentLen <= 0) return;

      if (itemLen > 0) {
        for (var i = 0; i < itemLen; i++) {
          text = elemChildren(oItems[i])[0].innerText;

          if (text === content) {
            alert('已存在该项！');

            setInputShow.call(_self, 'close');
            return;
          }
        }
      }

      if (_self.isEdit) {
        elemChildren(oItems[_self.curIdx])[0].innerText = content;

        setInputStatus.apply(_self, [oItems, null, 'add']);
      } else {
        var oLi = document.createElement('li');
        oLi.className = _self.itemClass;
        oLi.innerHTML = itemTpl(content);
        _self.oList.appendChild(oLi);
      }
      setInputShow.call(_self, 'close');
    },

    listClick: function (tar) {
      var _self = this,
        className = tar.className,
        oParent = elemParent(tar, 2),
        oItems = _self.oList.getElementsByClassName(_self.itemClass),
        itemLen = oItems.length,
        item;

      if (className === 'edit-btn fa fa-edit') {
        for (var i = 0; i < itemLen; i++) {
          item = oItems[i];
          item.className = 'item';
        }

        oParent.className += ' active';

        setInputShow.call(_self, 'open');
        setInputStatus.apply(_self, [oItems, oParent, 'edit']);
      } else if (className = 'remove-btn fa fa-times') {
        oParent.remove();
        setInputShow.call(_self, 'close');
        setInputStatus.apply(_self, [oItems, null, 'add']);
      }
    }
  };

  function setInputShow(action) {
    var oItems = this.oList.getElementsByClassName('item');

    if (action === 'open') {
      this.inputArea.style.display = 'block';
      this.inputShow = true;
    } else if (action === 'close') {
      this.inputArea.style.display = 'none';
      this.inputShow = false;
      this.content.value = '';

      // 点击编辑，再点+关闭：重新打开inputArea为增加
      setInputStatus.apply(this, [oItems, null, 'add']);
    }
  }

  function setInputStatus(oItems, target, status) {
    if (status === 'edit') {
      var idx = Array.prototype.indexOf.call(oItems, target),
        text = elemChildren(target)[0].innerText;

      this.addBtn.innerText = `编辑第${idx + 1}项`;
      this.isEdit = true;
      this.curIdx = idx;
      this.content.value = text;
    } else if (status === 'add') {
      var itemLen = oItems.length,
        item;
      for (var i = 0; i < itemLen; i++) {
        item = oItems[i];

        item.className = 'item';
        this.addBtn.innerText = '增加项目';
        this.isEdit = false;
        this.curIdx = null;
      }
    }
  }

  // 错误模板
  function errorInfo(key) {
    return new Error(
      `您没有配置参数${key}，必须配置的参数列表如下：
      1.打开输入框按钮元素类名：plusBtn,
      2.输入框区域元素类名：inputWrap,
      3.增加项目按钮元素类名：addBtn,
      4.列表承载元素类名：list,
      5.列表项承载元素类名：itemClass`
    );
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

  // 配置写在了html标签上，不需要在外面实例化
  new TodoList();
})(document.getElementsByClassName('wrap')[0]);