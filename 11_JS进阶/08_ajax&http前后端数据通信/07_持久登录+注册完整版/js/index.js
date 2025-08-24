; (function (doc, loginAction, registerAction) {

  var oOpenBtn = doc.getElementsByClassName('js_openBtn')[0],
    oCloseBtn = doc.getElementsByClassName('js_closeBtn')[0],
    oLoginBtn = doc.getElementsByClassName('js-loginBtn')[0],
    oLoginHeader = doc.getElementsByClassName('js_loginHeader')[0],
    oOpenRegBtn = doc.getElementsByClassName('js_openRegBtn')[0],
    oCloseRegBtn = doc.getElementsByClassName('js_closeBtn')[1],
    oRegBtn = doc.getElementsByClassName('js_regBtn')[0],
    oSendCodeBtn = doc.getElementsByClassName('js_sendCodeBtn')[0],
    oCodeImg = doc.getElementsByClassName('js_codeImg')[0];

  var init = function () {
    loginAction.checkAuth.call(loginAction);
    bindEvent();
  }

  function bindEvent() {
    // 不能直接给后期要更新的DOM节点上绑定方法，会失效
    // 给父级绑定方法事件代理，无论什么时候都生效
    oLoginHeader.addEventListener('click', function (e) {
      var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className;

      if (className === 'login-btn login js_openBtn') {
        // 点击打开登录框
        loginAction.openLoginBoard(true);
      }

      if (className === 'reg-btn login js_openRegBtn') {
        // 点击打开注册框
        registerAction.openRegisterBoard(true);
      }
    }, false);
    // 点击关闭登录框
    oCloseBtn.addEventListener('click', loginAction.openLoginBoard.bind(null, false), false);
    // 点击关闭注册框
    oCloseRegBtn.addEventListener('click', registerAction.openRegisterBoard.bind(null, false), false);
    // 点击登录
    oLoginBtn.addEventListener('click', loginAction.login.bind(loginAction), false);
    // 点击注册
    oRegBtn.addEventListener('click', registerAction.register.bind(registerAction), false);
    // 点击发送验证码
    oSendCodeBtn.addEventListener('click', registerAction.sendTelCode.bind(registerAction, oSendCodeBtn), false);
    // 点击图片验证码随机生成
    oCodeImg.addEventListener('click', registerAction.refreshCode.bind(null, oCodeImg), false);
  }

  init();
})(document, loginAction, registerAction);

/* 
主要功能：
1.进入页面，先查看是否存在cookie
  + 存在：去后端校验auth，符合则刷新页面进入已登录状态
  + 不存在，进入未登录状态
2.未登录状态进入登录状态
  + 前端验证信息，请求数据，根据返回的errorCode进行 提示报错
  + 登录成功则重新渲染页面的Header
3.进入已登录状态
  + 欢迎您，xxx，退出按钮
  + 退出操作在后端执行，删除cookie，跳转到未登录状态
*/