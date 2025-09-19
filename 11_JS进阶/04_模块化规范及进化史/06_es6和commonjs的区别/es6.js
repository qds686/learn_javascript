import { a } from './exports.js';

setTimeout(() => {
  console.log('来自es6', a);
}, 500);

// 来自exports 1
// 来自es6 1