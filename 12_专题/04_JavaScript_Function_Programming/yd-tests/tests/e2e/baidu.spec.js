const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://www.baidu.com/');
    await driver.findElement(By.name('wd')).sendKeys('京程一灯', Key.RETURN);
    await driver.wait(until.titleIs('京程一灯_百度搜索'), 1000);
  } finally {
    await driver.quit();
  }
})();
