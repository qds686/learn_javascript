/* 
面向对象中：类的“继承、封装、多态”
  + 继承：子类继承父类的属性和方法
  + 封装：把实现某个功能的代码进行封装处理，后期想实现这个功能，直接调用函数执行即可“低耦合、高内聚”
  + 多态：重载和重写，重载是方法名相同，参数类型或者个数不同，这样会认为是多个方法；重写是子类重写父类的方法
*/

/**
 * @1 原型继承
 *  特点：
 *    + 和传统后台语言中的继承不一样，「后台：子类继承父类，会把父类的方法copy一份给子类」
 *    + 并没有把父类的方法copy一份给子类，而是建立子类和父类原型之间的原型链指向，后期子类实例访问父类中的提供的属性方法，也是基于__proto__原型链一层层查找的
 *  结果：
 *    + 父类想要赋予其实例私有的属性X，此时变为子类实例child的共有属性
 *    + 子类实例可以基于原型链，修改父类原型上的方法，这样会对父类的其他实例会产生影响
 *
 */
function Parent() {
  this.x = 100;
}

Parent.prototype.getX = function () { }

function Child() {
  this.y = 200;
}
Child.prototype = new Parent; // 原型继承：让子类的原型指向父类的实例，这样子类的实例就可以访问父类的属性和方法，
Child.prototype.getY = function () { }

let child = new Child;
/* 
Child {
  y: 200
  prototype: {
    getY: function () { }
    x: 100
    prototype: {
      getX: function () { }
    }
  }
}
*/
console.dir(child);












