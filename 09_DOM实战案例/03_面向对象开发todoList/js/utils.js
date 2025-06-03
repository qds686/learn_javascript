// 绑定事件处理函数
function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + type, function () {
      fn.call(el);
    });
  } else {
    el['on' + type] = fn;
  }
}

// 找出父级元素下的所有子元素
function elemChildren(node) {
  var temp = {
    'length': 0,
    'splice': Array.prototype.splice
  },
    len = node.children.length;

  for (var i = 0; i < len; i++) {
    var childItem = node.children[i];

    if (childItem.nodeType === 1) {
      temp[temp.length] = childItem;
      temp['length']++;
    }
  }
  return temp;
}

// 通过节点指定向上级寻找第n个父级元素
function elemParent(node, n){
  var type = typeof(n);

  if(type === 'undefined'){
    return node.parentNode;
  }else if(n <= 0 || type !== 'number'){
    return undefined;
  }

  while(n){
    node = node.parentNode;
    n--;
  }
  return node;
}