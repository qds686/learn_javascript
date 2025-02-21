// 点击每个按钮，输出对应的索引
// var btnList = document.querySelectorAll('button');
// for (var i = 0; i < btnList.length; i++) {
//   btnList[i].onclick = function () {
//     console.log(`当前点击按钮的索引：${i}`);
//   }
// }
// 输出：点击每个按钮，输出的都是5

// 上面的操作实现不了需求
//   + 事件绑定属于异步编程，而循环是同步编程：每一轮做了事件绑定之后，不需要等点击，直接下一轮循环....所以当我们点击按钮的时候，循环早已经结束了「全局的i已经变为5了」
//   + 循环中用var声明的变量，不会产生块级私有上下文：所以i是全局上下文中的

//=>解决方案1：闭包「弊端：性能消耗比较大」

/* 
var btnList = document.querySelectorAll('button');
for (var i = 0; i < btnList.length; i++) {
  (function (i) {
    // i是私有上下文中“私有”变量：循环五轮产生5个私有上线，每个私有上下文中都有一个私有的i，分别存储 0 1 2 3 4
    btnList[i].onclick = function () {
      console.log(`当前点击按钮的索引：${i}`);
    }
  })(i);
  /* 
  私有上下文1
    实参：0 私有1:0
    创建一个小函数(堆 [[scope]]: 私有上下文1)
      我们把小函数堆赋值给了摸个全局按钮的onClick -> 小函数堆不能被是否，对应的私有上下文1也不会被释放，闭包就产生了
  *！/
}
*/

/* 
var btnList = document.querySelectorAll('button');
for (var i = 0; i < btnList.length; i++) {
  btnList[i].onclick = (function (i) {
    return function () {
      console.log(`当前点击按钮的索引：${i}`);
    }
  })(i);
}
*/

/* 
let btnList = document.querySelectorAll('button');
for (let i = 0; i < btnList.length; i++) {
  // 基于let声明：每一轮循环都会产生一个“块级私有上下文”，因为这里创建的小函数依然不给外部的按钮占用，所以也产生了闭包
  btnList[i].onclick = function () {
    console.log(`当前点击按钮的索引：${i}`);
  }
} 
*/

// =>解决方案二：自定义属性
/* 
操作自定义属性两种方案：
1.box是元素对象「堆内存」
box.index = 1; 向堆中设置自定义属性
console.log(box.index);
delete box.index;

2.写在box对应元素的结构上
<button index="0">按钮1</button>
box.setAttribute("index", 0)
box.getAttribute("index")
box.removeAttribute("index")
*/
/* 
var btnList = document.querySelectorAll('button');
for (var i = 0; i < btnList.length; i++) {
  // 循环过程中，把索引i赋值给按钮对象的“自定义属性”
  btnList[i].index = i;
  btnList[i].onclick = function () {
    // this；当前点击的元素对象
    console.log(`当前点击按钮的索引：${this.index}`);
  }
}
*/

// =>解决方案三：事件委托

document.body.onclick = function (e) {
  let target = e.target;
  if (target.tagName === "BUTTON") {
    // 点击的是按钮
    let idx = target.getAttribute('index');
    console.log(`当前点击按钮的索引：${idx}`);
  }
}






