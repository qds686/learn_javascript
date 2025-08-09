// 分页模块
var initPageBtns = function (pages, curPage) {
  // pages 总页数 curPage当前页
  var btnGroup = '',
    oBtnBox = $get('.J_btnBox')[0];

  render();

  /**
   * target：分页按钮的模板
   * @param (string) type: 当前项不能点击，其他项可点击，省略号不能点击
   * @param (number) num: 点击的当前页码「点击完当前页可以再点击当前页和其他页两种情况」
   * @param (number) curPage: 当前是第几页
   * @retrun DOM节点
  */
  function pageBtnTpl(type, num, curPage) {
    switch (type) {
      case 'btn':
        // 点击的是当前项
        if (curPage == num) {
          return `<span class="page-btn page-btn-cur">${num}</span>`;
        } else {
          // 点击的不是当前按钮
          return `<a href="javascript:;" class="page-btn" data-page="${num}" data-field="btn">${num}</a>`;
        }
        break;
      case 'prev':
        // 在第一项
        if (curPage == 1) {
          return `<span class="dir-btn prev-btn disabled">
            <i class="fa fa-angle-left"></i>
          </span>`;
        } else {
          return `<a href="javascript:;" class="dir-btn prev-btn" data-field="prev">
            <i class="fa fa-angle-left" data-field="prev"></i>
          </a>`;
        }
        break;
      case 'next':
        // 在最后一项
        if (curPage == pages) {
          return `<span class="dir-btn next-btn disabled">
            <i class="fa fa-angle-right"></i>
          </span>`;
        } else {
          return `<a href="javascript:;" class="dir-btn next-btn" data-field="next">
            <i class="fa fa-angle-right" data-field="next"></i>
          </a>`;
        }
        break;
      case 'points':
        return `<span class="points">...</span>`;
        break;
    }
  }

  function makeBtnGroup(start, end) {
    for (var i = start; i <= end; i++) {
      btnGroup += pageBtnTpl('btn', i, curPage);
    }
  }

  function render() {
    btnGroup += pageBtnTpl('prev', pages, curPage);

    if (pages > 7) {
      // 1 [2] 3 ... 19 20
      if (curPage < 3) {
        makeBtnGroup(1, 3, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 1, pages, curPage);
      } else if (curPage >= 3 && curPage < 5) {
        // 1 2 [3] 4 ... 19 20
        // 1 2 3 [4] 5 ... 19 20
        // 点击3显示4，点击4显示5，而不是点击3直接出现4 5
        makeBtnGroup(1, curPage + 1, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 1, pages, curPage);
      } else if (curPage >= 5 && curPage < pages - 3) {
        // 1 2 ... 4 [5] 6 ... 19 20
        // 1 2 ... 15 [16] 17 ... 19 20
        // 点击5的时候会变成这种情况
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 1, curPage + 1, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 1, pages, curPage);
      } else if (curPage >= pages - 3 && curPage <= pages - 1) {
        // 1 2 ... 16 [17] 18 19 20
        // 1 2 ... 18 [19] 20
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        // 这里最后点击是逐渐减少的过程，不是固定的5个Btn
        // 所以不应该是pages - 4，而是curPage - 1
        makeBtnGroup(curPage - 1, pages, curPage);
      } else if (curPage === pages) {
        // 在最后一页的时候 显示3项 不再减少
        // 1 2 ... 18 19 [20]
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(pages - 2, pages, curPage);
      }
    } else {
      makeBtnGroup(1, pages, curPage);
    }

    btnGroup += pageBtnTpl('next', pages, curPage);

    oBtnBox.innerHTML = btnGroup;
  }
};

// 评论模块
var initCommentModule = (function (initPageBtn) {
  var oCommentEditBoard = $get('.J_commentEditBoard')[0],
    oStarTip = $get('.J_starTip')[0],
    oHoverStarItems = $get('.J_hoverStar'),
    oEditTxt = $get('.J_editTxt')[0],
    oTxtCount = $get('.J_txtCount')[0],
    oSubmitBtn = $get('.J_submitBtn')[0],
    oRadioTabItems = $get('.tab-radio'),
    oLoading = $get('.J_loading')[0],
    oCommentList = $get('.J_commentList')[0],
    oStatisticsNum = $get('.J_statisticsNum')[0],
    oBtnBox = $get('.J_btnBox')[0],

    warningTip = $get('#J_warningTip').innerHTML,
    itemTpl = $get('#J_itemTpl').innerHTML,
    addCommentTpl = $get('#J_addCommentTpl').innerHTML;

  var datas = {
    // 星星的数量
    starNum: 5,
    // 计时器
    t: null,
    // 延迟的时间
    delayTime: 300,
    // 选项卡ID
    fieldId: 0,
    // 当前页码
    curPage: 1,
    // 总页数
    pages: 0
  };

  var APIs = {
    submitComment: 'http://localhost:8058/api_for_study/index.php/Home/Comment/submitComment',
    getComments: 'http://localhost:8058/api_for_study/index.php/Home/Comment/getComments'
  };

  return {
    // 打开评论框
    openBoard: function () {
      oCommentEditBoard.style.display = 'block';
    },

    // 关闭评论框
    closeBoard: function () {
      oCommentEditBoard.style.display = 'none';
      this._restoreBoardStatus();
    },

    // 当前项之前加active，之后去掉active
    // 改变tip及记录星星数量
    hoverStar: function (e) {
      var _self = this,
        e = e || window.event,
        tar = e.target || e.srcElement,
        tagName = tar.tagName.toLowerCase();

      // 在星星上
      if (tagName === 'i') {
        var curIdx = [].indexOf.call(oHoverStarItems, tar),
          // 当前这一项
          curStar = oHoverStarItems[curIdx],
          oStarLen = oHoverStarItems.length,
          item;

        // 改变tip的内容
        oStarTip.innerHTML = curStar.getAttribute('data-title');
        // 记录当前要提交的星星数
        datas.starNum = +curStar.getAttribute('data-count');

        // 循环把所有星星的active类去掉，然后判断再依次加active
        for (var i = 0; i < oStarLen; i++) {
          item = oHoverStarItems[i];

          if (i <= curIdx) {
            // item.className = 'fa fa-star J_hoverStar active';
            item.className += ' active';
          } else {
            item.className = 'fa fa-star J_hoverStar';
          }
        }
      }
    },

    // 通过输入的长度控制提交按钮
    editInput: function () {
      var _self = this,
        val = oEditTxt.value,
        valLen = trimSpace(val).length;

      // 记录实时长度
      oTxtCount.innerHTML = valLen;

      // 根据条件调整提交按钮是否可用
      // if (valLen >= 15 && valLen <= 1000) {
      //   oSubmitBtn.className = 'comment-btn submit J_submitBtn';
      //   oSubmitBtn.removeAttribute('disabled');
      // } else {
      //   oSubmitBtn.className = 'comment-btn submit J_submitBtn disabled';
      //   oSubmitBtn.setAttribute('disabled', 'disabled');
      // }
      if (valLen >= 15 && valLen <= 1000) {
        _self.submitBtnChange({
          txtChange: false,
          isDisabled: false
        });
      } else {
        _self.submitBtnChange({
          txtChange: false,
          isDisabled: true
        });
      }
    },

    // 提交数据
    submitComment: function (userId) {
      var _self = this,
        val = oEditTxt.value,
        valLen = trimSpace(val).length;

      if (valLen >= 15 && valLen <= 1000) {
        xhr.ajax({
          url: APIs.submitComment,
          type: 'POST',
          data: {
            userId: userId,
            starNum: datas.starNum,
            comment: val
          },
          success: function (data) {
            // 最多评论2次，第2次为追加评论，第3次会显示报错评论已存在
            var errorCode = data.error_code,
              oFirstCommentItem = oCommentList.getElementsByClassName('comment-item')[0];

            // 提交之后，一般不会立即返回，需要一个延迟
            // 延迟的过程中禁用提交按钮，显示加载的图标
            _self.submitBtnChange({
              txtChange: true,
              isDisabled: true
            });

            datas.t = setTimeout(function () {
              // 延迟结束，恢复提交按钮
              _self.submitBtnChange({
                txtChange: false,
                isDisabled: false
              });
              clearTimeout(datas.t);

              // 数据返回之后
              // 判断是否提交了第3次
              if (errorCode === '10010') {
                alert('您已对该课程做了评价，感谢您！');
                return;
              }

              // 每次提交的评论在提交完不用刷新页面立即插入到第一行
              // 只添加普通评论，限制追加评论
              if (data.res.is_add_comment === 0) {
                if (oFirstCommentItem) {
                  oCommentList.insertBefore(_self._makeItem(data.res), oFirstCommentItem);
                } else {
                  oCommentList.innerHTML = '';
                  oCommentList.appendChild(_self._makeItem(data.res))
                }
              } else if (data.res.is_add_comment === 1) {
                _self._appendAddComment(data.res);
              }

              // 对Tab进行赋值
              _self.setTabStarNum(data.num);

              // 提交完成后初始化数据
              _self._restoreBoardStatus();
              _self.closeBoard();
            }, datas.delayTime);
          },
          error: function () {
            _self._restoreBoardStatus();
            alert('对不起，提交评论失败，请重试');
          }
        });
      }
    },

    // 提交按钮文字的改变
    /* submitBtnTxtChange: function (isChange) {
      if (isChange) {
        oSubmitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        this.submitBtnStatusChange(false);
      } else {
        oSubmitBtn.innerHTML = '提交评论';
        this.submitBtnStatusChange(true);
      }
    }, */

    // 提交按钮状态的改变
    /* submitBtnStatusChange: function (isChange) {
      if (isChange) {
        oSubmitBtn.className = 'comment-btn submit J_submitBtn';
        oSubmitBtn.removeAttribute('disabled');
      } else {
        oSubmitBtn.className = 'comment-btn submit J_submitBtn disabled';
        oSubmitBtn.setAttribute('disabled', 'disabled');
      }
    }, */

    // 提交完成后初始化评论框数据
    _restoreBoardStatus: function () {
      var starLen = oHoverStarItems.length,
        item;

      // 还原星星
      for (var i = 0; i < starLen; i++) {
        item = oHoverStarItems[i];
        item.className += ' active';
      }

      // 还原tip 和 starNum
      oStarTip.innerHTML = oHoverStarItems[4].getAttribute('data-title');
      datas.starNum = oHoverStarItems[4].getAttribute('data-count');

      // 还原输入框内容
      oEditTxt.value = '';
      oTxtCount.innerHTML = '0';

      // 还原提交按钮文本和禁用状态
      oSubmitBtn.innerHTML = '提交评论';
      this.submitBtnChange({
        txtChange: false,
        isDisabled: true
      });
    },

    // 结合 submitBtnTxtChange & submitBtnStatusChange
    submitBtnChange: function (opt) {
      var txtChange = opt.txtChange,
        isDisabled = opt.isDisabled;

      oSubmitBtn.innerHTML = txtChange
        ? '<i class="fa fa-spinner fa-spin"></i>'
        : '提交评论';

      if (isDisabled) {
        oSubmitBtn.className = 'comment-btn submit J_submitBtn disabled';
        oSubmitBtn.setAttribute('disabled', 'disabled');
      } else {
        oSubmitBtn.className = 'comment-btn submit J_submitBtn';
        oSubmitBtn.removeAttribute('disabled');
      }
    },

    // 提交之后给Tab赋值
    setTabStarNum: function (arr) {
      var oRadioCount = null;

      arr.forEach(function (elem, index) {
        oRadioCount = oRadioTabItems[index].getElementsByClassName('radio-count')[0];
        oRadioCount.innerHTML = elem;
      });
      oStatisticsNum.innerHTML = arr[0] === '0'
        ? '-'
        : Math.ceil(arr[1] / arr[0] * 100) + '%';
    },

    // 选项卡切换，切换的过程中请求数据
    radioTabClick: function (e) {
      var _self = this,
        e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className;

      if (className === 'radio-icon' || className === 'radio-txt') {
        var itemLen = oRadioTabItems.length,
          oParent = tar.parentNode,
          item;

        datas.fieldId = oParent.getAttribute('data-id');

        for (var i = 0; i < itemLen; i++) {
          item = oRadioTabItems[i];
          item.className = 'tab-radio';
        }
        oParent.className += ' cur';

        // 每次切换页面 点击 好评 中屏 差评要在第一页
        datas.curPage = 1;
        _self.getComments({
          field: datas.fieldId,
          page: datas.curPage - 1
        });
      }
    },

    // 获取评论
    getComments: function (opt) {
      var _self = this,
        field = opt.field,
        page = opt.page;

      xhr.ajax({
        url: APIs.getComments,
        type: 'POST',
        data: {
          field: field,
          page: page
        },
        success: function (data) {
          var num = data.num,
            res = data.res,
            len = res.length;

          // 总页数
          datas.pages = data.pages;

          // 在延迟期间先显示加载图标
          oLoading.style.display = 'block';

          datas.t = setTimeout(function () {
            // 延迟结束关闭加载图标
            oLoading.style.display = 'none';
            // 点击完列表没有评论的选项，在点击有评论的选项时仍然存在 暂无评论，需要清除
            oCommentList.innerHTML = '';
            clearTimeout(datas.t);

            // 设置Tab评论数
            _self.setTabStarNum(num);

            // 没有评论
            if (len <= 0) {
              _self._setWarningTip('暂无评论');
              return;
            }

            if (datas.pages > 1) {
              initPageBtn(datas.pages, datas.curPage);
            } else {
              oBtnBox.innerHTML = '';
            }
            // 对评论进行列表渲染
            oCommentList.appendChild(_self.renderList(res));
          }, datas.delayTime);
        },
        error: function () {
          _self._setWarningTip('获取评论列表失败');
        }
      });
    },

    // 没有评论的展示
    _setWarningTip: function (text) {
      oCommentList.innerHTML = warningTip.replace(/{{(.*?)}}/gim, text);
    },

    // 渲染列表
    renderList: function (data) {
      var frag = document.createDocumentFragment(),
        _self = this,
        dom = null;

      data.forEach(function (elem) {
        dom = _self._makeItem(elem);
        frag.appendChild(dom);
      });

      return frag;
    },

    _makeItem: function (data) {
      // 模板中单独的节点不能往fragment里面append，需要创建一个DOM节点
      var dom = document.createElement('div'),
        starNum = data.star_num,
        count = 0;

      dom.className = 'comment-item';
      // 没调评论都有自定义属性data-id
      dom.setAttribute('data-id', data.id);

      dom.innerHTML = itemTpl.replace(/{{(.*?)}}/gim, function (node, key) {
        // 每一个star的active类名不一样的做法
        // return {
        //   avatar: 'img/' + data.avatar,
        //   nickname: data.nickname,
        //   comment: data.comment,
        //   uptime: getDateTime(data.uptime, 'dateTime'),
        //   isActive_1: starNum >= 1 ? 'active' : '',
        //   isActive_2: starNum >= 2 ? 'active' : '',
        //   isActive_3: starNum >= 3 ? 'active' : '',
        //   isActive_4: starNum >= 4 ? 'active' : '',
        //   isActive_5: starNum >= 5 ? 'active' : ''
        // }[key];

        // 只用一个isActive类名
        key === 'isActive' && count++;

        return {
          avatar: 'img/' + data.avatar,
          nickname: data.nickname,
          comment: data.comment,
          uptime: getDateTime(data.uptime, 'dateTime'),
          isActive: starNum >= count ? 'active' : ''
        }[key];
      });

      // 追加评论模板渲染
      if (data.add_comment) {
        dom.innerHTML += addCommentTpl.replace(/{{(.*?)}}/gim, function (node, key) {
          return {
            comment: data.add_comment.comment,
            uptime: getDateTime(data.add_comment.uptime, 'dataTime')
          }[key];
        });
      }

      return dom;
    },

    // 在不刷新页面的情况下，添加追加评论
    _appendAddComment: function (data) {
      var oCommentItems = $get('.comment-item'),
        itemLen = oCommentItems.length,
        item,
        dataId;

      for (var i = 0; i < itemLen; i++) {
        item = oCommentItems[i];
        dataId = item.getAttribute('data-id');
        if (+dataId === data.add_id) {
          item.innerHTML += addCommentTpl.replace(/{{(.*?)}}/gim, function (node, key) {
            return {
              comment: data.comment,
              uptime: getDateTime(data.uptime, 'dataTime')
            }[key];
          });
        }
      }
    },

    // 点击分页器，请求数据
    pageBtnClick: function () {
      var e = e || window.event,
        tar = e.target || e.srcElement,
        // 判断多类名不好，使用自定义属性判断
        field = tar.getAttribute('data-field');
      if (field) {
        switch (field) {
          case 'btn':
            datas.curPage = parseInt(tar.getAttribute('data-page'));
            break;
          case 'prev':
            datas.curPage -= 1;
            break;
          case 'next':
            datas.curPage += 1;
            break;
        }

        this.getComments({
          field: datas.fieldId,
          // 后端从0开始
          page: datas.curPage - 1
        });
      }
    }
  }
})(initPageBtns);