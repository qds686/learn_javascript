// 任意数求和
// 需求：如果传的实参中包含字符串，就变成数字，如果是非有效数字，就直接略过
// 1.
// function sum() {
//   var args = arguments,
//       result = 0;
//   for (var i = 0; i < args.length; i++) {
//     var item = Number(args[i]);
//     if(!isNaN(item)){
//       result = result + item;
//     }
//   }
//   return result;
// }

// 2.
// var sum = (...args) => {
//   var result = 0;
//   for (var i = 0; i < args.length; i++) {
//     var item = Number(args[i]);
//     if (!isNaN(item)) {
//       result = result + item;
//     }
//   }
//   return result;
// }

// 3.
function sum(...arg) {
  return eval(arg.filter((item) => !isNaN(item)).join("+"))
}

var res = sum(10, 20);
console.log(res); // 30

var res = sum(10, 20, '30');
console.log(res); // 60 字符串转换为数字

var res = sum(10, 20, '30', 'AA', 40);
console.log(res); // 100  非有效数字不进行累加