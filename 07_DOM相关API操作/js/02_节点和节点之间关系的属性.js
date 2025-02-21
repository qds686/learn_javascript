/* 
DOM中为我们提供了很多节点和节点之间关系的属性
1.元素对象.parentNode 获取其父亲节点
2.元素对象.childNodes 获取其所有的子节点（包含：文本节点，注释节点，元素节点....）
3.元素对象.children 获取所有的元素子节点 (兼容问题；IE6-8中会把注释也当做元素节点)
4.元素对象.previousSibling 获取其上一个哥哥节点，不论什么节点
5.元素对象.nextSibling 获取其下一个弟弟节点，不论什么节点
6.元素对象.previousElementSibling 获取其上一个哥哥元素节点
7.元素对象.nextElementSibling 获取其下一个弟弟元素节点
8.元素对象.firstChild 获取其第一个子节点
9.元素对象.firstElementChild 获取其第一个元素子节点
10.元素对象.lastChild 获取其最后一个子节点
11.元素对象.lastElementChild 获取其最后一个元素子节点
PS：所有ElementXxxx的在IE6-8下都不兼容（当代项目开发基本上已经忽略IE6-8的兼容了）










*/