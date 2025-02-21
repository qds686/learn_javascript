(function (window, noGlobal) {
  "use strict";
  // window -> window noGlobal -> undefined/true

  // jQuery是一个构造函数
  var version = "3.6.0",
    jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context);
    };
  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    jquery: version
    // ...
  };

  // init
  var rootjQuery = jQuery(document),
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
    init = jQuery.fn.init = function (selector, context, root) {
      var match, elem;
      if (!selector) return this;
      root = root || rootjQuery;

      if (typeof selector === "string") {
        if (selector[0] === "<" &&
          selector[selector.length - 1] === ">" &&
          selector.length >= 3
        ) { // <a> 传递过来的是HTML字符串
          // ['<a>', '<a>', undefined, index: 0, input: '<a>',groups: undefined]
          match = [null, selector, null];
        } else { // 匹配ID选择器
          // ['#xx', undefined, '#xx', index: 0, input: '#xx',groups: undefined]
          match = rquickExpr.exec(selector);
        }
        // html字符串或者ID选择器 && HTML字符串 || context没有传递
        if (match && (match[1] || !context)) {

          // handle: $(html) -> $(array)
          // 是HTML字符串
          if (match[1]) {
            // context是JQ的实例则取第一项DOM对象，不是返回原DOM对象
            context = context instanceof jQuery ? context[0] : context;
            jQuery.merge(this, jQuery.parseHTML(
              match[1],
              context && context.nodeType ? context.ownerDomument || context : document,
              true
            ));
            // ...
          } else { }
          // context没有传 或者 是JQ对象
        } else if (!context || context.jquery) {
          return (context || root).find(selector);
        } else {
          return this.constructor(context).find(selector);
        }
      } else if (selector.nodeType) {
        this[0] = selector;
        this.length = 1;
        return this;
      } else if (isFunction(selector)) {
        return root.ready !== undefined ? root.ready(selector) : selector(jQuery);
      }
      return jQuery.makeArray(selector, this);
    };
  init.prototype = jQuery.fn;

  /* 静态私有属性方法 */
  var arr = [];
  var push = arr.push;

  jQuery.makeArray = function (arr, results) { };

  // 合并两个数组或者类数组
  jQuery.merge = function (first, second) {
    var len = +second.length,
      j = 0,
      // 第一个类数组的长度+1
      i = first.length;
    for (; j < len; j++) {
      // 循环第二个类数组的每一项，然后放到第一个类数组的末尾
      first[i++] = second[j];
    }
    first.length = i;
    return first;
  };

  // 导出API
  if (typeof noGlobal === "undefined") {
    window.jQuery = window.$ = jQuery;
  }
  return jQuery;
})();

/* 
DOM对象；指的是原生JS获取的DOM元素对象，拥有内置的属性和方法

JQ做为一个方法库，方法写在了：
  + JQuery.prototype 供其实例调用的 $().xxx()
  + jQuery 静态私有属性方法 「工具类方法」 $.xxx()

JQ选择器：就是为了创建JQ类的一个实例，这样就可以调用jQuery.prototype上提供的属性方法了
  + 当我们把JQuery当做普通方法执行，返回 JQuery.fn.init 构造函数的实例
  + 但是因为 init.prototype = jQuery.fn，所以导致：返回的实例其实是JQuery类的实例
  => 把JQuery类的实例称之为“JQ对象” 或 “JQ实例对象”
  => 把一个函数当做“普通函数”执行，不用new，最后也创造其一个实例
  => 这种模式可以称之为“工厂设计模式”

  要求传递两个实参：selector，context
  + selector是选择器
    + 代表假，例如：""/0/NaN/null/undefined/false,直接返回 JQ对象(对象中没有任何的私有属性)
    + 如果是函数：
      $(function(){}) => $(document).ready(function(){}) 
      监听DOM元素是否加载完成「监听DOMContentLoaded」，如果加载完成则触发这个函数执行
    + DOM对象：把DOM对象转换为JQ对象，可以使用JQ中的方法
      返回一个JQ对象
      具备私有属性 0和length，索引0存储的是DOM对象，结果是一个类数组
    + 字符串：
      HTML字符串：创建DOM元素对象，最后返回JQ对象「索引0就是创建的这个DOM对象」
      选择器字符串：按照JQ选择器的查找和分析规则，去获取匹配的DOM元素对象,最后返回JQ对象「类数组」
    + 其余情况: 一般指数组或者DOM元素集合(类数组)
      + 如果传递的是DOM元素集合，则把其变为JQ实例对象(集合)，集合中每一项包含DOM对象
      + 如果其他值，则把传递的值放在JQ对象集合的第一项
      + ...
  + context是查找元素所在的上下文：不传递默认是document，在整个文档中进行查找
*/
$('.box');
jQuery('#link');