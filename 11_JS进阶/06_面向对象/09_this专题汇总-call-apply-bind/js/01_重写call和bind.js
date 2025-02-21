/* 
Function.prototype上有三个方法
  + call
  + apply
  + bind
所有的函数都是Function类的实例，所以所有函数都可以调用这三个方法，而这三个方法都是用来改变函数中的this
*/

const fn = function fn(x, y) {
  console.log(this, x, y);
  return x + y;
};

let obj = {
  fn,
  name: 'obj'
};

fn(10, 20); // this->window x->10 y->20
obj.fn(10, 20); // this->obj x->10 y->20


/* 
 call VS apply
   + 都是把函数立即执行，改变函数中的this指向的「第一个参数是谁，就把this改为谁」
   + 唯一区别：apply要求把传递给函数的实参，以数组的形式管理起来「最终效果和call一样，也是把数组中每一项，一个个的传给函数」
   + 真实项目中建议大家使用call，因为其性能好一些「三个及以上参数，call的性能明显比apply好一些」
*/
fn.call(obj, 10, 20); // this->obj x->10 y->20
fn.apply(obj, [10, 20]); // this->obj x->10 y->20


// this在严格模式和非严格模式的区别
fn.call(); // this->window(非严格模式)  undefined(严格模式)
fn.call(); // this->window(非严格模式)  null(严格模式)

// =================
/* 
call方法执行的原理
  1. fn基于__proto__找到Function.prototype.call，把call方法执行
  2. 在call方法执行的时候：
    + context：obj 要改变的this指向，params：[10,20] 执行函数传递的实参信息  this:fn 要执行的函数
    + 立即把fn执行，并且让fn中的this指向obj，把10/20传递给fn，接收fn执行的返回结果，作为最后的结果返回
*/
Function.prototype._call = function _call(context, ...params) {
  // context 不传递或者传递null，最后要改的this都会是window
  context == null ? context = window : null;
  // 必须要保证context都是引用数据类型的值(不论你传递给我的是啥类型的),保证可以设置成员
  !/^(object|function)$/.test(typeof context) ? context = Object(context) : null;

  // this->fn context->obj params->[10,20]
  // 思路：给context设置一个属性xxx「新增的属性不能和原始context中的属性冲突，使用Symbol唯一值设置」，让属性值等于执行的函数(fn即this)，后面就可以基于 context.xxx() 执行，这样既把函数执行了，也让函数中的this改为context了

  let self = this,
    key = Symbol('key'),
    result;
  context[key] = self;
  result = context[key](...params);
  return result;
  // 新增的属性用完移除
  // ES6中可以基于Reflect.deleteProperty方法删除属性
  // Reflect.deleteProperty(context, key);
  delete context[key];
};
let res = fn._call(obj, 10, 20);
console.log(res);

// =================
const submit = document.querySelector('#submit');
const obj = { name: 'obj' };
const fn = function fn(x, y, ev) {
  console.log(this, x, y, ev);
}

// submit.onclick = fn; // 点击按钮 this->submit x->PointerEvent

// 需求：点击按钮，fn方法执行，我们想让其中的this变为obj，ev事件对象也存在，再传递10/20

// 这样处理事错误的，因为call是把函数立即执行，还没点击呢，fn就执行了。。
// submit.onclick = fn.call(obj, 10, 20);

// 先给事件行为绑定匿名函数，当点击的时候，先执行匿名函数「获取到ev事件对象了」，在匿名函数执行的时候(this->submit)，我们再让真正要处理的fn函数执行，此时就可以基于call去改变this了。。
// submit.onclick = function (ev) {
//   fn.call(obj, 10, 20, ev);
// }

// 重写bind
Function.prototype._bind = function _bind(context, ...params) {
  // this->fn context->obj params->[10, 20]
  let self = this;
  return fucntion proxy(args){
    params = params.concat(args);
    return self.call(context, ...params);
  }
}