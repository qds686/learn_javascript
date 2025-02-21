/*
axios 基于promise封装的Ajax库「核心还是基于 XMLHttpRequest 发送请求的」
1.基于axios发送数据请求，返回结果都是一个promise实例

1.1 服务器返回的HTTP状态码是以2开始的，则让promise状态为成功，值是一个response对象
response = {
  config: { ...}, 发送axios请求设置的配置项
  data: { ...}, 服务器返回的响应主体信息
  headers: { ...}, 服务器返回的响应头信息
  request: XMLHttpRequest实例对象, 原生的xhr对象
  status：200，服务器响应的http状态码
  statusText: 'OK' 状态码的描述
}

1.2 promise状态为失败

1.2.1 服务器有返回信息「response对象存在」，只不过http状态码不是以2开始的
reason = {
  config: { ...},
  isAxiosError: true,
  request: XMLHttpRequest实例对象,
  response: 等同于成功获取的response对象,
  toJSON: function...
  message: 'xxx',
  ...
}

1.2.2 请求超时 或者 请求中断
reason = {
  code: "ECONNABORTED",
  response: undefined
  其他的和@1一样
}

1.2.3 断网，特点：服务器没有反馈任何的信息


1.3 我们可以自定义服务返回的http状态码为多少是成功，为多少是失败
axios.get([url], {
  ...,
  // axios的validateStatus配置项，就是自定义promise实例状态是成功的条件
  validateStatus: (status) => {
    return status >= 200 && status < 300; // 默认处理机制  
  }
})

2.基于axios发送请求的方式
@1 axios([config]) 或者 axios([url], [config])
@2 axios.request([config])
@3 axios.get / delete /head/options([url], [config])
@4 axios.post / put / patch([url], [data], [config])
  data基于请求主体传递给服务器的信息
@5 let instance = axios.create([config])
  创建的instance等同于axios，使用起来和axios一样
  instance.get([url], [config])
  ...

3.axios发送请求时候的配置项 config
3.1 url：请求的地址
发送请求的时候，但凡没有单独设置URL的，都需要在配置项中指定
3.2 baseURL：请求地址的通用前缀
最后发送请求的时候，是把baseURL和url拼接在一起发送的

axios.get('/user/list', {
  baseURL: 'http://api.hezi.cn',
  ...
});

最后发送请求的地址是 'http://api.hezi.cn/user/list'
特殊情况：如果url地址本身已经存在了 http或者https 等信息，说明URL本身就已经是完整的地址了，baseURL的值则无需再拼接了

3.3 transformRequest
它“只针对post系列请求”，把我们自己传递[data]格式化为指定的格式，后期再基于请求主体发送给服务器
transformRequest: (data, headers) => {
  // data:自己传递[data]
  // headers:设置的请求头信息(对象)
  return xxx; // 返回值是啥，最后基于请求主体传递的就是啥
}

axios内部做了一个处理，根据我们最后处理好的[data]的格式，自动设置请求头中的Content-Type值「不一定完全准确」

3.3.1 客户端基于请求主体传递给服务器的数据格式
  + form-data格式，Content-type:multipart/form-data，主要应用于文件上传/表单提交
    + x-www-form-urlencoded格式，Content-type:multipart/x-www-form-urlencoded
    get系列请求：是基于URL问号传参把信息传递给服务器的(?xxx = xxx & xxx=xxx), 这种字符串就是urlencoded格式字符串
  + raw: 泛指，代指文本格式(普通文本字符串，json格式字符串...)
    普通格式字符串 Content-type:text/plain
    json格式字符串 Content-type:application/json
    ...
  + binary: 进制格式数据，主要应用于文件上传

3.3.2 axios内部在默认情况下，如果我们[data]传递的是个普通对象，而且也没有经过 transformRequest 处理，则内部默认把对象变为JSON格式字符串传递给服务器
axios.post("/user/login", {
  name: 'hezi',
  age: 18
}, {
  transformRequest: (data) => {
    if (isPlainObject(data)) {
      // 把对象变为urlencoded格式
      return qs.stringify(data);

      // 把对象变为JSON格式字符串
      // return JSON.stringify(data);
    }
    return data;
  }
});

3.4 transformResponse
在我们自己.then /catch 之前，对服务器返回的结果进行修改
transformResponse: data => {
  // data:从服务器获取的结果,而且是响应主体信息「服务器响应主体返回的信息一般都是JSON格式字符串」
  return data;
}

axios.post("/user/login", {
    name: 'hezi',
    age: 18
  },
  {
    transformRequest: (data) => {
      if (isPlainObject(data)) {
        // 把对象变为urlencoded格式
        return qs.stringify(data);

        // 把对象变为JSON格式字符串
        // return JSON.stringify(data);
      }
      return data;
    },
    transformResponse: data => {
      return data;
    }
  }
).then(response => {
  console.log(response);
})

3.5 headers: {... } 自定义请求头信息

3.6 params: {... } 
get系列请求，基于URL问号参数，把信息传递给服务器
params一般设置为对象，axios内部会把对象变为 urlencoded 格式拼接到URL的末尾

3.7 data: {... }
post系列请求，基于请求主体传递的信息...

3.8 timeout: 0 设置超时时间，写0就是不设置

3.9 withCredentials: false 在CORS跨域请求中，是否允许携带资源凭证

3.10 responstType: 把服务器返回的结果设置为指定的格式
'arraybuffer', 'blob', 'document', 'json'「默认」, 'text', 'stream'...

3.11 onUploadProgress / onDownloadProgress
监听上传和下载的进度
onUploadProgress: progressEvent => { }
onDownloadProgress: progressEvent => { }

3.12 validateStatus: status => status >= 200 && status < 300
定义服务器返回的状态码是多少，返回的promise实例是成功

4.axios请求的取消，依赖于 axios.CancelToken 完成
const source = axios.CancelToken.source();

axios.post([url], [data], {
  // ...
  cancelToken: source.token
}).catch(reason => {
  // 取消后promise实例是失败的
  // {message:'我把请求取消了'} 指向 Cancel.prototype
  console.log(reason);
});
source.cancel('我把请求取消了'); 取消发送

5.axios中的拦截器

5.1 请求拦截器
当axios把各方面配置都处理好了，在即将基于这些配置向服务器发送请求的时候，触发请求拦截器
axios.interceptors.request.use(config => {
  // config存储的是axios处理好的配置，我们一般在请求拦截器中修改配置
  // ...
  return config
})

5.2 响应拦截器: 服务器返回结果，axios已经知道返回的promise实例状态是成功还是失败的，在自己调用 .then/catch 之前先根据promise状态，把响应拦截器中设置的方法执行
axios.interceptors.response.use(
  response => { 
    // promise实例是成功的执行这个方法：response存储服务器返回的结果
  },
  reason => { 
    // promise实例是成功的执行这个方法：reason存储失败的原因
);

// then/catch之前先执行响应拦截器
axios.get([url], [config])
  .then(value=> {})
  .catch(reason=> {});