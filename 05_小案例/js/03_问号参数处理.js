// queryURLParams
// 需求：https://www.baidu.com?name=hezi&age=10&id=14，从这个地址中提取问号参数后面的信息，并把它们以键值对的形式放在一个对象中

function queryURLParams(str) {

  var obj = {},
    paramsStr = str.split("?")[1]; // 'name=hezi&age=10&id=14'
  if (paramsStr) {
    var paramsItem = paramsStr.split("&"),
      item,
      key,
      val;
    for (var i = 0; i < paramsItem.length; i++) {
      item = paramsItem[i]; // name=hezi
      key = item.split("=")[0],
        val = item.split("=")[1];
      obj[key] = val;
    }
  }
  return obj;
}
var str = 'https://www.baidu.com?name=hezi&age=10&id=14';
var res = queryURLParams(str);
// console.log(res); // {name: 'hezi', age: '10', id: '14'}
