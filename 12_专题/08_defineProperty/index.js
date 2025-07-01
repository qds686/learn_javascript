// Object.defineProperty 定义属性
// 参数：需要定义的对象，需要定义的属性，描述符
// 1.增加单个属性 defineproperty 需要三个参数
// function defineproperty() {
//   var _obj = {};

//   Object.defineProperty(_obj, 'a', {
//     value: 1
//   });

//   return _obj;
// }

// var obj = defineproperty();
// console.log(obj); // {a: 1}

// 2.增加多个属性 defineProperties 需要两个参数
// function defineproperty() {
//   var _obj = {};

//   Object.defineProperties(_obj, {
//     a: {
//       value: 1
//     },
//     b: {
//       value: 2
//     }
//   });

//   return _obj;
// }

// var obj = defineproperty();
// console.log(obj); // {a: 1, b: 2}

// 3.对defineProperty定义的属性进行枚举、修改、删除没有作用
// function defineproperty() {
//   var _obj = {};

//   Object.defineProperties(_obj, {
//     a: {
//       value: 1,
//       // 可写、可修改
//       writable: true,
//       // 可枚举
//       enumerable: true,
//       // 可配置的、可操作的「删除」
//       configurable: true
//     },
//     b: {
//       value: 2
//     }
//   });

//   return _obj;
// }

// var obj = defineproperty();
// console.log(obj); 

// 4.每一个属性在定义的时候 都会产生一个 getter 和 setter的内置方法
function defineproperty() {
  var _obj = {};
  var a = 1;
  Object.defineProperties(_obj, {
    a: {
      get() {
        return `"a"'s value is ${a}`;
      },

      set(newVal) {
        console.log(`The value "a" has been designed a new value ${newVal}.`);
      }
    },
    b: {

    }
  });

  return _obj;
}

var obj = defineproperty();

// 获取值的时候，本来应该是1，但是输出的是get方法return的值 "a"'s value is 1
console.log(obj.a); 
// 设置属性值的时候，本来应该什么都不输出，但是 输出 The value "a" has been designed a new value 2.
obj.a = 2;

// 5.数据劫持：把一个对象的属性进行可配置、可写、可枚举，通过 get 和 set 方法对存取值进行逻辑上的扩展，当获取和设置值的时候要先执行这两个函数中的逻辑

// 当只有configurable和enumerable时，表示数据的描述符
// 当有writable或者value时，在下面都不可以出现get和set，如果出现就会报错为类型错误不合法的属性
Object.defineProperties(_obj, {
  // value: 1,
  writable: true,
  get(){
    return a;
  },
  set(newVal){
    
  }
});