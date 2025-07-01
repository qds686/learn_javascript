import Course from './course';
import Cart from './cart';

import Observer from '../../utils/observer';

export default class ShoppingCart {
  constructor() {
    this.oList = document.getElementsByClassName('J_list')[0];
    this.oCart = document.getElementsByClassName('J_cart')[0];
    this.observer = new Observer();

  }

  init() {
    new Course(this.oList, this.observer);
    new Cart(this.oCart, this.observer);
  }
}