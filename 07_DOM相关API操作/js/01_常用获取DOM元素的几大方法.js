/* 
Node节点：在页面中出现的任何内容都被称为节点
  + 元素节点：元素标签
    + nodeType:1
    + nodeName:大写标签名
    + nodeValue:null
  + 文本节点：文本内容 + 换行和空格
    + nodeType:3
    + nodeName:#text
    + nodeValue:文本内容
  + 注释节点：注释内容
    + nodeType:8
    + nodeName:#comment
    + nodeValue:注释内容
  + 文档节点：document
    + nodeType:9
    + nodeName:#document
    + nodeValue:null
DOM (文档对象模型 document object modal)：提供一系列的属性和方法，可以供我们操作页面中的元素
  + 修改或获取元素的样式和内容等
  + 动态增加或者删除元素
  + 获取元素或者其他节点
*/

/* 获取元素的6个方法，3个属性
1.document.documentElement：获取HTML元素 
2.document.head：获取head元素
3.document.body：获取body元素
4.document.getElementById([ID]): 指定在文档中，基于元素的ID获取这个元素对象
  + 获取到的结果是一个元素“对象”：它是对象数据类型值，包含很多内置的属性名和属性值...
  + document在这里是限定获取的范围，称为context获取上下文
    + [context]指定的上下文不能是集合，是具体的元素对象
    + 获取的范围是当前上下文所有“后代中”，叫做这个名字的标签
5.context.getElementsByTagName(TAG-NAME): 在指定上下文（容器）中，通过标签名获取一组元素集合
  + document.getElementsByTagName('*')：获取当前页面所有的元素标签
6.context.getElementsByclassName(CLASS-NAME): 在指定上下文中，通过样式类名获取一组元素集合（不兼容IE6~8)
  + 获取到的结果是一个“类数组”集合，集合中的每一项，就是获取的符合条件的，每一个元素对象
7.document.getElementsByName(NAME): 在整个文档中，通过标签的NAME属性值获取一组节点集合
  + 结果是一个节点集合NodeList
  + 项目中我们往往只针对表单元素这样操作，在IE浏览器中只有表单元素设置NAME有作用
8.context.queryselector(SELECTOR):在指定上下文中，通过选择器获取到指定的第一个元素对象（即使有多个符合也选择第一个）
9.context.queryselectorA11(SELECTOR): 在指定上下文中，通过选择器获取到指定的元素集合(在IE6~8中不兼容,不实时)
*/

















