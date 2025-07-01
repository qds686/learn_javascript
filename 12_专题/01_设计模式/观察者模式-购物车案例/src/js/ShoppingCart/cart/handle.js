import tools from '../../../utils/tools';
import cartItem from '../../../template/cartItem.tpl';

@tools
export default class Handle {
  constructor(courseData, cartData, oCart, observer) {
    this.courseData = courseData;
    this.cartData = cartData;
    this.oCart = oCart;
    this.observer = observer;

    this.init();
  }

  init() {

  }

  handleCartItem (id, target, state){
    if(state){
      const itemData = this.courseData.filter(item => {
        if(item.id === id) {
          return item;
        }
      })[0];

      const _item = Handle.createElement(
        'li',
        Handle.tplReplace(
          cartItem, {
            
          }
        )
      )
    }
  }
}