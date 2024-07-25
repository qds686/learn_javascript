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
let ary = [10,20,30,40,50];
let res = ary.splice(1,2,'AA');
console.log(res,ary);//[20,30]  [10,'AA',40,50]

//实现增加
ary.splice(3,0,'哈哈哈');// [10, 'AA', 40, '哈哈哈', 50]
console.log(ary);

//向数组末尾追加
ary.splice(ary.length,0,'BB');
console.log(ary);//[10, 'AA', 40, '哈哈哈', 50, 'BB']

//向数组开始追加
ary.splice(0,0,'CC');
console.log(ary);//['CC', 10, 'AA', 40, '哈哈哈', 50, 'BB']

// 不改变原数组的方法
/**
 * 1.slice
 * 作用：实现数组的查询
 * 参数：n,m 从索引 n 开始，找到索引为 m(可以为负) 的地方（不包含m这一项）
 * 返回：把找的的内容以一个新数组的形式返回
 */
/*



是否改变原数组：不改变
*/
let ary = [10,20,30,40,50];
let res = ary.slice(1,3);
console.log(res,ary);//[20,30]  [10,20,30,40,50];

// m不写找到末尾
res = ary.slice(1);
console.log(res);// [20,30,40,50]

// 数组的克隆，参数0不写也可以
res = ary.slice(0);
console.log(res);//[10,20,30,40,50]

// 如果slice()的参数有负值，那么就以数组长度加上这个负数来确定位置，案例如下
长度为6，slice（-5，-1）就相当于slice(1，5)

// 如果结束位置小于开始位置，则返回空数组







