var users = [
  { "id": "1", "name": "小明", "sex": "1" },
  { "id": "2", "name": "小黄", "sex": "1" },
  { "id": "3", "name": "小红", "sex": "2" },
  { "id": "4", "name": "小绿", "sex": "2" }
];

var sex = [
  { "id": "1", "sex": "男" },
  { "id": "2", "sex": "女" }
];

// 按照谁来分类就先遍历谁
// var cache = {};
// sex.forEach(function(sex){
//   // 按照哪个字段进行归类就先保存这个字段
//   var _id = sex.id;

//   cache[_id] = [];

//   users.forEach(function (user){
//     var _sex = user.sex;

//     if(_sex === _id){
//       cache[_id].push(sex);
//     }
//   });
// });

/* 
单一归类：
{
  0: [{id: '1', sex: '男'}, {id: '1', sex: '男'}],
  1: [{id: '2', sex: '女'}, {id: '2', sex: '女'}]
}
*/
// console.log(cache);

// 复合归类：一条数据对应多个类
var hobby = [
  { "id": "1", "name": "足球" },
  { "id": "2", "name": "篮球" },
  { "id": "3", "name": "排球" },
  { "id": "4", "name": "乒乓球" },
  { "id": "5", "name": "保龄球" },
  { "id": "6", "name": "高尔夫球" }
];

var person = [
  { "name": "小明", "hobby": "1,3" },
  { "name": "小花", "hobby": "1,4" },
  { "name": "小明", "hobby": "2,5" },
  { "name": "小明", "hobby": "5,6" },
  { "name": "小明", "hobby": "3,5" },
  { "name": "小明", "hobby": "1,2,6" },
  { "name": "小明", "hobby": "3,5" },
  { "name": "小明", "hobby": "2,4,5,6" }
];

// var cache = {};

// hobby.forEach(function(hobby){
//   var _id = hobby.id;
//   cache[_id] = [];

//   person.forEach(function(person){
//     var _hobbyArr = person.hobby.split(',');

//     _hobbyArr.forEach(function(elem){
//       if(elem === _id){
//         cache[_id].push(person);
//       }
//     });
//   });
// });
// console.log(cache); // {1: Array(3), 2: Array(3), 3: Array(3), 4: Array(2), 5: Array(5), 6: Array(3)}

/**
 * 归类函数
 * @param {*} sort 以什么来归类
 * @param {*} data 数据
 * @returns 
 */
function sortDatas(sort, data) {
  var cache = {};

  /**
   * foreign_key: 关联键名
   * sortType: 单一归类、复合归类
   */
  return function (foreign_key, sortType) {
    if (sortType !== 'single' && sortType !== 'multi') {
      return new TypeError('Invalid sort type.["aingle" and "multi" are valid values]');
    }

    sort.forEach(function (sort) {
      var _id = sort.id;
      cache[_id] = [];

      data.forEach(function (elem) {
        var foreign_val = elem[foreign_key];
        switch (sortType) {
          case 'single':
            if (foreign_val === _id) {
              cache[_id].push(elem);
            }
            break;
          case 'multi':
            var _arr = foreign_val.split(',');
            _arr.forEach(function (val) {
              if (val === _id) {
                cache[_id].push(elem);
              }
            });
            break;
          default:
            break;
        }
      })
    });
    return cache;
  }
}

// 偏函数
var singleSort = sortDatas(sex, users);
console.log(singleSort('sex', 'single'));

var multiSort = sortDatas(hobby, person);
console.log(multiSort('hobby', 'multi'));