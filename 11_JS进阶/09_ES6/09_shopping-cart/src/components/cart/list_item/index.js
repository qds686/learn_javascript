import './index.scss';
import tpl from './index.tpl';
import { CartModel } from '../../../models/cart';
import CheckBox from '../check_box/index';
import NumSelector from '../num_selector/index';
import Toast from '../../toast/index';

const cartModel = new CartModel(),
  checkBox = new CheckBox(),
  numSelector = new NumSelector(),
  toast = new Toast();

export default () => {

  return {
    name: 'listItem',
    tpl(data) {
      let list = '';

      data.forEach((elem, idx) => {
        elem.checked = true;
        list += tpl().replace(/{{(.*?)}}/g, (node, key) => {
          return {
            id: elem.id,
            img_url: elem.img_url,
            goods_name: elem.goods_name,
            price: elem.price,
            check_box: checkBox.tpl(elem.id, 'subCheck', idx),
            num_selector: numSelector.tpl(elem.id, elem.num, elem.limitation, idx),
            index: idx
          }[key];
        });
      });

      return list;
    },

    listEvent(e) {
      const tar = e.target,
        className = tar.className;

      return new Promise((resolve) => {
        if (className === 'item btn') {
          const field = tar.dataset.field,
            oParent = tar.parentNode,
            id = oParent.dataset.id,
            idx = oParent.dataset.index,
            limitation = tar.dataset.limitation,
            oInput = document.getElementById('J_numInput_' + id);

          switch (field) {
            case 'add':
              if (parseInt(oInput.value) < limitation) {
                oInput.value = parseInt(oInput.value) + 1;
                // resolve的是一个数据，不再是resolve方法执行后的返回值「总价」
                cartModel.updateCartNum(id, oInput.value);
                resolve({ field: 'numSelector', num: oInput.value, idx });
              } else {
                resolve(-1);
              }
              break;
            case 'minus':
              if (parseInt(oInput.value) > 1) {
                oInput.value = parseInt(oInput.value) - 1;
                cartModel.updateCartNum(id, oInput.value);
                resolve({ field: 'numSelector', num: oInput.value, idx });
              } else {
                resolve(-1);
              }
              break;
            default:
              break;
          }
        } else if (className === 'check-input J_subCheck' || className === 'fa fa-check') {
          const oSubChecks = Array.from(document.getElementsByClassName('J_subCheck')),
            oMainCheck = document.getElementsByClassName('J_mainCheck')[0],
            oParent = tar.parentNode,
            // 当前这一项
            idx = oParent.dataset.index,
            checked = oSubChecks[idx].checked;

          oMainCheck.checked = oSubChecks.every(elem => elem.checked === true);
          resolve({ field: 'checkBox', idx, checked });

        } else if (className === 'fa-solid fa-trash') {
          const id = tar.dataset.id,
            idx = tar.dataset.index,
            oItem = tar.parentNode.parentNode;

          cartModel.removeCartItem(id).then(data => {
            const code = data.msg_code;

            if (code === '200') {
              oItem.remove();
              toast.showToast({
                icon: 'success',
                title: '删除成功',
                duration: 1500
              });
              // 提供数据，删除前端的数据
              // 前端用splice通过索引idx删除会存在数组塌陷问题，再传递id删除即可
              resolve({ field: 'remove', idx, id });
            } else {
              toast.showToast({
                icon: 'warning',
                title: '删除失败',
                duration: 1500
              });
            }
          });
        }
      });
    }
  }
}