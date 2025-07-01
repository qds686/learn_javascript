import courseData from '../../../data/course';
import cartData from '../../../data/cart';

import Render from './Render';

export default class Course {
  constructor(oList, observer) {
    this.oList = oList;
    this.observer = observer;
    this.courseData = courseData;
    this.cartData = cartData;

    this.init();
  }

  init() {
    this.formatData();
    new Render(
      this.oList,
      this.courseData,
      this.cartData,
      this.observer
    );
  }

  formatData() {
    this.courseData = this.courseData.filter(item => {
      item.state = 0;

      this.cartData.forEach(elem => {
        if (item.id === elem.id) {
          item.state = 1;
        }
      });
    });
  }
}; 