import tools from '../../../utils/tools';
import Handle from './handle'
@tools
export default class Event {
  constructor(oCart, courseData, cartData, observer){
    this.oCart = oCart;
    this.courseData = courseData;
    this.cartData = cartData;
    this.observer = observer;

    this.init();
  }

  init(){
    this.bindEvent();

    new Handle(
      this.courseData,
      this.cartData,
      this.oCart,
      this.observer
    );
  }

  bindEvent(){
    this.oCart.addEventListener('click', this.onRemoveBtnClick.bind(this), false);
  }

  onRemoveBtnClick(ev){
    const tar = Event.getTarget(ev),
      className = tar.className;
    if(className === 'remove-btn'){
      const id = tar.getAttribute('data-id');
    }
  }
}