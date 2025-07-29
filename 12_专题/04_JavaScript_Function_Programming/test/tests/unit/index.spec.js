// 测试基本函数功能
describe("基础函数测试", () => {
  it("add函数应该正确执行加法运算", () => {
    // 断言库
    expect(window.add(1)).toBe(1);
    expect(window.add(2)).toBe(3);
  });
});