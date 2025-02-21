function Fn() {
  this.name = 'hezi';
}

let o1 = {
  a: 100,
  b: [10, 20, 30],
  c: {
    x: 10
  },
  d: /^\d+$/,
  e: function () { },
  f: Symbol(),
  g: BigInt(10),
  h: new Date(),
  i: new Fn()
};

let obj = {
  name: '盒子',
  age: 18,
  bool: true,
  n: null,
  u: undefined,
  num: new Number(1),
  sym: Symbol('sym'),
  // big: 10n,
  list: [10, 20, 30],
  reg: /\d+/,
  time: new Date,
  err: new Error('xxx'),
  hobby: {
    movie: '快乐星球',
    music: '日不落'
  },
  [Symbol('KEY')]: 100,
  fn: function () { }
};
obj.obj = obj;

/* 数组和对象的浅拷贝*/

// 方式一：
// let obj1 = {...obj};

// 方式二：
// let obj1 = Object.assign({}, obj);

// 数组浅拷贝：
// let arr = [...arr];
// let arr = arr.slice(0);

/* 数组和对象的深拷贝 */

/* 
  方案一: JSON.parse/stringify
    + 不能处理BigInt类型的属性值 Uncaught TypeError: Do know how to serialize a BigInt
    + 如果对象出现“套娃操作”，则会报错 Uncaught TypeError: Converting circular structure to JSON
    + 如果属性名是 undefined/symbol/function 类型的，会丢失掉「执行stringify的时候就丢了」
    + 如果属性名是 Symbol类型的，也会丢失
    + 如果属性值是 正则对象/错误对象.... 类型的，直接变为 {}
    + 如果属性值是 非标准特殊对象(new Number(1))，会变为其原始值类型的值
    + 如果属性值是如期对象，变为日期字符串后，就无法再变回来了

  JSON.parse(JSON.stringify(obj))
    + 第一步把obj对象变为JSON字符串
    + 第二步再把JSON字符串变为一个新对象「所有级别的内存都会重新开辟，实现深拷贝的效果」
  只适用于，属性名/属性值是：数字、字符串、布尔、null、数组、纯粹对象 这些情况
*/
// let obj1 = JSON.parse(JSON.stringify(obj));
// console.log(obj1);


// 方案二：封装
let obj1 = _.clone(obj);
let obj2 = _.clone(true, obj);
console.log(obj1, obj1.hobby === obj.hobby); // true
console.log(obj2, obj2.hobby === obj.hobby); // false

// 方案三：简化
function deepClone (origin,target){
  // origin原数组或对象 target克隆后的数组或对象
  var target = target || {},
      toStr = Object.prototype.toString,
      arrType = '[object Array]';
  for(var key in origin){
    // key是私有属性
    if(origin.hasOwnProperty(key)){
      // 要被克隆的项是一个对象
      if(typeof(origin[key] === 'object' && origin[key] !== null){
        // 创建克隆后承载的对象或数组
         if(toStr.call(origin[key] === arrType){
              target[key] = [];
         }else{
              target[key] = {};
         }  
          deepClone(origin[key],target[key]);
       }else{
         target[key] = origin[key];
       }
    }
  }
  return target;
}

deepClone()









