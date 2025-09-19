const { a } = require('./exports');

setTimeout(() => {
  console.log('来自commonjs', a);
}, 500);

// node commonjs.js
// 来自exports 1
// 来自commonjs 0