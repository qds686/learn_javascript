/* 把对象处理为扁平化的结构  */
const obj = {
  a: {
    b: 1,
    c: 2,
    d: { e: 3, 2: 200 }
  },
  b: [1, 2, { a: 3, b: 4 }],
  c: 1,
  1: 100,
  x: {}
};

/* 
处理为一维数组 
{
  1: 100
  a.b: 1
  a.c: 2
  a.d.e: 3
  a.d[2]: 200
  b[0]: 1
  b[1]: 2
  b[2].a: 3
  b[2].b: 4
  c: 1
  x: {}
}
*/

Object.defineProperty(Object, "flatten", {
  enumerable: false,
  writable: true,
  configurable: true,
  value: function flatten(obj) {
    // 存储最终的结果
    let result = {};
    // obj:迭代的对象 [object|array|number]
    // attr:传递上次处理后的属性名
    const next = (obj, attr) => {
      let isObject = _.isPlainObject(obj),
        isArray = Array.isArray(obj);
      if (isArray || isObject) {
        // 考虑为空的情况
        if (isObject && _.isEmptyObject(obj)) {
          result[attr] = {};
          return;
        }
        if (isArray && obj.length === 0) {
          result[attr] = [];
          return;
        }
        // 不为空的情况则迭代处理
        _.each(obj, (value, key) => {
          let temp = isNaN(key) ? `.${key}` : `[${key}]`;
          // 不管是不是对象，调用next方法
          next(value, attr ? attr + temp : key);
        });
        return;
      }
      // 如果不是数组或者对象就往对象中添加属性
      result[attr] = obj;
    };
    // 第一次执行，没有上一级传个空
    next(obj, "");
    return result;
  }
});
console.log(Object.flatten(obj));



























