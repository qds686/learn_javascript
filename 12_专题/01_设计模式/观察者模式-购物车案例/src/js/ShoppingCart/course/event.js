import tools from '../../../utils/tools';
import Handle from './handle';

@tools
export default class Event {
  constructor(oList, courseData, cartData, observer) {
    this.oList = oList;
    this.oAddBtns = this.oList.getElementsByClassName('add-btn');
    this.courseData = courseData;
    this.cartData = cartData;
    this.observer = observer;
  }

  init() {
    this.bindEvent();

    new Handle(
      this.courseData,
      this.cartData,
      this.oAddBtns,
      this.observer
    );
  }

  bindEvent() {
    this.oList.addEventListener('click', this.onAddBtnClick.bind(this), false);
  }

  onAddBtnClick(ev) {
    const tar = Event.getTarget(ev),
      className = tar.className;
    if (className === 'add-btn') {
      const id = tar.getAttribute('data-id');

      this.handle.setState(id, tar, 1);
      this.handle.setAddBtnState(id, tar, 1);
    }
  }
}