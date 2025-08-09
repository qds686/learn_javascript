; (function (Comment) {
  var oOpenBtn = $get('.J_openBtn')[0],
    oCloseBtn = $get('.J_closeBtn')[0],
    oStars = $get('.J_stars')[0],
    oEditTxt = $get('. J_editTxt')[0],
    oSubmitBtn = $get('.J_submitBtn')[0],
    oRadioTabs = $get('.J_radioTabs')[0],
    oBtnBox = $get('.J_btnBox')[0];

  var userId = 17;

  var init = function () {
    // 第一次进来显示「全部评论，第一页」
    Comment.getComments({
      field: 0,
      page: 0
    });

    bindEvent();
  }

  function bindEvent() {
    // 点击 “立即评论” 把评论框展示出来
    oOpenBtn.addEventListener('click', Comment.openBoard, false);
    // 点击 关闭按钮 关闭评论框
    oCloseBtn.addEventListener('click', Comment.closeBoard.bind(Comment), false);
    // 对所有的星星进行事件代理
    oStars.addEventListener('mouseover', Comment.hoverStar, false);
    // 输入评论控制提交按钮是否可用，记录TXTCount的长度
    oEditTxt.addEventListener('input', Comment.editInput.bind(Comment), false);
    // 提交评论
    oSubmitBtn.addEventListener('click', Comment.submitComment.bind(Comment, userId), false);
    // 选项卡切换，同时进行数据请求
    oRadioTabs.addEventListener('click', Comment.radioTabClick.bind(Comment), false);
    // 事件代理实现分页器点击事件
    oBtnBox.addEventListener('click', Comment.pageBtnClick.bind(Comment), false);
  }

  init();
})(initCommentModule);