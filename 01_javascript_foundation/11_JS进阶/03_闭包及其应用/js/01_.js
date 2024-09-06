let x = 5;
const fn = function fn(x){
  return function (y){
    console.log(y + (++x));
  }
};
let f = fn(6);
f(7);
fn(8)(9);
f(10);
console.log(x);