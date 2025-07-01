import tools from '../../../utils/tools';
import cartItem from '../../../template/cartItem.tpl';
import Event from './event';

@tools
export default class Render {
  constructor(oCart, courseData, cartData, observer) {
    this.oCart = oCart;
    this.courseData = courseData;
    this.cartData = cartData;
    this.observer = observer;

    this.init();
  }

  init() {
    this.render();

    new Event(
      this.oCart,
      this.courseData,
      this.cartData,
      this.observer
    );
  }

  render() {
    const oFrag = document.createDocumentFragment();

    this.cartData.forEach(item => {
      oFrag.appendChild(Render.createElement(
        'li',
        Render.tplReplace(cartItem, {
          id: item.id,
          title: item.title,
          originPrice: item.coupon ? `<del>￥${item.price}.00 : `￥${ item.price }.00`</del>`,
          currentPrice: item.coupon ? `￥${Number(item.price) - Number(item.coupon)}.00` : ''
          });
        ));
  });
      this.oCart.appendChild(oFrag);
    }
}