// => 数学对象Math
// abs 求绝对值 不管正数还是负数  结果都是正数
console.log(Math.abs(-1)); // 1

// floor 向下取整，不管正数还是负数，都是取小的
console.log(Math.floor(3.2)); // 3
console.log(Math.floor(3.6)); // 3
console.log(Math.floor(-1.1)); // -2

// ceil 向上取整，不管正数还是负数，都是取大的
console.log(Math.ceil(1.2)); // 2
console.log(Math.ceil(-1.2)); // -1

// round 四舍五入  如果是负数，小数的临界值一定要大于0.5  
console.log(Math.round(1.5)); // 2
console.log(Math.round(-1.5)); // -1
console.log(Math.round(-1.51)); // -2

// min 最小值
console.log(Math.min(1, 2)); // 1

// max 最大值
console.log(Math.max(1, 2)); // 2

// sqrt 开平方
console.log(Math.sqrt(9)); // 3

// pow(n,m) 取幂 n^m
console.log(Math.pow(2, 3)); // 8

// PI=3.14...
console.log(Math.PI); // 3.141592653589793
 
// random 随机小数(0,1)不包含1
// 获取 n 到 m 之间的随机数：(n,m)
// Math.random() * (m - n) + n;

// 1-100之间的整数 包含1也包含100 => 1-101
Math.floor(Math.random() * 100 + 1); // 1-101
console.log(Math.random() * 99 + 1); // 1-100




















