// 1
function C1(name) {
  if (name) {
    this.name = this.name;
  }
}
function C2(name) {
  this.name = name;
}
function C3(name) {
  this.name = name || 'join';
}
C1.prototype.name = 'Tom';
C2.prototype.name = 'Tom';
C3.prototype.name = 'Tom';
alert(
  (new C1().name) + (new C2().name) + (new C3().name)
);
// new C1().name) 没有传值，判断没有执行，没有给实例加私有属性，所以到共有属性中找，结果是“Tom”
// new C2().name 没有传值，name是undefined，给实例添加私有属性name，值为undefined
// new C3().name 同理，返回join
// => “Tomundefinedjoin”

