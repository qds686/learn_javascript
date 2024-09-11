// 1
/* 
EC(G)
  VO(G)/GO
    a->10
    b->11
    c->12->3
    test->0x000 [[scope]]:EC(G)
  变量提升：
    var a,
        b,
        c
    function test(a){...}
*/
// var a = 10,
//     b = 11,
//     c = 12;
// function test(a) {
//     /* 
//     test(10)->0x000(10) EC(TEST)
//       AO(TEST)
//         a->10->1
//         b->2
//       作用域链：<EC(TEST),EC(G)>
//       形参赋值：a=10
//       变量提升：
//         var b;
//     */
//     a = 1; //a是私有的
//     var b = 2;
//     c = 3; //c是全局的
// }
// test(10);
// console.log(a, b, c);// 10 11 3

// 2
/**
 * EC(G)
 *   VO(G)/GO
 *   变量提升：
 *     var a;
 *     b = 0x000; [[scope]]:EC(G)
 *   代码执行
 */
var a = 4;
function b(x, y, a) {
    /**
     * EC(B)
     *  AO(B)
     *   x->1
     *   y->2
     *   a->3
     *  作用域链：<EC(B),EC(G)>
     *  初始化this：window
     *  初始化arguments（实参集合，类数组）:
     *      {
     *          0:1,
     *          1:2,
     *          2:3,//=>10 此时a的值也会跟着改为10
     *          length:3,
     *          callee:function b(){...}
     *      }
     *      =>在JS的非严格模式下，当“初始化arguments”和“形参赋值”完成后，会给两者建立一个“映射”机制：集合中的每一项和对应的形参变量绑定在一起了，一个修改都会跟着更改！而且只会发生在“代码执行之前”建立这个机制！
     *      =>在JS的严格模式下，没有映射机制，也没有arguments.callee这个属性；箭头函数中没有arguments；
     *  形参赋值：x = 10 y=2 a=3
     *  变量提升:--
     */
    console.log(a);//3
    arguments[2] = 10;
    console.log(a);//10
}
a = b(1, 2, 3);//a=undefined 因为函数没有返回值
console.log(a);// undefined



















