const obj = {
  data: [
    ['xiaoming', 'male', '18', 'beijing', '2025-02-01'],
    ['xiaofang', 'femal', '18', 'shanghai', '2025-02-02']
  ],
  columns: [
    { name: 'name', note: '' },
    { name: 'gender', note: '' },
    { name: 'age', note: '' },
    { name: 'address', note: '' },
    { name: 'registerTime', note: '' }
  ]
};

/* const combine = function combine(obj){
  let {data, columns } = obj,
    columnsKeys = {};

  // 先把columns 变为 {name: 0, gender: 1, age: 2, address: 3, registerTime: 4} 这种格式
  columns.forEach((item, index) => {
    let key = item.name;
    columnsKeys[key] = index;
  });
  // 外层迭代数据data
  return data.map(item => {
    // item：['xiaoming', 'male', '18', 'beijing', '2025-02-01']
    let obj = {};
    _.each(columnsKeys, (index, key)=> {
      obj[key] = item[index];
    });
    return obj;
  });
}; */
/* 
[
  { name: 'xiaoming', gender: 'male', age: '18', address: 'beijing', registerTime: '2025-02-01' },
  { name: 'xiaofang', gender: 'femal', age: '18', address: 'shanghai', registerTime: '2025-02-02' }
]
*/
// console.log(combine(obj));

const combine = function combine(obj){
  let {data, columns } = obj;
  // 把columns按照每列的字段名扁平化，变为数组格式
  columns = columns.map(item => item.name );
  return data.map(item => {
    let obj = {};
    columns.forEach((key, index)=> {
      obj[key] = item[index];
    });
    return obj;
  });
};
console.log(combine(obj));