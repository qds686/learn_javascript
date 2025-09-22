// 1
// const fs = require('fs')
// fs.readFile('./data/user.json', 'utf8', function(err, data) {
//   if(err){
//     console.log(err);
//     return;
//   }

//   console.log(data);
// });

// 2 将FS模块中的方法Promise化
// const fs = require('fs').promises;
// fs.readFile('./data/user.json', 'utf8').then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log(err);
// });

// 3 Node中扐模块可以Promise化一个方法
// const fs = require('fs');
// const util = require('util');

// const readFile = util.promisify(fs.readFile);

// readFile('./data/user.json', 'utf8').then((res) => {
//   console.log(res);
// }, (err) => {
//   console.log(err);
// });

// 4 自己封装promisify
const util = require('./utils');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
readFile('./data/user.json', 'utf8').then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
});

// 5 promisifyAll
const fs = require('fs');
const util = require('./utils');
const fsFunctions = util.promisifyAll(fs);

fsFunctions.readFileAsync('./data/user.json', 'utf8').then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
});