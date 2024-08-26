// 基于JS实现“人机交互"(主要操作页面中的节点)，核心处理步骤的第一步基本上都是：想要操作谁就先获取谁

/* 
获取的结果是一个对象
1.attributes:NamedNodeMap类数组集合，包含了其拥有的所有属性（例如：内置属性id/class,以及自定义属性）
2.childElementCount=children.length 子元素的个数
3.classList:DOMTokenList类数组集合，包含了所有拥有的样式类名
  box.classList.add/remove/toggle/contains...
  + add:新增样式类
  + remove:移除样式类
  + toggle:之前有这个样式类就是移除，没有解释新增
  + contains:验证是否包含样式类
  + forEach:遍历这些样式类，类似于数组中的forEach遍历方法
  + item：获取第几个样式类名
  + keys: Array Iterator{}
  + entries: Array Iterator{}
  + ...
4.className：包含所有样式类名的字符串
  获取所有样式类名：box.classList.value === box.className
  设置样式类名：
    + box.className = 'xxx' -> 会把之前的class值整体都替换了（className整体操作，classList操作其中的某一个）
    + box.classList.add/remove
5.id:设置或者获取它的id值 
  box.id 
  box.id = xxx
6.innerHTML/innerText:获取或者设置元素（非表单元素）中的内容，表单元素用value
  innerHTML可以识别HTML标签，设置的时候整体替换
  innerText把所有的内容都当做文本处理，设置的时候会把标签当文本输出
  outerHTML/outerText:相比较于innerHTML/innerText，获取的结果包含元素本身
7.onxxx:都是其事件属性，基于这些书信可以做事件绑定
  box.onclick = function (){} ->给box盒子的点击事件行为绑定一个方法，当点击盒子的时候，触发方法执行
8.tagName：获取它的标签名（大写）
9.style：是一个CSSStyleDeclaration类数组集合，用来获取或者修改元素的“行内样式”
  + 只能获取写到元素行内上的样式，写在其他地方的样式是获取不到的，获取样式的方式有：
    + box.style.xxx
    + window.getComputedStyle(元素,[伪类,例如:after/:before]) 获取的结果是一个样式对象CSSStyleDeclaration，对象中包含了当前元素所有经过浏览器计算的样式（只要元素是经过浏览器渲染的，浏览器就会给它进行样式处理）
      + 不论写的是外链/内嵌/行内样式，都可以获取到
      + 有些样式我们没有设置，但是浏览器会赋值默认的样式，这些也可以获取到
      + IE6-8中不兼容这个方法，需要基于 元素.currentStyle 属性获取信息
    + 基于盒子模型属性获取样式
      + clientWidth/Height/Left/Top
      + offsetWidth/Height/Left/Top/Parent
      + scrollWidth/Height/Left/Top
      + getBoundingClientRect
      + ...
  + 设置样式，也是给元素设置的行内样式
    box.style.xxx='xxx'
    类似于font-size这样的样式类名，在JS中都是基于它的驼峰命名法来操作的 fontSize
    box.style.cssText = 'xxx' 批量设置行内样式
   
*/
let box = document.querySelector('#box');
// console.log(typeof box); // 'object'
console.dir(box); // 输出DOM对象 div#box.box

// console.log(box.classList.value === box.className); // true

// 新增
// class="box active"
box.classList.add('active');
box.classList.remove('clearFix');

// class="clearFix"
box.className = 'clearFix';
// class="box active clearFix"
box.className = 'box active clearFix'

// console.log(box.innerHTML,box.innerText); // innerHTML输出带标签的字符串，innerText只输出文本

// 批量设置行内样式
box.style.cssText='color:green;font-size:14px;line-height:30px';

let obj = window.getComputedStyle(box);



