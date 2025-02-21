(function () {

  // 检测数据类型
  const class2type = {},
    toString = class2type.toString, // Object.prototype.toString 检测数据类型的
    hasOwn = class2type.hasOwnProperty; // Object.prototype.hasOwnProperty 检测是否为私有属性

  // 一些浏览器中，createElement("object") === "function"
  // typeof document.getElementsByTagName("div") === "function"
  const isFunction = function isFunction(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
  }

  // obj不是null和undefined
  // window.window===window
  const isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
  }

  /* 优化toType:返回所属类型的字符串 */
  const toType = function toType(obj) {
    let reg = /^\[object ([\w\W]+)\]$/;
    if (obj == null) {
      return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function"
      ? reg.exec(toString.call(obj))[1].toLowerCase()
      : typeof obj;
  }

  /* 检测是否是数组或类数组 */
  const isArrayLike = function isArrayLike(obj) {
    let length = !!obj && "length" in obj && obj.length, // false || length值
      type = toType(obj);
    // 函数的length属性表示形参个数
    // window的length是页面中嵌套的iframe的个数
    if (isFunction(obj) || isWindow(obj)) {
      return false;
    }

    // 检测是数组||空类数组||length是大于0的数字，代表不是空类数组&&最后一项在obj中
    return type === "array" || length === 0 ||
      typeof length === "number" && length > 0 && (length - 1) in obj;
  }

  /* 检测是不是纯粹对象或者是标准普通对象；obj.__proto__===Object.prototype */
  const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    // 对象不存在null/undefined 或者 检测不是对象，返回false
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }
    // 获取当前对象的原型对象
    proto = Object.getPrototypeOf(obj);

    // 匹配 Object.create(null)
    if (!proto) {
      return true;
    }

    // 在原型对象的私有属性上是否有constructor属性
    // 如果有，则获取constructor，没有就是false
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    // 构造函数constructor是一个函数，并且是Object，即找的就是Object的原型
    return typeof Ctor === "function" && Ctor === Object;
  }

  /* 检测是否为空对象 */
  const isEmptyObject = function isEmptyObject(obj) {
    let keys = Object.getOwnPropertyNames(obj);
    if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
    return keys.length === 0;
  }

  /* 检测是否是有效数字：支持数字字符串 */
  const isNumeric = function isNumeric(obj) {
    let type = toType(obj);
    return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
  }

  /**
   * 函数的防抖：防止“老年帕金森”，用户频繁「频繁的定义可以自己管控」触发某个行为的时候，我们只识别一次
   * @param {function} func 需要防抖的函数
   * @param {number} wait 防抖需要等待的时间
   * @param {boolean} immediate 控制是不是在开始边界触发事件
   */
  const clearTimer = function clearTimer(timer) {
    if (timer) {
      clearTimeout(timer);
    }
    return null;
  };

  const debounce = function debounce(func, wait, immediate) {
    // 1.init params参数处理

    // 如果func不是函数，就抛出错误
    if (typeof func !== 'function') throw new TypeError('func is not a function');

    // utils.debounce(func, true);
    if (typeof wait === 'boolean') {
      immediate = wait;
      wait = undefined;
    }
    /**
     * 默认转换为数字，结果是数字或者NaN
     *   + wait是NaN，则默认为300ms
     */
    wait = +wait;
    if (isNaN(wait)) wait = 300;

    if (typeof immediate !== 'boolean') immediate = false;

    // 2.handler逻辑处理
    let timer = null;

    // 执行的返回值是一个函数，使用的时候赋值给事件
    // 点击多少次，operate函数就执行多少次，但是我们的目的是让func(真正要处理的函数)执行一次即可
    return function operate(...params) {
      // now：记录是否是立即执行「条件：第一次点击&immediate=true」
      let now = !timer && immediate;
      /**
       * wait时间内是否有触发第二次
       *   + 有：则把之前设置的定时器清除掉，再从新设置一个即可
       *   + 没有：到时间后把想要执行的方法执行即可
       */
      // clearTimeout(timer); 
      // 封装timer，第一次进来时null，如果在规定时间内触发事件，则clearTimer先清除为null，再设置
      // 清除之前设置的定时器
      timer = clearTimer(timer);
      timer = setTimeout(() => {
        // 箭头函数中的this是上级上下文operate的this
        // 如果下一次执行now已经不是true了，只需要immediate是false即可，此时定时器到时间执行函数 “结束边界触发”
        if (!immediate) func.call(this, ...params);
        // 清除最后一个定时器
        timer = clearTimer(timer);
      }, wait);

      // 如果是立即执行，则第一次执行operate就把要干的事情做了即可 "开始边界触发"
      if (now) func.call(this, ...params);
    };
  };

  /**
   * 函数的节流：当用户频繁操作的时候，不根据用户的频繁操作度来决定触发多少次，而是根据设定好的频率进行触发，实现“降频”的效果，相对于防抖来讲，节流允许触发多次
   * @param {function} func 需要节流的函数
   * @param {number} wait 需要设置的频率ms
   */
  const throttle = function throttle(func, wait) {
    // init params
    if (typeof func !== 'function') throw new TypeError('func is not a function');
    wait = +wait;
    if (isNaN(wait)) wait = 300;

    // handler
    let timer = null,
      // 记录上一次func触发的时间
      previous = 0;

    /**
     * 假如每隔5ms触发一次operate，我们需要500ms执行一次func，设置一个定时器，等待495ms，执行func
     * 第10ms...如果已经存在一个定时器等待执行了，则啥都不处理即可
     * 到495ms后，把func执行了，如果此时滚动还在继续，我们还需要再设置定时器，再间隔XX时间，去执行func
     */
    return function operate(...params) {
      let now = +new Date(),
        // 当前时间和上一次执行的时间差有没有超过设置的频率wait
        remaining = wait - (now - previous);
      if (remaining <= 0) {
        // 两次触发的时间间隔超过设定的频率，则立即执行函数
        func.call(this, ...params);
        // 每次执行完函数记录最后一次执行的时间
        previous = +new Date();
        timer = clearTimer(timer);
      } else if (!timer) {
        // 间隔时间不足设定的频率，而且还未设置等待的定时器，则设置定时器等待执行函数即可
        timer = setTimeout(() => {
          func.call(this, ...params);
          previous = +new Date();
          // 清除定时器，并且timer赋值为null，下次才能继续设置定时器
          timer = clearTimer(timer);
        }, remaining);
      }

    };
  };

  /* 数组和对象的操作 */
  // first和second必须是数组或者类数组
  const mergeArray = function mergeArray(first, second) {
    // 如果传递的是字符串，则变为字符串的类数组集合
    if (typeof first === "string") first = Object(first);
    if (typeof second === "string") second = Object(second);

    // 如果传递的不是类数组，返回空数组
    if (!isArrayLike(first)) first = [];
    if (!isArrayLike(second)) second = [];

    let len = +second.length,
      j = 0,
      // 第一个类数组的长度+1
      i = first.length;
    for (; j < len; j++) {
      // 循环第二个类数组的每一项，然后放到第一个类数组的末尾
      first[i++] = second[j];
    }
    first.length = i;
    return first;
  };

  /* 迭代数组、类数组、纯粹对象，支持迭代的结束 */
  const each = function each(obj, callback) {
    let isArray = isArrayLike(obj),
      isObject = isPlainObject(obj);
    if (!isArray && !isObject) throw new TypeError('obj must be an array or likeArray or plainObject');
    if (!isFunction(callback)) throw new TypeError('callback is not a function');

    if (isArray) {
      // 数组和类数组的迭代
      for (let i = 0; i < obj.length; i++) {
        let item = obj[i],
          index = i;
        if (callback.call(item, item, index) === false) break;
      }
      return obj;
    }

    // 对象的迭代：不用for in循环对象
    let keys = Object.getOwnPropertyNames(obj);
    if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i],
        value = obj[key];
      if (callback.call(value, value, key) === false) break;
    }
    return obj;
  }

  /* 数组和对象的深浅合并 */
  /**
   * @param  {array || object} params 
   * @return {array || object} target
   * 使用情况：
   *   merge(obj1, obj2, obj3)
   *   merge(true, obj1, obj2, obj3)
   */
  const merge = function merge(...params) {
    // 替换项
    let options,
      // 被替换项，第一项也没有，默认为空对象，后面判断
      target = params[0],
      // 索引
      i = 1,
      // arguments的长度
      length = params.length,
      // 是否为深合并
      deep = false,
      // 最后一项值，是一个Set集合，记录哪些对象已经处理过了
      treated = params[length - 1];

    // 最开始没有treated或者递归的时候有了
    // if (toType(treated) === "set" && treated.isHandler) {
    //   // 递归执行merge的情况，最后一项Set不循环
    //   length--;
    // } else {
    //   // 第一次执行merge，最后一项是一个对象，不符合上面的条件，创建一个Set集合
    //   thraeted = new Set();
    //   treated.isHandler = true;
    // }

    // 一般情况不对Set结构进行合并，所以最后一项没有Set，不做有标识严谨的判断
    toType(treated) === "set" ? length-- : treated = new Set();

    // 如果第一个参数是布尔值，那么就是深度合并
    if (typeof target === "boolean") {
      // 第一项值给deep
      deep = target;
      target = params[i];
      i++;
    }

    // 必须保证被替换项是一个对象
    if (target == null || (typeof target !== "object" && !isFunction(target))) target = {};

    // 迭代传递的剩下的对象，依次替换target
    for (; i < length; i++) {
      // 获取某一个替换项
      options = params[i];

      // 替换项存在才循环
      if (options == null) continue;

      // 防止死递归的处理，如果Set集合中已经存在了，就不再处理
      if (treated.has(options)) return options;
      // 把当前处理的对象放到Set集合中
      treated.add(options);

      // 依次拿出替换项中的某一项，替换被替换项中同名的这一项
      // copy：替换中的某一项属性值，name：替换中某一项的属性名
      each(options, (copy, name) => {
        // 检测属性值是否为数组
        let copyIsArray = Array.isArray(copy),
          // 检测属性值是否为对象
          copyIsObject = isPlainObject(copy),
          // 被替换项中的某一项
          src = target[name];
        if (deep && copy && (copyIsArray || copyIsObject)) {
          // 深合并
          // 如果替换中的某一项是数组，被替换中的某一项不是数组，则让被替换中的src为空数组
          if (copyIsArray && !Array.isArray(src)) src = [];
          if (copyIsObject && !isPlainObject(src)) src = {};
          // 递归的时候要传递treated标识
          target[name] = merge(deep, src, copy, treated);
        } else if (copy !== undefined) {
          // 浅合并 target中的某一项替换为copy
          target[name] = copy;
        }
      });
    }
    // 返回被替换项
    return target;
  }

  /* 实现数组和对象的深浅拷贝 */
  /**
   * 使用：
   *   clone(obj) 浅拷贝
   *   clone(true, obj) 深拷贝
   */
  const clone = function clone(...params) {
    // target被拷贝的值 deep深浅拷贝 
    let target = params[0],
      deep = false,
      length = params.length,
      type,
      i = 1,
      isArray,
      isObject,
      result,
      treated;

    if (toType(treated) !== 'set') treated = new Set();

    // clone(true) 长度必须大于1，这种情况只克隆true
    // clone(true, obj) 才是进行深拷贝的
    if (typeof target === 'boolean' && length > 1) {
      deep = target;
      target = params[1];
      i = 2;
    }
    // 给需要克隆的下一项设置Set集合，第一次进来没有就设置一个空集合，并且把处理过的添加进集合，下次进来的时候判断，有了就不处理了
    // 防止死递归
    treated = params[i];
    if (!treated) treated = new Set();
    if (treated.has(target)) return target;
    treated.add(target);

    type = toType(target);
    isArray = Array.isArray(target);
    isObject = isPlainObject(target);

    // 特殊值的拷贝，函数不需要拷贝，没有意义
    if (target == null) return target;

    if (!isArray && !isObject && !isFunction(target) && typeof target === "object") {
      // 只有标准特殊对象和非标准特殊对象
      try {
        return new target.constructor(target);
      } catch (_) { // bigint/symbol等不能被new的直接返回
        return target;
      }
    }

    if (!isArray && !isObject) return target;

    // 剩下数组和纯粹对象
    // 创建一个空数组或者对象，把需要克隆的对象和数组放到result中即可
    result = new target.constructor();

    each(target, (copy, name) => {
      // copy属性值 name属性名
      if (deep) {
        // 深拷贝
        result[name] = clone(deep, copy, treated);
        return;
      }
      // 浅拷贝
      result[name] = copy;
    });

    return result;
  }

  /* 设定具备有效期的localStoreage存储方案 */
  const storage = {
    // 存储信息:存储当前时间
    set(key, value) {
      value = {
        time: +new Date(),
        data: value
      };
      localStorage.setItem(key, JSON.stringify(value));
    },
    // 获取信息:有效期校验
    get(key, cycle = 60 * 60 * 1000) {
      // 默认是一天24小时
      cycle = +cycle;
      if (isNaN(cycle)) cycle = 60 * 60 * 1000;
      let value = localStorage.getItem(key);
      if (!value) return null;
      let { time, data } = JSON.parse(value);
      if ((+new Date() - time) > cycle) {
        // 过期了
        storage.remove(key);
        return null;
      }
      // 信息有效
      return data;
    },
    // 移除信息
    remove(key) {
      localStorage.removeItem(key);
    }
  };

  /* 把对象变为urlencoded格式字符串 xxx=xxx&xxx=xxx */
  const stringify = function stringify(obj) {
    // 获取所有的私有属性，返回数组
    let keys = Reflect.ownKeys(obj),
      str = ``;
    keys.forEach(key => {
      str += `&${key}=${obj[key]}`
    });
    return str.substring(1);
  };

  /* 
  作用：封装一个jsonp方法「基于promise管理」，执行这个方法可以发送jsonp请求
  参数配置：
    jsonp('http://127.0.0.1:1001/user/list', {
      params: {
        lx:0,
        name: 'hezi'
      },
      jsonp: 'cb'
    })
  使用jsonp函数发送请求
    jsonp('http://127.0.0.1:1001/user/list')
      .then(value => {
        console.log('请求成功:', value);
      });
  */
  const jsonp = function jsonp(url, options) {
    // 格式校验 && 合并默认配置项
    if (typeof url !== 'string') throw new TypeError('url is not a string');

    if (isPlainObject(options)) options = {};
    let { params, jsonpName } = Object.assign({
      params: null,
      jsonpName: 'callback'
    }, options);

    // 返回一个promise实例
    return new Promsie((resolve, reject) => {
      // 移除创建的全局函数&script标签
      const clear = () => {
        delete window[name];
        document.body.removeChild(script);
      }

      // 创建全局函数「不能导致全局变量污染」
      const name = `jsonp${+new Date()}`;

      // 发送请求

      // 浏览器接收到响应后，会自动执行这个 JavaScript 代码片段「创建的全局函数」，从而调用 window[name] 函数，并将服务器获取的结果 data 作为参数传递给它
      window[name] = function (data) {
        resolve(data);
        clear();
      };

      // 处理URL参数：把params拼接上 & 把全局函数名也拼接上
      if (isPlainObject(params)) {
        // 把对象变为urlencoded格式字符串
        params = stringify(params);
        url += `${url.includes("?") ? "&" : "?"}${params}`;
      }
      url += `${url.includes("?") ? "&" : "?"}${jsonpName}=${name}`;

      // 动态创建script标签，向服务器发送请求
      const script = document.createElement("script");
      script.src = url;
      script.onerror = () => {
        // 请求失败
        reject();
        clear();
      };
      document.body.appendChild(script);
    });
  };


  const utils = {
    toType,
    isFunction,
    isWindow,
    isArrayLike,
    isPlainObject,
    isEmptyObject,
    isNumeric,
    debounce,
    throttle,
    mergeArray,
    each,
    merge,
    clone,
    storage,
    jsonp
  };

  // 处理冲突：在Node和webpack中不存在冲突，保证导入的库定义的名字不重复即可，在浏览器中会重复
  // 保证在浏览器环境下
  if (typeof window !== "undefined") {
    // 用$保存现在谁在用
    let $ = window._;
    utils.noConflict = function noConflict() {
      if (window._ === utils) {
        window._ = $;
      }
      return utils;
    }
  }

  // 导出API
  if (typeof window !== "undefined") window.utils = window._ = utils;
  if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
})();
