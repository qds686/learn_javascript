var thumbsItem = document.getElementsByClassName('thumbs-item'),
  sliderItem = document.getElementsByClassName('slider-item');

// 所有代码执行完成，呈现页面，此时我们才可以鼠标点击li，所以鼠标点击li，触发对应方法执行的时候，全局的i是7

// 1.自定义属性：把当前LI的索引存储到LI这个元素对象的自定义属性上
// for (var i = 0; i < thumbsItem.length; i++) {
//   thumbsItem[i].myIndex = i;
//   thumbsItem[i].onclick = function () {
//     for (var j = 0; j < thumbsItem.length; j++) {
//       thumbsItem[j].className = 'thumbs-item';
//       sliderItem[j].className = 'slider-item';
//     }
//     thumbsItem[this.myIndex].className += ' cur';
//     sliderItem[this.myIndex].className += ' active';
//   }
// }

// 2.闭包 & let
// for (var i = 0; i < thumbsItem.length; i++) {
//   (function (j) {
//     thumbsItem[j].onclick = function () {
//       for (var k = 0; k < thumbsItem.length; k++) {
//         thumbsItem[k].className = 'thumbs-item';
//         sliderItem[k].className = 'slider-item';
//       }
//       thumbsItem[j].className += ' cur';
//       sliderItem[j].className += ' active';
//     };
//   })(i);
// }

// 3.选中的样式有且只有一个，所以每一次只需要把上一次选中的清除即可，没必要清楚所有
var preIndex = 0;
for (var i = 0; i < thumbsItem.length; i++) {
  var item = thumbsItem[i];
  item.myIndex = i;
  item.onclick = function () {
    var curIndex = this.myIndex;

    // 如果当前操作的和上一次选中的一样，就不用处理
    if (curIndex === preIndex) return;

    // 清除上一个
    thumbsItem[preIndex].classList.remove('cur');
    sliderItem[preIndex].classList.remove('active');

    // 选中当前这个
    thumbsItem[curIndex].classList.add('cur');
    sliderItem[curIndex].classList.add('active');

    // 把当前选中这一项索引作为下一次比较时候用到的上一次索引
    preIndex = curIndex;
  }
}


/* 插件封装 */
// ; (function () {
//   var Slider = function (opt) {
//     this.sliderItem = document.getElementsByClassName(opt.sliderItem);
//     this.thumbItem = document.getElementsByClassName(opt.thumbItem);

//     this.bindClick();
//   };

//   Slider.prototype = {
//     bindClick: function () {
//       var slider = this.sliderItem,
//         thumbs = this.thumbItem;
//       for (var i = 0; i < thumbs.length; i++) {
//         (function (j) {
//           thumbs[j].onclick = function () {
//             for (var k = 0; k < thumbs.length; k++) {
//               thumbs[k].className = 'thumbs-item';
//               slider[k].className = 'slider-item';
//             }
//             this.className += ' cur';
//             slider[j].className += ' active';
//           }
//         })(i);
//       }
//     }
//   };

//   window.Slider = Slider;
// })();