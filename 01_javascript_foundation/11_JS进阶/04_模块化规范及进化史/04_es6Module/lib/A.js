let name = "盒子";
const sum = function sum(...params) {
  let len = params.length;
  if (len === 0) return 0;
  if (len === 1) return +params[0];
  let result = params.reduce((res, item) => +res + (+item));
  return result;
};

// export 声明一个变量=值

export const num = 10;
export const obj = { name: '盒子'};
export function fn(){};
export default sum;