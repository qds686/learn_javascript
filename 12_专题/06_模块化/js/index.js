// 1.模块化
function init() {
  test();
}

var test = (function () {
  function init() {
    bindEvent();
  }

  function bindEvent() { }

  return function () {
    init();
  }
})();

// 2.抛出方法集合
// 使用：test.test1();
var test = (function () {
  var test1 = function () {
    console.log('test1');
  },
    test2 = function () {
      console.log('test2');
    },
    test3 = function () {
      console.log('test3');
    }

  return {
    test1: test1,
    test2: test2,
    test3: test3
  }
})();


// 2.模块之间调用，在要使用的模块中注入另一个模块，这种写模块的方式叫做放大模式 augmentation
// mod2.test4();
var mod1 = (function () {
  var test1 = function () {
    console.log('test1');
  },
    test2 = function () {
      console.log('test2');
    },
    test3 = function () {
      console.log('test3');
    }

  return {
    test1: test1,
    test2: test2,
    test3: test3
  }
})();

var mod2 = (function () {
  var test4 = function () {
    mod.test1();
  },
    test5 = function () {
      mod.test2();
    },
    test6 = function () {
      cmod.test3();
    }

  return {
    test4: test4,
    test5: test5,
    test6: test6
  }
})(mod1);

// 4. 多个人写同一个模块
// 引用JS的时候先引用Person1，再引用Person2，这样定义的对象中就有所有人写的方法和属性
// 给Person1中mod增加属性和方法，最后会出现在mod中

// 不用定义mod的时候，在注入的时候要给默认值，这种模式叫宽放大模式 loose augmentation
// 在默认值对象中增加属性和方法，建议每一个模块都加上
// 要使用全局的属性和方法，同样先注入再使用

// Person1
var mod = { c: 3 };
var g = 'GLOBAL';

mod = (function (module, global) {
  module.a = 1;

  module.test1 = function () {
    console.log('test1');
  }

  console.log(global);

  return module;
})(mod || {}, g);

// Person2
var mod = (function (module) {
  module.b = 2;

  module.test2 = function () {
    console.log('test2');
  }

  return module;
})(mod || {});