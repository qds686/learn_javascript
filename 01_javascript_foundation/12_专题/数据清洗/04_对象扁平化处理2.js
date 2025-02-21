let obj = {
  a: {
    b: {
      c: {
        d: 1
      }
    }
  }
};

/* 方案一：对象扁平化递归处理，存在的问题：当对象中的某一项不存在或者值为null，就不能继续往下访问了，会报错 */
/* const getValue = (obj, keyPath) => {
  let result = {};
  const next = (obj, attr) => {
    let isObject = _.isPlainObject(obj),
      isArray = Array.isArray(obj);
    if (isObject || isArray) {
      if (isObject && _.isEmptyObject(obj)) {
        result[attr] = {};
        return;
      }
      if (isArray && obj.length === 0) {
        result[attr] = [];
        return;
      }
      _.each(obj, (value, key) => {
        let temp = isNaN(key) ? `.${key}` : `[${key}]`;
        next(value, attr ? attr + temp : key);
      });
    }
    result[attr] = obj;
  };
  next(obj, "");

  for(let path in result){
    if(path === keyPath) return result[path];
  }
};
console.log(getValue(obj, 'a.b.c.d')); // 1
console.log(getValue(obj, 'a.b')); // {c:{d:1}} */

/* 方案二：可选链，对象中的属性不存在，返回undefined，不会报错 */
// 没有办法中途结束
/* const getValue = (obj, keyPath) => {
  let keys = keyPath.split('.');
  return keys.reduce((x, key)=> {
    return x ? x[key] : undefined;
  }, obj);
}; */

const getValue = (obj, keyPath) => {
  let keys = keyPath.split('.'),
    index = 0,
    result;
  const next = x => {
    if (index >= keys.length) return;
    let key = keys[index++];
    result = x[key];
    if (result == null || typeof result !== "object") return;
    next(result);
  };
  next(obj);
  return result;
};

console.log(getValue(obj, 'a.b.c.d')); // 1
console.log(getValue(obj, 'a.b')); // {c:{d:1}}
console.log(getValue(obj, 'a.b.x')); // undefined
