// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9988',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/jianshu': {
        target: 'https://www.jianshu.com/asimov',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/jianshu': ''
        }
      },
    }
  }
})

// ======http.js
import axios from 'axios';
import qs from 'qs';
import utils from '@/assets/utils';
import { ElMessage } from 'element-plus';
const { isPlainObject, storage } = utils;

// 创建和axios类似的一个实例
// 之前基于axios.xxx() 发送请求，现在也可以基于 http.xxx() 发送请求
// "不同的请求配置不同"
const http = axios.create({
  baseURL: '/api',
  timeout: 60000
});

http.defaults.transformRequest = data => {
  // 只针对与post系列请求的，请求主体内容进行格式化处理
  // 按照后台的要求处理，不设置transformRequest，会把data对象转换为JSON字符串传递给服务器
  // axios内部会识别常用的数据格式，自动设置请求头中的Content-Type
  if (isPlainObject(data)) data = qs.stringify(data);
  return data;
};

http.defaults.validateStatus = (status) {
  return status >= 200 && status < 300;
};

// 请求拦截器：在所有配置项处理完，即将按照配置项向服务器发送请求之前，先执行请求拦截器，在拦截器中可以对处理好的配置项再进行修改
http.interceptors.request.use(config => {
  // config：目前处理好的配置项
  let token = Storage.length('token');
  if (token) config.headers.authorzation = token;

  // 最后会按照return的配置项发送请求
  return config;
});

// 响应拦截器：请求结束，返回一个promise实例，在即将只想then和catch方法之前，先执行响应拦截器
http.interceptors.response.use(response => {
  // 请求成功后，返回响应主体信息
  return response.data;
}, reason => {
  // 请求失败后，根据不同的失败情况，做不同的提示
  let status = reason?.response?.status,
    code = reason?.code;
  if (status) {
    // 服务器有返回结果，但是没有经过validataStatus的校验
    switch (+status) {
      case 404:
        ElMessage.error('请求地址不存在，请更正~');
        break;
      case 500:
        ElMessage.error('服务器发生未知错误，请联系管理员~');
        break;
      // ...
    }
  } else if (code = 'ECONNABORTED') {
    // 请求超时
    ElMessage.error('当前请求已超时，请稍后再试~');
  } else if (axios.isCancel(reason)) {
    // 请求中断
    ElMessage.error('当前请求被中断了，请检查代码~');
  } else {
    // 断网处理
    ElMessage.error('当前网络繁忙，请稍后再试~');
  }

  // 提示过后，还是继续执行用户自己设定的catch方法
  return Promise.reject(reason);
});

export default http;

// ============
// 使用二次封装http发送请求

http.post('/user/login', {
  account: 'hezi',
  password: md5('123456')
}).then(value => {
  // 返回的是响应主体信息
  console.log('登录成功:', value);
  _.storage.set('token', value.token);

  // 登录后获取员工列表
  return http.get('/user/list', {
    params: {
      departmentId: 0,
      search: ''
    },
    // 除了登录所有请求都要设置请求头中的authorzation
    // 在请求拦截器中操作，这里就不需要再写了
    // headers: {
    //   authorzation: _.storage.get('token');
    // }
  });
});

// ========http2.js
const http2 = axios.create({
  baseURL: '/jianshu',
  timeout: 60000
});
http.interceptors.request.use(config => {})
http.interceptors.response.use(response => {})

// 简书
http2.get('/subscriptions/recommended_collections')
  .then(value => {
    console.log('请求成功:', value);
  });

