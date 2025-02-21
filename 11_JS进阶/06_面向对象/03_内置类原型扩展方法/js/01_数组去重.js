// 数组去重
// 方案一：循环原有数组中的每一项，每拿到一项都往新数组中添加，添加之前验证新数组中是否存在这一项，不存在再增加
// let ary = [1, 2, 3, 4, 5, 3, 2, 1],
//   newAry = [];

// for (let i = 0; i < ary.length; i++) {
//   let item = ary[i];
//   if (!newAry.includes(item)) {
//     newAry.push(item);
//   }
// }
// console.log(newAry); // [1, 2, 3, 4, 5]


// 方案二；先分别拿出数组中的每一项A，用这一项 A 和 “它后面的每一项” 依次进行比较，如果遇到和当前项A相同的就删除 
// let ary = [1, 2, 3, 4, 5, 3, 2, 1];

// for (let i = 0; i < ary.length; i++) {
//   // item：每一次循环拿出来的当前项
//   // i:当前项的索引 i+1：表示后一项
//   let item = ary[i];
//   // 让当前项和后面的每一项进行比较
//   for (let j = i + 1; j < ary.length; j++) {
//     // 后面的每一项
//     let compare = ary[j];
//     // 如果compare和item相等,说明这一项是重复的,我们把它删除掉
//     if (compare === item) {
//       // 索引J这一项删除
//       ary.splice(j, 1);
//       j--;
//     }
//   }
// }
// console.log(ary); // [1, 2, 3, 4, 5]


// 方案三：利用对象属性名不能重复的特点，把数组中的每一项作为对象的属性名存储，最后获取对象的属性名即可
// let ary = [1, 2, 3, 4, 5, 3, 2, 1],
//   obj = {};
// for (let i = 0; i < ary.length; i++) {
//   let item = ary[i];
//   if (obj[item] == item) {
//     ary.splice(i, 1);
//     i--;
//   }
//   obj[item] = item;
// }

// console.log(obj, ary); // {1: 1, 2: 2, 3: 3, 4: 4, 5: 5}  [1, 2, 3, 4, 5]

// 优化方案三：基于splice实现删除性能不好：当前项被删除后，后面每一项的索引都要向前提一位，如果后面内容过多，一定影响性能

// let ary = [1, 2, 3, 4, 5, 3, 2, 1];
// /**
//  * unique：实现数组去重的方法
//  * @param {Array} ary 要去重的数组
//  * @returns {Array} 去重后的数组
//  */
// function unique(ary) {
//   let obj = {};

//   for (let i = 0; i < ary.length; i++) {
//     let item = ary[i];
//     if (obj[item] == item) {
//       // 把当前项赋值为数组的最后一项，然后删除数组的最后一项，再进行比较
//       item = ary[ary.length - 1];
//       ary.length--;
//       i--;
//       continue;
//     }
//     obj[item] = item;
//   }
//   return ary;
// }
// console.log(unique(ary)); // [1, 2, 3, 4, 5]

// 方案四：基于内置类扩展方法
/* 
  基于内置类原型扩展方法 实例.方法()
    + 方便
    + 实现链式写法「执行完一个方法，返回的结果还是当前类的实例，这样就可以继续调用，类为其提供的其他方法执行」
*/
~function () {
  /**
   * myUnique：实现数组去重
   * @params
   * @return
   *   [array] 去重后的数组 
   */
  function myUnique() {
    // 此时没有传递要操作的ary进来，但是方法中的this是当前要操作的数组：ary.myUnique()
    let obj = {};
    for (let i = 0; i < this.length; i++) {
      let item = this[i];
      if (obj[item] == item) {
        item = ary[ary.length - 1];
        ary.length--;
        i--;
      }
      obj[item] = item;
    }
    obj = null;
    return this;
  }
  // 扩展到内置类的原型上
  Array.prototype.myUnique = myUnique;
}();

let ary = [1, 2, 3, 4, 5, 3, 2, 1];
console.log(ary.myUnique()); // 1, 2, 3, 4, 5]

// 链式调用：保证返回值依然是当前类的实例（push返回数组长度，所以以后不能调用，不是一个方法会报错），一般都会return this
ary.myUnique().sort((a, b) => a - b).reverse();
console.log(ary); // [5, 4, 3, 2, 1]
