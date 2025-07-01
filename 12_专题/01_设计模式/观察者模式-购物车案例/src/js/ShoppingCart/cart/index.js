import courseData from '../../../data/course';
import cartData from '../../../data/cart';

import Render from './render';

export default class Cart {
  constructor(oCart, observer) {
    this.oCart = oCart;
    this.courseData = courseData;
    this.cartData = cartData;
    this.observer = observer;

    this.init();
  }

  init() {
    new Render(
      this.oCart,
      this.courseData,
      this.cartData,
      this.observer
    );
  }
};