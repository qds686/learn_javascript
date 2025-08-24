/* 
第三方平台发送测试短信：云通讯 https://console.yuntongxun.com/member/main
  + 应用管理 - 创建应用 - 不上线
  + 添加测试号码

*/
var registerAction = (function (doc) {

  var oRegBox = doc.getElementsByClassName('reg-box')[0],
    oLoginHeader = doc.getElementsByClassName('js_loginHeader')[0],
    oErrorTip = doc.getElementsByClassName('js_errorTip')[1],

    // 刚开支只获取input节点
    oRNumber = doc.getElementById('js_rnumber'),
    oRPassword = doc.getElementById('js_rpassword'),
    oRTelcode = doc.getElementById('js_rtelcode'),
    oRPasscode = doc.getElementById('js_rpasscode'),

    submitURL = doc.getElementById('js_regForm').action,
    sendTelCodeURL = doc.getElementsByClassName('js_sendCodeBtn')[0].value,

    telCodeBtnDisabled = false;

  var t = null,
    s = 60,
    os = 60;

  return {
    // 打开注册面板
    openRegisterBoard: function (show) {
      if (show) {
        oRegBox.className += ' show';
        oLoginHeader.className += ' hide';
      } else {
        oRegBox.className = 'mod-box reg-box';
        oLoginHeader.className = 'header js_loginHeader';
      }
    },

    // 数据提交前，前端先验证数据
    register: function (e) {
      var e = e || window.event;
      e.preventDefault();

      var pNumber = trimspace(oRNumber.value),
        password = trimspace(oRPassword.value),
        telcode = trimspace(oRTelcode.value),
        passcode = trimspace(oRPasscode.value),
        reg1 = /^(\(\+86\))?(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/,
        reg2 = /^[a-zA-Z]{4}$/;

      if (pNumber.length !== 11) {
        oErrorTip.innerText = '手机号长度：11位';
        return;
      }

      if (!reg1.test(pNumber)) {
        oErrorTip.innerText = '手机号格式不正确';
        return;
      }

      if (password.length < 6 || password.length > 20) {
        oErrorTip.innerText = '密码长度：6-20位';
        return;
      }

      if (telcode.length !== 6) {
        oErrorTip.innerText = '手机验证码长度：6位';
        return;
      }

      if (typeof Number(telcode) !== 'number') {
        oErrorTip.innerText = '手机验证码必须是数字';
        return;
      }

      if (passcode.length !== 4) {
        oErrorTip.innerText = '图片验证码长度：4位';
        return;
      }

      if (!reg2.test(passcode)) {
        oErrorTip.innerText = '图片验证码必须是字母';
        return;
      }

      oErrorTip.innerText = '';

      this.submitForm({
        pNumber: pNumber,
        password: password,
        telcode: telcode,
        passcode: passcode
      }, this);
    },

    countDown: function (obj) {
      // 计时器走完了重新赋值，初始化数据
      if (s <= 0) {
        clearInterval(t);
        t = null;
        s = os;
        obj.className = 'input-btn js_sendCodeBtn';
        obj.disabled = false;
        obj.innerText = '获取验证码';
        telCodeBtnDisabled = false;
      } else {
        // 正在走
        s--;
        obj.className += ' disabled';
        obj.disabled = true;
        obj.innerText = '已发送' + s + '秒';
        telCodeBtnDisabled = true;
      }
    },

    // 点击发送验证码
    sendTelCode: function (btn) {
      var e = e || window.event,
        _self = this;
      e.preventDefault();

      var pNumber = trimspace(oRNumber.value),
        errorInfo = '',
        reg = /^(\(\+86\))?(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;

      if (pNumber.length !== 11) {
        oErrorTip.innerText = '手机号长度：11位';
        return;
      }

      if (!reg.test(pNumber)) {
        oErrorTip.innerText = '手机号格式不正确';
        return;
      }

      oErrorTip.innerText = '';

      // 可用的状态才进行请求
      if (!telCodeBtnDisabled) {
        btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

        $.ajax({
          url: sendTelCodeURL,
          type: 'POST',
          dataType: 'JSON',
          data: {
            pNumber: pNumber
          },
          success: function (data) {
            var code = data.error_code,
              errorInfo = '';

            switch (code) {
              case '1008':
                errorInfo = '手机号格式不正确';
                break;
              case '1012':
                errorInfo = '手机号已被使用';
                btn.innerText = '获取验证码';
                break;
              case '1013':
                errorInfo = '验证码发送失败';
                btn.innerText = '获取验证码';
                break;
              case '200':
                t = setInterval(_self.countDown.bind(null, btn), 1000);
                errorInfo = '验证码发送成功';
                break;
              default:
                errorInfo = '验证码发送失败';
                btn.innerText = '获取验证码';
                break;
            }

            oErrorTip.innerText = errorInfo;
          }
        });
      }
    },

    // 点击图片随机生成验证码
    refreshCode: function (obj) {
      // obj 是 img元素
      var imgUrl = obj.src;

      obj.src = imgUrl.indexOf('?') > 0 ?
        imgUrl.replace(/\?.*$/, '') + '?rand=' + Math.random() :
        imgUrl + '?rand=' + Math.random();
    },

    // 提交数据验证
    submitForm: function (data, obj) {
      $.ajax({
        url: submitURL,
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function (data) {
          $.ajax({
            url: submitURL,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: function (data) {
              var code = data.error_code,
                errorInfo = '';

              switch (code) {
                case '1008':
                  errorInfo = '手机号格式不正确';
                  break;
                case '1002':
                  errorInfo = '密码长度：6-20位';
                  break;
                case '1009':
                  errorInfo = '图片验证码不正确';
                  break;
                case '1010':
                  errorInfo = '与接收验证码的手机号不一致';
                  break;
                case '1011':
                  errorInfo = '短信验证码不正确';
                  break;
                case '1014':
                  errorInfo = '注册失败，请重试';
                default:
                  break;
              }
              oErrorTip.innerText = errorInfo;
              obj.refreshCode(oCodeImg);

              if (code == '200') {
                oErrorTip.innerText = '注册成功';
                setTimeout(function () {
                  location.reload();
                }, 300);
              }
            }
          });
        },
        error: function () {

        }
      });
    }
  }
})(document);