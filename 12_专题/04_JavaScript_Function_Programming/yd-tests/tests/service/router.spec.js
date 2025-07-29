const axios = require('axios');
const superagent = require('superagent');

describe('Node服务自动化测试脚本', function () {
  //   it('获取首页数据', function (done) {});
  it('404测试', function (done) {
    axios
      .get('http://localhost:8080/xx')
      .then(function (response) {
        if (response.xx == '12') {
          done();
        } else {
          done(new Error('数据错误'));
        }
        console.log(response);
      })
      .catch(function (error) {
        done(error);
      });
  });
});
