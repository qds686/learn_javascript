// queryURLParams
// 需求：https://www.baidu.com?name=hezi&age=10&id=14#user，从这个地址中提取问号参数后面的信息，并把它们以键值对的形式放在一个对象中

// function queryURLParams(str) {

//   var obj = {},
//     paramsStr = str.split("?")[1]; // 'name=hezi&age=10&id=14'
//   if (paramsStr) {
//     var paramsItem = paramsStr.split("&"),
//       item,
//       key,
//       val;
//     for (var i = 0; i < paramsItem.length; i++) {
//       item = paramsItem[i]; // name=hezi
//       key = item.split("=")[0],
//         val = item.split("=")[1];
//       obj[key] = val;
//     }
//   }
//   return obj;
// }

// 方案一：字符串拆分
/* 
const queryURLParams = function queryURLParams(url, attr) {
  // 获取问号传参的信息以及hash值信息
  let askIndex = url.indexOf('?'),
    weiIndex = url.lastIndexOf('#'),
    askText = '',
    weiText = '',
    // 存储最终的结果
    params = {};
  weiText = url.substring(weiIndex + 1); // 'user'
  params['HASH'] = weiText;
  askText = url.substring(askIndex + 1, weiIndex); // 'name=hezi&age=10&id=14'
  let arr = askText.split('&'); // ['name=hezi', 'age=10', 'id=14']
  arr.forEach(item => {
    let [key, value] = item.split('=');
    params[key] = value;
  });

  return typeof attr !== 'undefined' ? params[attr] : params;
} 

var str = 'https://www.baidu.com?name=hezi&age=10&id=14#user';
var res = queryURLParams(str);
console.log(res); // {HASH: 'user', name: 'hezi', age: '10', id: '14'}
res = queryURLParams(str, 'name');
console.log(res); // 'hezi'
*/

// 优化方案一: 
/* 
const queryURLParams = function queryURLParams(url, attr) {
  let askIndex = url.indexOf('?'),
    weiIndex = url.lastIndexOf('#'),
    askText = '',
    weiText = '',
    params = {};

  // 考虑的问题： “#”是否存在，“?”是否存在，“#和?”谁在前面
  // 如果#不存在，但是?存在：hash值不需要处理，问号参数的值是从问号后一项开始截取到末尾
  // 如果#存在，但是?不存在：问号参数不需要处理，hash值从#后一项开始截取到末尾
  // 如果# 和 ? 都不存在：什么都不用处理
  // 如果#和?都存在
  //   + #在?的后面：问号信息，从?后一项开始姐却到#（它不包含），hash值从#后一项截取到末尾 
  //   + #在?的前面：hash信息从#后一项截取到?(不包含它)，问号信息从?后一项截取到末尾
  if (weiIndex === -1 && askIndex >= 0) {
    askText = url.substring(askIndex + 1);
  } else if (askIndex === -1 && weiIndex >= 0) {
    weiText = url.substring(weiIndex + 1);
  } else if (askIndex >= 0 && weiIndex >= 0) {
    if (weiIndex > askIndex) {
      weiText = url.substring(weiIndex + 1);
      askText = url.substring(askIndex + 1, weiIndex);
    } else {
      weiText = url.substring(weiIndex + 1, askIndex);
      askText = url.substring(askIndex + 1);
    }
  }

  weiText !== '' ? params['HASH'] = weiText : null;

  if (askText !== '') {
    let arr = askText.split('&');
    arr.forEach(item => {
      let [key, value] = item.split('=');
      params[key] = value;
    });
  }

  return typeof attr !== 'undefined' ? params[attr] : params;
}


let url1 = 'https://www.baidu.com#user?name=hezi&age=10&id=14';
let url2 = 'https://www.baidu.com?name=hezi&age=10&id=14#user';
let url3 = 'https://www.baidu.com?name=hezi&age=10&id=14';
let url4 = 'https://www.baidu.com#user';
let url5 = 'https://www.baidu.com';

// 如果#和?都存在
let res1 = queryURLParams(url1);
console.log(res1); // {HASH: 'user', name: 'hezi', age: '10', id: '14'}
res1 = queryURLParams(url1, 'name');
console.log(res1); // 'hezi'

let res2 = queryURLParams(url2);
console.log(res2); // {HASH: 'user', name: 'hezi', age: '10', id: '14'}
res2 = queryURLParams(url2, 'name');
console.log(res2); // 'hezi'

//  “#”是否存在，“?”是否存在
let res3 = queryURLParams(url3);
console.log(res3); // {name: 'hezi', age: '10', id: '14'}
res3 = queryURLParams(url3, 'name');
console.log(res3); // 'hezi'

let res4 = queryURLParams(url4);
console.log(res4); // {HASH: 'user'}
res4 = queryURLParams(url4, 'name');
console.log(res4); // 'undefined'

let res5 = queryURLParams(url5);
console.log(res5); // {}
res5 = queryURLParams(url5, 'name');
console.log(res5); // 'undefined' 
*/

// 方案二：利用A元素对象处理
// 识别不了#在?之前：正常的URL地址，#都要在?之后，这是一个标准，但是在Vue、React路由中可以把#放在?前面
/* const queryURLParams = function queryURLParams(url, attr) {
  let link = document.createElement('a'),
    askText = '',
    weiText = '',
    params = {},
    usp;

  // 利用A元素对象快速获取问号参数信息和hash信息
  link.href = url;
  askText = link.search.substring(1);
  weiText = link.hash.substring(1);
  link = null;

  // 解析信息：基于ES6新增的URLSearchParams实现问号参数解析
  usp = new URLSearchParams(askText);
  usp.forEach((value,key)=> params[key] = value);
  weiText !== '' ? params['HASH'] = weiText : null;

  return typeof attr !== 'undefined' ? params[attr] : params;
} */

// 方式三：基于正则表达式
const queryURLParams = function queryURLParams(url, attr) {
  let params = {};

  url.replace(/#([^?=#&]+)/g, (_, hash) => params['HASH'] = hash);
  url.replace(/([^?=#&]+)=([^?=#&]+)/g, (_, key, value) => params[key] = value);

  return typeof attr !== 'undefined' ? params[attr] : params;
}

let url1 = 'https://www.baidu.com#user?name=hezi&age=10&id=14';
let url2 = 'https://www.baidu.com?name=hezi&age=10&id=14#user';
let url3 = 'https://www.baidu.com?name=hezi&age=10&id=14';
let url4 = 'https://www.baidu.com#user';
let url5 = 'https://www.baidu.com';

// 如果#和?都存在
let res1 = queryURLParams(url1);
console.log(res1); // {HASH: 'user', name: 'hezi', age: '10', id: '14'}
res1 = queryURLParams(url1, 'name');
console.log(res1); // 'hezi'

let res2 = queryURLParams(url2);
console.log(res2); // {HASH: 'user', name: 'hezi', age: '10', id: '14'}
res2 = queryURLParams(url2, 'name');
console.log(res2); // 'hezi'

//  “#”是否存在，“?”是否存在
let res3 = queryURLParams(url3);
console.log(res3); // {name: 'hezi', age: '10', id: '14'}
res3 = queryURLParams(url3, 'name');
console.log(res3); // 'hezi'

let res4 = queryURLParams(url4);
console.log(res4); // {HASH: 'user'}
res4 = queryURLParams(url4, 'name');
console.log(res4); // 'undefined'

let res5 = queryURLParams(url5);
console.log(res5); // {}
res5 = queryURLParams(url5, 'name');
console.log(res5); // 'undefined' 