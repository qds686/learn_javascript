; (function () {
  // 1.获取元素
  let $data = JSON.parse($('.J_data')[0].innerHTML),
    $wrap = $('.wrap'),
    $columns = Array.from($('.column')),
    $tpl = $('#J_imgTpl')[0].innerHTML,
    $loadMore = $('.load-more');

  // 2.初始化
  const init = () => {
    render($data);
    // 500ms 之后执行图片懒加载
    setTimeout(lazyImageFunc, 500);
    // bindEvent();
    loadMoreFunc();
  };

  // 3.管理事件
  const bindEvent = () => {
    // 此处基于监听器监听DOM元素，不需要监听onscroll事件到达底部加载更多
  };

  // 4.数据绑定
  const render = (data) => {
    // 按照宽度240等比缩放图片 AW AH浏览器渲染的宽高，BW BH服务器获取的宽高
    data = data.map(item => {
      let { width, height } = item;

      item.width = 240;
      item.height = 240 / (width / height);
      return item;
    });

    let len = data.length,
      list = '',
      group;

    // 每5个数据位一组进行遍历
    for (let i = 0; i < len; i += 5) {
      // group:当前循环获取到的5条数据
      group = data.slice(i, i + 5);

      // 5条数据按照图片高度排序 小->大
      group.sort((a, b) => a.height - b.height);

      // 5列按照盒子的高度排序 大->小
      $columns.sort((a, b) => b.offsetHeight - a.offsetHeight);

      // 遍历5条数据，动态进行数据绑定
      group.forEach((item, index) => {
        // 这里每一次加一项
        list = $tpl.replace(/{{(.*?)}}/g, function (node, key) {
          return {
            pic: item.pic,
            title: item.title,
            link: item.link,
            width: item.width,
            height: item.height
          }[key];
        });
        $columns[index].innerHTML += list; // 追加每一项的内容
      });
    }
  };

  // 5.实现图片的延迟加载
  // 基于 IntersectionObserver监听DOM的方案实现延迟加载「处理过的盒子设置isLoad标记」
  const lazyImageFunc = () => {
    let options = {
      threshold: [1]
    };
    let ob = new IntersectionObserver(changes => {
      changes.forEach(item => {
        let { target, isIntersecting } = item;
        if (isIntersecting) {
          // 当前监听的盒子符合延迟加载条件后，我们进行延迟加载即可
          let $target = $(target),
            $img = $target.find('img'),
            dataSrc = $img.attr('data-src');

          $img.attr('src', dataSrc);
          $img.on('load', () => {
            $img.css('opacity', 1);
          });
          $target.attr('isLoad', true);

          // 已经加载过的移除监听
          ob.unobserve(target);
        }
      });
    }, options);

    // 监听DOM元素：所有不具备isLoad标记的lazyImageBox盒子
    let $lazyImageBoxs = $wrap.find('.item-img:not([isLoad])');
    $lazyImageBoxs.each((index, item) => {
      ob.observe(item);
    });
  };

  // 6.实现下拉加载更多数据
  // 基于IntersectionObserver监听loadMore，出现在时候中，说明到达底部，加载更多数据
  const loadMoreFunc = () => {
    let options = {
      threshold: [0]
    };
    let ob = new IntersectionObserver(changes => {
      let item = changes[0];

      if (item.isIntersecting) {
        // 符合条件，加载更多
        render($data);
        lazyImageFunc();
      }
    }, options);

    ob.observe($loadMore[0]);
  };

  init();
})();