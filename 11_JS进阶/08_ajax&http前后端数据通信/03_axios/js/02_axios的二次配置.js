const app = createApp(App);
app.mount('#app');

const source = axios.CancelToken.source(); 
axios.post('/user/login', {
  account: 'hezi',
  password: md5('123456')
}, {
  // 请求的通用前缀，最后的请求地址：baseURL+URL处理的「特殊幸亏：如果URL中包含http(s)://，而baseURL中也含这个东西，则不会拼接，直接以URL为主就行了」
  baseURL: '/api',
  // 只针对与post系列请求，在发送请求之前，对请求主体传递额对象data进行格式化处理
  // 不设置这个配置，默认会把data变为JSOnp字符串传递给服务器：一旦设置了这个配置项，返回的啥值，则把啥传递给服务器「对象会变为字符串 "[object Object]"」
  transformRequest(data) { 
    // 在这里可以对请求数据进行转换
    if(__dirname.isPlainObject(data)) data = qs.stringify(data);
    return data;
  },
  // 默认情况下，服务器返回的HTTP状态码以2开始才算请求成功，其余都算失败
  validateStatus(status) {
    return status >= 200 && status < 300; 
  },
  // 设置超时时间 默认0则不设置超时，单位是MS
  timeout: 6000,
  cancelToken: source.token
}).then(response => {
  // 请求成功后，我们把服务器返回的响应主体信息返回
  return response.data;
}).then(value => {
  // 把token存储到本地
  _.storage.set('token', value.token);
}).catch(reason => {
  /* 
  请求失败要做提示：
    + 服务器有返回结果，但是状态码没有经过validataStatus的校验 reason.response.status，我们可以基于服务器返回的不同状态码做不同的提示
    + 请求超时 reason.code === 'ECONNABORTED'
    + 请求中断 axios.isCancel(reason)
    + 剩下的情况都可以理解为断网了
  */
  console.log('失败:', reason);
});
source.cancel('我取消了请求');