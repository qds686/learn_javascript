export default class Handle {
  constructor(courseData, cartData, oAddBtns, observer) {
    this.courseData = courseData;
    this.cartData = cartData;
    this.oAddBtns = oAddBtns;
    this.observer = observer;

    this.init();
  }

  init() {

  }

  setState(id, target, state) {
    this.courseData = this.courseData.filter(item => {
      if (item.id === id) {
        item.state = state;

        if (state) {
          this.cartData.push(item);
        } else {
          this.cartData = this.cartData.filter(elem => {
            if (elem.id === id) {
              return false;
            }
            return true;
          });
        }
      }
      return true;
    });
  }

  setAddBtnState(id, target, state){
    if(state){
      target.innerText = '已添加';
      target.disabled = true;
    }else {
      const thisAddBtn = this.oAddBtns[this.courseData.findIndex(item => item.id === id)];
      thisAddBtn.innerText = '加入购物车';
      thisAddBtn.disabled = false;
    }
  }
}