import './index.scss';
import tpl from './index.tpl';
import { DetailModel } from '../../../models/detail';
import Toast from '../../toast/index';

const detailModel = new DetailModel(),
  toast = new Toast();

export default () => {
  return {
    name: 'bottomBox',
    tpl,
    bindEvent() {
      const oAddToCartBtn = document.getElementsByClassName('J_addToCart')[0],
        oPurchaseBtn = document.getElementsByClassName('J_purchase')[0];

      oAddToCartBtn.addEventListener('click', this.updateShoppingCart, false);
    },

    updateShoppingCart(e){
      const gid = e.target.dataset.id;

      detailModel.updateShoppingCart(gid).then((code)=> {
        switch(code){
          case '1001':
            window.location.href = 'index.html';
            break;
          case '1002':
            toast.showToast({
              icon: 'warning',
              title: '添加失败',
              duration: 1500
            });
            break;
          case '1003':
            toast.showToast({
              icon: 'warning',
              title: '已达到上限',
              duration: 1500
            });
            break;
          case '200':
            toast.showToast({
              title: '添加成功',
              duration: 1500
            });
            break;
          default:
            break;
        }
      });
    }
  }
}