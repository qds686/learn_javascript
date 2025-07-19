(function () {
  let container = document.querySelector('.b3-container'),
    wrapper = container.querySelector('.b3-wrapper'),
    slides = [],
    navPrev = container.querySelector('.b3-navigation.prev'),
    navNext = container.querySelector('.b3-navigation.next'),
    data = JSON.parse(document.querySelector('.data').innerHTML),
    step = 0,
    autoTimer = null,
    interval = 2000,
    // 一共有多少个slide
    count = 0;

  const init = function init() {
    render(data, true);
    autoMove();
  };

  // 数据绑定
  const render = function render(data, isInitial = true) {
    // 如果数据不足5个，我们需要补齐为5个
    if (!data || !Array.isArray(data) || data.length === 0) return;

    while (data.length < 5) {
      let diff = 5 - data.length,
        clone = data.slice(0, 2);
      data = data.concat(clone);
    }
    count = data.length;

    // 保证最前面展示的五项的索引是正确的
    let temp1 = step - 2,
      temp2 = step - 1,
      temp3 = step,
      temp4 = step + 1,
      temp5 = step + 2;

    // 小于0则从后往前数
    if (temp1 < 0) temp1 = count + temp1;
    if (temp2 < 0) temp2 = count + temp2;
    // 超过最大索引，从前往后数
    if (temp4 > count - 1) temp4 = temp4 - count;
    if (temp5 > count - 1) temp5 = temp5 - count;

    // 计算每一个slide的样式
    data.map((item, index) => {
      let zIndex = 0,
        className = 'b3-slide',
        sty = 'z-index:0;transform:translate(-50%, 0) scale(0.55);';

      switch (index) {
        case temp3:
          className = 'b3-slide active';
          sty = 'z-index:3;transform:translate(0, 0) scale(1);';
          break;
        case temp1:
          className = 'b3-slide';
          sty = 'z-index:1;transform:translate(-150%, 0) scale(0.7);';
          break;
        case temp2:
          className = 'b3-slide';
          sty = 'z-index:2;transform:translate(-80%, 0) scale(0.85);';
          break;
        case temp4:
          className = 'b3-slide';
          sty = 'z-index:2;transform:translate(80%, 0) scale(0.85);';
          break;
        case temp5:
          className = 'b3-slide';
          sty = 'z-index:1;transform:translate(150%, 0) scale(0.7);';
          break;
      }

      item.className = className;
      item.sty = sty;
      return item;
    });

    // 如果不是第一次执行，目的是修改现有slide的样式，而不是创建slide样式
    if (!isInitial) {
      data.forEach((item, index) => {
        let { className, sty } = item;
        slides[index].className = className;
        slides[index].cssText = sty;
      });
      return;
    }
    // 动态创建slide
    let str = ``;
    data.forEach((item, index) => {
      let { className, sty, pic, descript: { name, identity, dream } } = item;
      str += `<div class="${className}" style="${sty}" index="${index}">
        <img src="${pic}" alt="" />
        <div class="b3-mark"></div>
        <div class="b3-desc">
          <p>${name}</p>
          <p>身份：${identity}</p>
          <p>梦想：${dream}</p>
        </div>
      </div>`;
    });
    wrapper.innerHTML = str;
    slides = Array.from(wrapper.querySelectorAll('.b3-slide'));
    navNext.style.display = navPrev.style.display = 'block';
  };

  // 自动轮播
  const autoMove = function autoMove() {
    step++;
    if (step > count - 1) step = 0;
    render(data);
  };

  // 开启自动轮播
  autoTimer = setInterval(autoMove, interval);

  // 鼠标进入和离开容器控制自动轮播
  container.addEventListener('mouseenter', () => {
    clearInterval(autoTimer);
    autoTimer = null;
  });
  container.addEventListener('mouseleave', () => {
    if (autoTimer) return; // 防止重复开启定时器
    autoTimer = setInterval(autoMove, interval);
  });

  // 校验是否为slide下的元素 返回slide or false
  const checkSlide = function checkSlide(target) {
    if (target.className.includes('b3-slide')) return target;
    let p = target.parentNode;
    while (p !== wrapper) {
      if (p.className.includes('b3-slide')) return p;
      p = p.parentNode;
    }
    // 全部找了没有，说明不是
    return false;
  }

  // 基于事件委托实现点击切换
  container.addEventListener('click', (ev) => {
    let target = ev.target,
      targetClass = target.className;

    // 左右按钮
    if (targetClass.includes('b3-navigation')) {
      if (targetClass.includes('prev')) {
        // 左按钮
        step--;
        if (step < 0) step = count - 1;
        render(data);
        return;
      }
      // 右按钮
      autoMove();
      return;
    }

    // 点击的slide
    let slide = checkSlide(target);
    if (slide) {
      let index = +slide.getAttribute('index') || 0;
      if (step === index) return;
      step = index;
      render(data);
    }
  });

  init();
})();