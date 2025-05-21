window.onload = function () {
  init();
}

function init() {
  computed();
}

let computed = (function () {
  // 首先：想操作谁，就先获取谁
  let oBox = document.getElementsByClassName('box')[0],
    oList = document.getElementsByClassName('list')[0],
    oMinus = document.getElementsByClassName('minus'),
    // + 、-
    oPlus = document.getElementsByClassName('plus'),
    // 购买数量
    oPronum = oList.getElementsByClassName('pronum'),
    oInfo = document.getElementsByClassName('info'),
    oSubPrice = document.getElementsByTagName('strong'),
    // 单价
    oUnitPrice = [],
    // 小计
    oSubTotal = [],

    oBottom = oBox.getElementsByClassName('bottom')[0],
    oBottomPronum = oBottom.getElementsByClassName('pronum'),
    [countTotalBox, priceTotalBox, priceMaxBox] = Array.from(oBottomPronum);

  for (let i = 0; i < oMinus.length; i++) {
    let mItem = oMinus[i];
    let pItem = oPlus[i];
    // 点击按钮，获取数量，计算小计，同时bottomBox总计信息同步数据
    mItem.addEventListener('click', minusNum.bind(mItem, i), false);
    pItem.addEventListener('click', plusNum.bind(pItem, i), false);
  }

  for (let i = 0; i < oSubPrice.length; i++) {
    // 获取单价和小计的数字
    let infoItem = oSubPrice[i];
    // 根据奇偶分别放到对应的数组中
    i % 2 === 0 ? oUnitPrice.push(infoItem) : oSubTotal.push(infoItem);
  }

  // 点击减号
  function minusNum(idx) {
    if (oPronum[idx].innerHTML <= 0) return 0;
    oPronum[idx].innerHTML--;
    computedTotal(idx);
  }

  // 点击加号
  function plusNum(idx) {
    oPronum[idx].innerHTML++;
    computedTotal(idx);
  }

  // 计算小计 和 合计
  function computedTotal(idx) {
    // 小计
    let price = parseFloat(oUnitPrice[idx].innerHTML),
      count = +oPronum[idx].innerHTML;
    oSubTotal[idx].innerHTML = `${price * count}元`;

    // 共计多少件
    let totalCount = 0;
    Array.from(oPronum).forEach((item, index) => {
      count = +item.innerHTML
      totalCount += count;
    });
    countTotalBox.innerHTML = totalCount;

    // 共计多少元
    let totalPrice = 0;
    oSubTotal.forEach((item, index) => {
      let price = parseFloat(item.innerHTML);
      totalPrice += price;
    });
    priceTotalBox.innerHTML = totalPrice;

    // 购买商品中最贵的
    // 在有购买数量的单价中取最大值
    // 通过购买过的数量不为0找到符合的index，然后通过对应的index找单价，找到后放到数组中，最后用Math.max即可
    let maxPriceArr = [];
    Array.from(oPronum).forEach((item, index) => {
      if (+item.innerHTML > 0) {
        maxPriceArr.push(parseFloat(oUnitPrice[index].innerHTML));
      }
    });
    priceMaxBox.innerHTML = Math.max(...maxPriceArr);
  }
});
