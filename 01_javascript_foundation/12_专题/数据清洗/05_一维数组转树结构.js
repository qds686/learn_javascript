let data = [
  { id: 0, parentId: null, text: '北京市' },
  { id: 1, parentId: 0, text: '昌平区' },
  { id: 2, parentId: 0, text: '海淀区' },
  { id: 3, parentId: null, text: '河北省' },
  { id: 4, parentId: null, text: '陕西省' },
  { id: 5, parentId: 3, text: '承德市' },
  { id: 6, parentId: 3, text: '石家庄市' }
];

/* 方案一； */
/* const listToTree = function listToTree(data) {
  // 先找出第一级的列表
  let arr = data.filter(item => item.parentId === null);

  // 迭代第一级的数据，筛选出其子集数据
  arr.forEach(item => {
    let children = data.filter(cur => cur.parentId === item.id);
    if (children.length > 0) item.children = children;
  });
  return arr;
}; */
/* 
[
  {
    id: 0, 
    parentId: null, 
    text: '北京市', 
    children: {
      {id: 1, parentId: 0, text: '昌平区'},
      {id: 2, parentId: 0, text: '海淀区'}
    }
  },
  {
    id: 3, 
    parentId: null, 
    text: '河北省', 
    children: {
      {id: 5, parentId: 3, text: '承德市'},
      {id: 6, parentId: 3, text: '石家庄市'}
  },
  {
    id: 4, 
    parentId: null, 
    text: '陕西省'
  }
]
*/
// console.log(listToTree(data));

/* 方案二：利用Map数据结构处理 */
const listToTree = function listToTree(data) {
  // 把data变为Map数据结构
  let map = new Map(),
    result = [];
  data.forEach(item => {
    map.set(item.id, item);
  });

  // 迭代数组中的每一项，根据parentID做不同的处理
  data.forEach(item => {
    let { parentId } = item,
      parent;

    // parentId是null的，说明其就是第一级，我们把其加入到result中即可
    if (parentId === null) {
      result.push(item);
      return;
    }
    parent = map.get(parentId);
    parent.children ? parent.children.push(item) : parent.children = [item];
  });
  return result;
};
console.log(listToTree(data));
















