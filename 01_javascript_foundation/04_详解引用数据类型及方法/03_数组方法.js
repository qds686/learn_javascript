// 5个改变原数组的方法
/**
 * 1.push
 * 作用：向数组末尾增加内容
 * 参数：添加的具体项，可以是一项，也可以是多项
 * 返回值：返回新增后数组的长度
 */
// let ary = [10, 20];
// let res = ary.push(30, "AA", {name: '小王'});
// console.log(res); // 5

// 1.1 基于原生JS操作键值对的方法，也可以向末尾追加一项新的内容
// ary[ary.length] = 40;
// console.log(ary); // [10, 20, 30, 'AA', {…}, 40]

// 1.2 通过操作键值对的方式重写Push方法
// Array.prototype.myPush = function(){
//   for(var i = 0; i < arguments.length; i++){
//     this[this.length] = arguments[i];
//   }
//   return this.length;
// }


/**
 * 2.pop
 * 作用：删除数组最后一项
 * 参数：无
 * 返回值：删除的项
 */
// let ary = [10, 20, 30, 40];
// let res = ary.pop();
// console.log(res); // 40

// 2.1 基于原生方法删除数组最后一项
// ary.length--;
// console.log(ary); // [10, 20]


/**
 * 3.unshift
 * 作用：向数组的第一项增加内容
 * 参数：添加的内容
 * 返回值：新数组的长度
 */
// let ary = [10, 20];
// let res = ary.unshift(30, "AA");
// console.log(res); // 4

// 3.1 重写unshift
// 方法一：
// var arr = ['d', 'e', 'f'];
// Array.prototype.myUnshift = function(){
//   var pos = 0;
//   for(var i = 0; i < arguments.length; i++){
//     this.splice(pos, 0, arguments[i]);
//     pos++;
//   }
//   return this.length;
// }
// var res = arr.myUnshift('a','b','c');
// console.log(res); // 6
// console.log(arr); // ['a', 'b', 'c', 'd', 'e', 'f']

// 方法二: 功能实现了，但是没有改变原数组
// var arr = ['d', 'e', 'f'];
// Array.prototype.myUnshift = function () {
//   var arr = [];
//   var argArr = Array.prototype.slice.call(arguments),
//     newArr = argArr.concat(this);

//   return newArr.length;
// }
// var res = arr.myUnshift('a', 'b', 'c');
// console.log(res); // 6
// console.log(arr); // ['d', 'e', 'f']

/**
 * 4.shift
 * 作用：删除数组的第一项
 * 参数：无
 * 返回值：删除的项
 */
// let ary = [10,20,30,40];
// let res = ary.shift();
// console.log(res,ary);//10 [20,30,40]

//基于原生js中的delete，把数组当做普通对象，确实可以删除掉某一项内容，但是不会影响数组本身的结构特点（length长度不会跟着修改），真实项目中杜绝这样的删除使用
// delete ary[0];
// console.log(ary);//[空白, 30, 40,length:3]

/**
 * 5.splice
 * 作用：删除、新增、修改数组
 * 参数：splice(n, m, ...x); 不能传递负数
 * 返回值：删除的元素
 */

/**
 * 5.1 删除：删除需要给splice传递两个参数
 *   + 第一个参数：要删除的第一个元素的位置
 *   + 第二个参数：要删除的元素数量(不写，是删除到末尾)
 * 返回：删除的部分用新数组存储起来
 */
// let ary = [10,20,30,40,50,60,70,80,90];
// let res = ary.splice(2,4);
// console.log(res,ary);//[30,40,50,60]  [10,20,70,80,90];

//基于这种方法可以清空一个数组，把原始数组中的数组以新数组存储起来（有点类似数组的克隆：把原来数组克隆一分一模一样的给新数组）
// res = ary.splice(0);
// console.log(res,ary);//[10,20,70,80,90] []

//删除最后一项
// ary.splice(ary.length-1);
//删除第一项
// ary.splice(0,1);

/**
 * 5.2 新增和删除需要传递3个参数
 *   + n,0,x 从索引n开始，一个都不删，把x放到索引n的前面
 *     + 增加的时候，把增加的放在n的前面
 *   + n,m,x 从索引n开始删除m个元素 ,用x占用删除的部分
 * 返回：把删除的部分用新数组存储起来返回
 */
// let ary = [10,20,30,40,50];
// let res = ary.splice(1,2,'AA');
// console.log(res,ary);//[20,30]  [10,'AA',40,50]

//实现增加
// ary.splice(3,0,'哈哈哈');// [10, 'AA', 40, '哈哈哈', 50]
// console.log(ary);

//向数组末尾追加
// ary.splice(ary.length,0,'BB');
// console.log(ary);//[10, 'AA', 40, '哈哈哈', 50, 'BB']

//向数组开始追加
// ary.splice(0,0,'CC');
// console.log(ary);//['CC', 10, 'AA', 40, '哈哈哈', 50, 'BB']

// 不改变原数组的方法
/**
 * 1.slice
 * 作用：实现数组的查询
 * 参数：n,m 从索引 n 开始，找到索引为 m(可以为负) 的地方（不包含m这一项）
 * 返回：把找的的内容以一个新数组的形式返回
 */

// // 1.1 基本用法
// let ary = [10,20,30,40,50];
// let res = ary.slice(1,3);
// console.log(res,ary);//[20,30]  [10,20,30,40,50];

// // 1.2 m不写找到末尾
// res = ary.slice(1);
// console.log(res);// [20,30,40,50]

// // 1.3 数组的克隆，参数0不写也可以
// res = ary.slice(0);
// console.log(res);//[10,20,30,40,50]

// // 1.4 如果slice()的参数有负值，那么就以数组长度加上这个负数来确定位置，案例如下
// // 长度为5，slice（-5，-1）就相当于slice(0，4)
// res = ary.slice(-5, -1);
// console.log(res); //[10, 20, 30, 40] 

// // 1.5 如果结束位置小于开始位置，则返回空数组
// res = ary.slice(5, 2);
// console.log(res); // []

/**
 * 2.concat
 * 作用：实现多个数组或者值的拼接
 * 参数：数组或者值
 * 返回值：返回拼接后的新数组
 */
// let ary1 = [10, 20, 30];
// let ary2 = [40, 50, 60];
// let res1 = ary1.concat(ary2);
// console.log(res1); // [10, 20, 30, 40, 50, 60]

// let res2 = ary1.concat('AA');
// console.log(res2); // [10, 20, 30, 'AA']

/**
 * 3.toString
 * 作用：可以把一个数组转换为字符串
 * 参数：无
 * 返回值：返回值是转换后的字符串
 */
// let ary = [10, 20, 30];
// let res = ary.toString();
// console.log(res); // '10,20,30'

// console.log([].toString()); // ''
// console.log([10].toString()); // '10'


/**
 * 4.join
 * 作用：把数组通过制定的连接符，转换为字符串
 * 参数：连接符
 * 返回值：返回值是转换后的字符串
 */
// let ary = [10, 20, 30];
// let res = ary.join('');
// console.log(res); // '102030'

// let res1 = ary.join('|');
// console.log(res1); // '10|20|30'

// // 默认为逗号
// let res2 = ary.join();
// console.log(res2); // 10,20,30

// let res3 = ary.join('+');
// console.log(res3); // '10+20+30'

// // eval把字符串变为js表达式执行
// console.log(eval(res3)); // 60

/**
 * 5.indexOf / lastIndexOf
 * 作用：检测当前项在数组中第一次或者最后一次出现位置的索引(IE6-8不兼容)
 * 参数：要检索的这项内容 (n, m)
 *   + n: 检索的项
 *   + m: 
 *     + 如果是indexOf，就是从索引m开始检索
 *     + 如果是lastIndexOf，就是从索引m停止检索
 * 返回值：这一项出现的位置索引值(数字)，如果数组中没有这一项，返回的结果是-1
 */

// var ary = [1, 2, 3, 4, 1, 55, 1];

// // 检测1这个项在数组 ary 中首次出现的位置
// let res1 = ary.indexOf(1);
// console.log(res1); // 0

// // 从索引2开始，检测1这个项在数组中首次出现的位置
// let res2 = ary.indexOf(1, 2);
// console.log(res2); // 4

// // 检测1这个项在数组中最后一次出现的索引
// let res3 = ary.lastIndexOf(1);
// console.log(res3); // 4

// // 检测1这个项在数组中最后出现的索引，在索引5的位置停止检测
// let res4 = ary.lastIndexOf(1, 5);
// console.log(res4); // 4

// // 如果此项在数组中没有出现，返回值就是-1
// console.log(ary.indexOf(66)); // -1

// // 5.1 数组中存放的是原始类型数组中，查找元素的几种方法
// var names = ["abc", "cba", "nba", "mba"];
// // @1 indexOf 
// //   + 可以找到，返回对应的索引
// //   + 找不到返回 -1
// console.log(names.indexOf("abc")); // 0
// console.log(names.indexOf('AA')); // -1

// // @2 includes 找到返回true，找不到返回false
// console.log(names.includes("nba")); // true
// console.log(names.includes("AA")); // false

// // 5.2 数组中存放的是对象类型
// // 查找的是id为101的学生信息
// var students = [
//   { id: 100, name: "why", age: 18 },
//   { id: 101, name: "kobe", age: 30 },
//   { id: 102, name: "james", age: 25 },
//   { id: 103, name: "why", age: 22 }
// ];

// // @1 自己写一个for循环
// var stu = null
// for (var i = 0; i < students.length; i++) {
//   if (students[i].id === 101) {
//     stu = students[i]
//     break
//   }
// }
// // 判断上面的算法有没有找到对应的学生
// if (stu) {
//   console.log("找到了对应的101学生", stu) // 找到了对应的101学生 {id: 101, name: 'kobe', age: 30}
// } else {
//   console.log("没有找到对应的101学生")
// }

// // @2 find方法: 高阶函数

// var stu = students.find(function (item) {
//   if (item.id === 101) return true
// })
// console.log(stu)//{id: 101, name: 'kobe', age: 30}

// // @3 findIndex: 查找元素的索引
// var names = ["abc", "cba", "nba", "mba"];
// var findIndex = names.findIndex(function (item, index, arr) {
//   return item === "nba"
// })
// // var findIndex = names.findIndex(item => item === "nba")
// console.log(findIndex)//2 

/**
 * 6.reverse
 * 作用：把数组倒过来排列
 * 参数：无
 * 返回：排列后的新数组
 */
// let ary = [1, 2, 3, 4, 5];
// let res = ary.reverse();
// console.log(res); // [5, 4, 3, 2, 1]

/**
 * 7.sort
 * 作用：给数组排序
 * 参数: 没有 | 函数
 * 返回值：排序后的新数组
 */

// 1.基本用法
let ary = [7, 8, 5, 2, 4, 6];
ary.sort();
console.log(ary); // [2, 4, 5, 6, 7, 8]

// 2.多位数排序
// sort方法如果不传递参数，是无法处理10以上数字排序的（默认按照第一个字符来排序，不是我们想要的效果）

// 想要实现多位数正常排序，需要个sort传递一个函数，函数中返回a-b实现升序，返回 b-a 实现降序（冒泡排序）
let ary = [12, 15, 6, 7, 43];
ary.sort(function (a, b) {
  return a - b;
});
console.log(ary); // [6, 7, 12, 15, 43]

// 3.sort原理
//   + 负值，a就排前面; 
//   + 正值，b就排前面; 
//   + 0保持不变
// 自定义排序
let ary = [12, 15, 6, 7, 43];

ary.sort(function (a, b) {
  if (a > b) {
    return 1;
  } else {
    return -1;
  }
});
console.log(ary); //  [6, 7, 12, 15, 43]

// 改写
ary.sort((a, b) => {
  // a 和 b是相邻的两项
  return a - b;
});
console.log(ary);

// 实现随即排序
arr.sort(function (a, b) {
  /*
     var rand = Math.random();
     if(rand - 0.5 > 0){
       return 1;
     }else{
       return -1;
     }
  */
  return Math.random() - 0.5;
});

// 实现在引用数据类型中排序
var arr = [
  {
    son: 'Jenny',
    age: 14
  },
  {
    son: 'jone',
    age: 4
  },
  // ...
];
arr.sort(function (a, b) {
  return a.age - b.age;
});




