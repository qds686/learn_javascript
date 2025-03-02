/*
// fetch基础配置
fetch('https://httpbin.org/get', {
  // 默认是get
  method: 'get',
  // no-cors
  //   仅允许使用一组有限的http请求头 
  //   Accept/Accept-Language
  //   content-Type:application/x-www-for-urlencoded|multipart/form-data|text/plain
  // 默认是cors
  mode: "cors",
  // 设置是否允许携带资源凭证 omit都不允许 same-origin同源允许 include都允许
  credentials: include,
  // 只有在post或put请求下才允许设置body，否则会报错
  // 设置请求主体，但是需要再Headers中指定对应类型的Content-Type值(MIME类型)
  // body: {}
  // 中断请求的信号
  // signal: xxx,
  cache: 'no-cache',
})
  .then(response => {
    let { status, statusText } = response;
    if (status >= 200 && status < 400) {
      return response.json();
    }
    return Promise.reject({
      code: 'STATUS ERROR',
      status,
      statusText
    });
  })
  .then(value => {
    console.log('成功:', value);
  })
  .catch(reason => {
    console.log(reason);
  });
*/

// fetch二次封装

/* 
  request([config])
    + url 请求的地址
    + method 请求的方式 *get delete head options post put patch
    + credentials 携带资源凭证的方式 *include/same-origin/omit
    + headers:null 自定义的请求头信息「格式必须是纯粹对象」
    + body:null「只针对于post系列请求，根据当前服务器要求，如果用户传递的是一个对象，我们需要把其变为urlencoded格式字符串，然后再设定请求头中的Content-Type」
    + params:null 设定问号传参信息「格式必须是纯粹对象，我们在内部霸气拼接到URL的末尾」
    + responseType 预设服务器返回结果的读取方式 *json/text/arrayBuffer/blob
    + signal 中断请求的信号
  request.get/head/delete/options([url],[config]) 预先指定了配置项中的URL和methods
  request.post/put/patch([url],[body],[config]) 预先指定了配置项中的methods/url/body
  request.abort() 中断当前请求
    + 在封装方法里不进行中断处理，因为写一个中断会控制所有的请求中断
    + 使用面向对象类创建request返回的是request类的实例，不是promise的实例，无法进行中断操作
*/
import qs from '../tools/qs.js';
import isPlainObject from '../tools/utils.js';
import { Message } from 'element-ui'

/* 核心方法 */
const request = function request(config) {
  // init config & validate「扩展：可以给每一项都做校验」
  if (!isPlainObject(config)) config = {};
  config = Object.assign({
    url: '',
    method: 'get',
    Credential: 'include',
    Headers: null,
    body: null,
    params: null,
    responseType: 'json',
    signal: null
  }, config);
  // 
  if (!isPlainObject(config.headers)) config.headers = {};
  if (config.params !== null && !isPlainObject(config.headers)) config.params = null;
  let { url, method, credentials, headers, body, params, responseType } = config;

  // 处理URL：params存在，需要把params中的每一项拼接到URL末尾
  if (params) url += `${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`;

  // 处理请求主体：只针对post系列请求，如果body是个纯粹对象，根据当前后台要求，把其变为urlencoded格式
  if (isPlainObject(body)) {
    body = qs.stringify(body);
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  // 类似于axios的请求拦截器，例如：把存储在客户端本地的token信息携带给服务器「根据当前后台要求处理」
  // 根据项目存储的token名字获取
  // let token = localStorage.getItem('token');
  // if (token) headers['authorzation'] = token;

  // send
  method = method.toUpperCase();
  config = {
    method,
    credentials,
    headers,
    cache: 'no-cache',
    mode: 'cors'
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body;
  if (signal) config.signal = signal;

  return fetch(url, config).then(response => {
    // 成功则返回响应主体信息
    let { status, statusText } = response,
      result;
    // 状态码错误
    if (!/^(2|3)\d{2}$/.test(status)) return Promise.reject({ code: -1, status, statusText });
    switch (responseType.toLowerCase()) {
      case 'text':
        result = response.text();
        break;
      case 'arraybuffer':
        result = response.arrayBuffer();
        break;
      case 'blob':
        result = response.blob();
        break;
      default:
        result = response.json();
    }
    // 读取数据失败
    return result.then(null, reason => Promise.reject({ code: -2, reason }));
  }).catch(reason => {
    /* 
    // 根据不同的失败情况做不同的统一提示
    let code = reason?.code;
    if (+code === -1) {
      // 状态码问题
      switch(+reason.status){

      }
    } else if (+code === -2) {
      // 读取数据出现问题
    }else if (+code === 20){
      // 请求被中断
    } else {
      // 网络问题
    } 
    */
    Message.error('小主，当前网络出现异常，请稍后再试~');
    return Promise.reject(reason);
  });
};

/* 快捷方法 */
['GET', 'HEAD', 'DELETE', 'OPTIONS'].forEach(item => {
  request[item.toLowerCase()] = function (url, config) {
    if (!isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    return request(config);
  };
});
['POST', 'PUT', 'PATCH'].forEach(item => {
  request[item.toLowerCase()] = function (url, body, config) {
    if (!isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    config['body'] = body;
    return request(config);
  };
});

export default request;

// 使用request
request.get('https://httpbin.org/get').then(response => {
  console.log('成功:', response);
});