// Karma configuration
// Generated on Wed Jul 23 2025 16:35:15 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({
    // 基础路径
    basePath: '',
    // 使用的测试框架
    frameworks: ['jasmine'],
    // 需要加载的文件
    files: [
      './tests/unit/**/*.js', // 源代码文件
      './tests/unit/**/*.spec.js' // 测试文件
    ],
    // 排除的文件
    exclude: [],
    // 预处理器
    preprocessors: {
      'tests/unit/**/*.js': ['coverage']
      // 'tests/unit/**/*.spec.js': ['coverage']  
    },
    // 测试结果报告
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'docs/coverage/'
    },
    // 端口号
    port: 9876,
    // 启用颜色输出
    colors: true,
    // 日志级别
    logLevel: config.LOG_INFO,
    // 自动监听文件变化
    autoWatch: true,
    // 使用的浏览器
    browsers: ['Chrome'],
    // 持续集成模式
    singleRun: false,
    // 并发级别
    concurrency: Infinity
  })
}
