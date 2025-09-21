let p = Promise.all([]);
p.then(values => {
  console.log(`成功：${values}`); // 成功：数组中没有promise实例
}).catch(reason => {
  console.log(`失败：${reason}`);
});