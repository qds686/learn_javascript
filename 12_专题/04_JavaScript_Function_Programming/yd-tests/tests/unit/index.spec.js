//断言库
describe('测试基本函数API', function () {
  it('+1测试应用', function () {
    expect(window.add(1)).toBe(1);
    expect(window.add(2)).toBe(3);
  });
});
