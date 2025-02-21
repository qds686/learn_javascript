/* 
jQuery中的extend方法
  $.extend({ // 把AA扩展到$的静态私有属性上
    AA(){}
  })
  $.fn.extend({ // 把BB扩展到$的原型对象上
    BB(){}
  })
  $.extend(obj1,obj2,obj3,...) 实现多个对象的"浅"合并，obj2替换obj1，obj3替换obj1，...最后返回obj1
  $.extend(true,obj1,obj2,obj3,...) 实现多个对象的"深"合并
  ...
*/
let obj1 = {
  name: '张三',
  age: 25,
  hobby: {
    music: 100,
    jump: 80
  }
};

// 这个操作浅合并没有事，深合并死递归，需要Set
obj1.obj1 = obj1;

let obj2 = {
  name: '李四',
  age: 22,
  sex: 0,
  hobby: {
    read: 100,
    music: 90
  }
};
let obj3 = {
  name: '王五',
  age: 20,
  height: '158cm',
  score: {
    math: 100,
    chinese: 90
  }
};

/* 对象浅合并 */

/* 方式一
Object.assign(obj1,obj2) 浅合并多个对象
  + 用obj2中的每一项替换obj1中的某一项「1和2都有的，以2为主；1有2没有的，保留1的；1没有2有的，给1也加上」
  + obj1中的内容会被修改，obj2不会改
  + 最后返回的是obj1
  + 浅合并：只会对第一级内容进行合并替换
Object.assign(obj1, obj2, obj3)
  + 先拿obj2替换obj1
  + 再拿obj3替换obj1
let obj = Object.assign({}, obj1, obj2, obj3)
  + 这样obj1不会被更改
  + 返回的是新对象
*/

// let obj = Object.assign(obj1, obj2);
// // {name: '李四', age: 22, hobby: {read: 100, music: 90}, sex: 0} 
// // true 
// // {name: '李四', age: 22, sex: 0, hobby: {read: 100, music: 90}}
// console.log(obj, obj === obj1, obj2);

/* 方式二 */
// let obj = {
//   ...obj1,
//   ...obj2
// };

/* 数组浅合并 */

/* 方式一 */
/*
Object.assign(arr1, arr2)
  + 把arr2合并到arr1中，arr1会被修改，arr2不会改,最后返回的是arr1
  + 浅合并：只会对第一级内容进行合并替换
*/
// let arr1 = [1, 2, 3];
// let arr2 = [3, 4, 1];
// let arr = Object.assign(arr1, arr2);
// console.log(arr,arr1,arr2); // [3, 4, 1] [3, 4, 1] [3, 4, 1]

// 方式二:属于拼接两个数组，不是合并数组
// let arr1 = [1, 2, 3];
// let arr2 = [3, 4, 1];
// let arr = [...arr1, ...arr2];
// console.log(arr);

console.log(_.merge({}, obj1, obj2, obj3));
console.log(_.merge(true, {}, obj1, obj2, obj3));


