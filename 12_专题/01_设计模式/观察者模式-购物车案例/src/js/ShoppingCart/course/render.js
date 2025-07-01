import tools from '../../../utils/tools';
import courseItem from '../../../template/courseItem.tpl';
import Event from './event';

@tools // target === Render => Render.tplReplace
export default class Render {
  constructor(oList, courseData, cartData, observer){
    this.oList = oList;
    this.courseData = courseData;
    this.cartData = cartData;
    this.observer = observer;

    this.init();
  }

  init(){
    this.render();

    new Event( 
      this.oList,
      this.courseData,
      this.cartData,
      this.observer
    );
  }

  render(){
    const oFrag = document.createDocumentFragment();

    this.courseData.forEach(item => {
      oFrag.appendChild(Render.createElement(
        'li', 
        Render.tplReplace(courseItem, {
          id: item.id,
          title: item.title,
          price: `￥${item.price}.00`,
          coupon: item.coupon ? `￥${item.coupon}.00` : `暂无优惠券`,
          disabled: item.state ? 'disabled': '',
          btnText: item.state ? '已添加' : '加入购物车'
        })
      ));
    });
    this.oList.appendChild(oFrag);
  }
}