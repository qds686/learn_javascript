/* 
@2 call继承：把父类当做普通方法执行「原型啥的就没有作用了」，让方法中的this是子类的实例，这样可以达到让父类中的私有属性，最后也变为子类实例私有的属性

@3 把call继承和变形的原型继承混合在一起，就实现了“寄生组合式继承” 「推荐」
  Child.prototype = Object.create(Parent.prototype);
*/
// function Parent() {
//   this.x = 100;
// }

// Parent.prototype.getX = function () { }

// function Child() {
//   // call继承
//   Parent.call(this); // child.x = 100
//   this.y = 200;
// }

// Child.prototype = Object.create(Parent.prototype);
// Child.prototype.getY = function () { }

// let child = new Child;
// console.dir(child);

/* @4 ES6类的继承 extends*/

class Parent {
  constructor() {
    this.x = 100;
  }
  getX() { }
}

class Child extends Parent{
  constructor() {
    // 一旦使用extends，并且编写了constructor，必须在constructor函数第一行上写上 super(),否则会报错
    // super()相当于Parent.call(this)
    super(); 
    this.y = 200;
  }
  getY() { }
}

let child = new Child;
console.dir(child);


















