// 中断请求
const controller = new AbortController();

fetch('https://httpbin.org/get', {
  // 加个信号
  signal: controller.signal
})
  .then(response => {
    /* 
    只有服务器有响应，不论http状态码是多少，Fetch都会把promise实例设置为成功
    response是Response内置类的实例
      + status/statusText 状态码机器描述
      + headers 是Headers内置类的实例，基于Headers.prototype上的方法可以获取响应头的信息
        + get([key])
        + has([key])
        + keys/values/entries 返回迭代器对象，基于next方法执行可以一次获取响应头的信息
        + forEach 循环迭代每一个返回的响应头信息
      + body 存储的是响应主体信息，它是一个ReadableStream可读流
      + bodyUsed -> true/false
      + ok -> true/false
      + redirected -> true/false
      + type
      + url: "https://httpbin.org/get"
    */
    // console.log(response.headers);

    /*
     Response.prototype
       + arrayBuffer 以Buffer格式数据读取
       + blob
       + json
       + text
       + ...
       @1 执行这几个方法，返回的结果是一个promise实例
        因为服务器返回的数据内容格式和我们要读取的方法可能存在误差
        例如：服务器返回的是普通文本，而我们基于JSON方法区读取，想要获取JSON对象，这样是无法读取出来的，此时可以把promise标记为失败...而且这样读取的过程也可以是异步操作的
       @2 一旦本次执行了某个方法，则无法再执行其他的方法
 
     */
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
    // 从服务器获取的结果
    console.log('成功:', value);
  })
  .catch(reason => {
    /* 
      @1 如果从服务器成功获取内容，状态码是以2/3开始，但是读取数据失败
        + 例如：地址写错，服务器返回404，没有任何数据
        + reason是Error对象，具备message属性记录失败的原因
      @2 如果从服务器成功获取内容，但是状态码不符合要求
        + 状态码正确才返回成功
        + 例如：地址写错，服务器返回404，不正确走则返回失败的promise实例
        + reason是自定义的信息对象
      @3 服务器没有响应：断开请求 & 网络出现故障，Fetch会把promise实例设置为失败
        + 基于AbortController中断请求
          + reason是DOMException对象{code:20,name:"AbortError",message:"signal is aborted without reason"}
        + 剩下的都认为是网络出现故障
    */
    console.dir(reason);
  });
// 中断请求
controller.abort();