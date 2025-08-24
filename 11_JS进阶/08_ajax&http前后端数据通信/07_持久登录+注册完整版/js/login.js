var loginAction = (function (doc) {
  var oLoginMod = doc.getElementsByClassName('login-box')[0],
    oLoginHeader = doc.getElementsByClassName('js_loginHeader')[0],
    oErrorTip = doc.getElementsByClassName('js_errorTip')[0],
    oLoginStatus = doc.getElementsByClassName('js_loginStatus')[0]

  submitURL = doc.getElementById('js_loginForm').action,
    oUsername = doc.getElementById('js_username'),
    oPassword = doc.getElementById('js_password'),
    oPersistedLogin = doc.getElementById('js_persistedLogin'),

    loginTpl = doc.getElementById('js_loginTpl').innerHTML,
    userTpl = doc.getElementById('js_userTpl').innerHTML;

  return {
    // 未登录进入登录状态
    openLoginBoard: function (show) {
      if (show) {
        oLoginMod.className += ' show';
        oLoginHeader.className += ' hide';
      } else {
        oLoginMod.className = 'mod-box login-box';
        oLoginHeader.className = 'header js_loginHeader';
      }
    },

    // 前端检查数据的合法性
    login: function () {
      var e = e || window.event;
      e.preventDefault();

      var username = trimspace(oUsername.value),
        password = trimspace(oPassword.value);


      if (username.length < 6 || username.length > 20) {
        oErrorTip.innerHTML = '用户名长度6-20位';
        return;
      }

      if (password.length < 6 || password.length > 20) {
        oErrorTip.innerHTML = '密码长度6-20位';
        return;
      }

      oErrorTip.innerHTML = '';
      this.submitForm(username, password, oPersistedLogin.checked);
    },

    // 提交到后端进行校验，校验成功才会存储到数据库中
    submitForm: function (username, password, isPersistedLogin) {
      $.ajax({
        url: submitURL,
        type: 'POST',
        dataType: 'JSON',
        data: {
          username: username,
          password: password,
          isPersistedLogin: isPersistedLogin
        },
        success: function (data) {
          console.log(data);
          var code = data.error_code,
            errorInfo = '';

          switch (code) {
            case '1001':
              // 后端校验
              errorInfo = '用户名长度不正确';
              break;
            case '1002':
              // 后端校验
              errorInfo = '密码长度不正确';
              break;
            case '1003':
              // 在表中查找
              errorInfo = '此用户名不存在';
              break;
            case '1004':
              // 在表中查找
              errorInfo = '密码不正确';
              break;
            case '1005':
              // 网络问题
              errorInfo = '登录失败，请重试';
              break;
            case '200':
              // 生成ident_code、token、timeout，存储到数据库中
              location.reload();
              break;
            default:
              break;
          }

          oErrorTip.innerHTML = errorInfo;
        }
      });
    },

    // 每次刷新页面检查auth权限: 
    // 1.分隔ident_code和token，传到模型层查看这两个数据是否在同一行
    //   + 找不到匹配的则token值有问题
    //   + 浏览器删除token和nickname，再刷新页面，会从已登录态变为未登录状态
    // 2.验证timeout
    // 3.验证成功则登录成功
    // 退出：删除cookie和token，重定向到登录页面
    checkAuth: function () {
      var _self = this;

      manageCookies.get('auth', function (cookie) {
        if (!cookie || cookie !== 'undefined') {
          $.ajax({
            url: 'http://localhost:8058/api_for_study/index.php/Home/User/checkAuth',
            type: 'POST',
            dataType: 'JSON',
            data: {
              auth: cookie,
            },
            success: function (data) {
              var code = data.error_code,
                errorInfo = '';

              switch (code) {
                case '1006':
                  errorInfo = '登录验证不通过，请重试';
                  _self.openLoginBoard(false);
                  _self.render(false);
                  break;
                case '1007':
                  errorInfo = '登录已过期，请重试';
                  _self.openLoginBoard(false);
                  _self.render(false);
                  break;
                case '200':
                  // 登录成功，更改DOM结构
                  _self.render(true);
                  break;
                default:
                  break;
              }
            }
          });
        }
      });
    },

    // 登录成功重新加载渲染页面
    render: function (isLogin) {
      if (isLogin) {
        manageCookies.get('nickname', function (cookie) {
          if (cookie || cookie !== 'undefined') {
            oLoginStatus.innerHTML = userTpl.replace(/{{(.*?)}}/g, cookie);
          } else {
            // 如果 nickname 不存在，仍然视为未登录
            oLoginStatus.innerHTML = loginTpl;
          }
        });
      } else {
        oLoginStatus.innerHTML = loginTpl;
      }
    }
  }
})(document);