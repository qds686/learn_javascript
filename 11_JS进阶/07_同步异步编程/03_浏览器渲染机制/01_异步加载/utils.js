// 这样写不好
// function test(){
//   console.log('test');
// }
// function test1(){
//   console.log('test1');
// }

// 统一管理
let utils = {
  test: function test(){
    console.log('test');
  },
  test1: function test1(){
    console.log('test1');
  }
}