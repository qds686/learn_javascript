import '../css/cart.scss';
import { CartModel } from '../models/cart';
import Header from '../components/header/index';
import ListItem from '../components/cart/list_item/index';
import PurchaseBox from '../components/cart/purchase_box/index';
import NoListTip from '../components/cart/no_list_tip';
import Toast from '../components/toast/index';

const cartModel = new CartModel(),
  header = new Header(),
  listItem = new ListItem(),
  purchaseBox = new PurchaseBox(),
  noListTip = new NoListTip(),
  toast = new Toast();

const App = (doc) => {
  const oContainer = doc.getElementsByClassName('J_container')[0],
    oList = doc.getElementsByClassName('J_list')[0];

  let cartInfos = {
    list: [],
    total: 0.00
  };

  const init = () => {
    oContainer.appendChild(header.tpl('购物车管理', true));

    cartModel.getCartList(1).then((data) => {

      cartInfos.total = data.total_price;
      cartInfos.list = data.res;

      if (data.res) {
        oList.innerHTML = listItem.tpl(cartInfos.list);
        oContainer.appendChild(purchaseBox.tpl(cartInfos.total));
      } else {
        oList.innerHTML = noListTip.tpl();
      }
    }).then(() => {
      bindEvent();
    });
  }

  const bindEvent = () => {
    const oMainCheck = doc.getElementsByClassName('J_mainCheck')[0],
      oEditItemBtn = doc.getElementsByClassName('J_editItem')[0],
      oPurchaseBtn = doc.getElementsByClassName('J_purchaseBtn')[0],
      oSubChecks = doc.getElementsByClassName('J_subCheck');

    oList.addEventListener('click', listEvent, false);
    oMainCheck && oMainCheck.addEventListener('click', onMainCheck, false);
    oEditItemBtn.addEventListener('click', header.onEditBtn, false);

    // 👇 新增：给父容器绑定事件委托（监听立即购买按钮点击）
    oContainer.addEventListener('click', (e) => {
      const tar = e.target;
      // 校验是否点击了「立即购买」按钮（匹配类名）
      if (tar.classList.contains('J_purchaseBtn')) {
        purchaseCart(); // 执行购买逻辑
      }
    }, false);
    // oPurchaseBtn && oPurchaseBtn.addEventListener('click', purchaseCart, false);
  }

  const listEvent = (e) => {
    // 不能在入口文件处理子组件的事件，只需要子组件抛出接口入口文件使用即可
    listItem.listEvent(e).then((data) => {
      // 获取的是 一个对象数据
      if (data !== -1) {
        const oTotal = oContainer.getElementsByClassName('J_totalPrice')[0];
        // 操作的是哪一项
        let item = cartInfos.list[data.idx];

        switch (data.field) {
          case 'numSelector':
            numOperation(item, data, oTotal);
            break;
          case 'checkBox':
            itemCheck(item, data, oTotal);
            break;
          case 'remove':
            removeItem(data.id, oTotal);
            break;
          default:
            break;
        }
      }
    });
  }

  const numOperation = (item, data, dom) => {
    const oSubChecks = Array.from(document.getElementsByClassName('J_subCheck'));

    item.num = data.num;
    item.total_price = data.num * item.price;

    // 点击的时候选中
    oSubChecks[data.idx].checked = true;
    cartInfos.list[data.idx].checked = true;

    reComputeTotal(dom);
  };

  const itemCheck = (item, data, dom) => {
    item.checked = data.checked;
    cartInfos.total = item.checked
      ? cartInfos.total + Number(item.total_price)
      : cartInfos.total - Number(item.total_price);

    dom.innerHTML = cartInfos.total;
  };


  /* const removeItem = (id, dom) => {
    // 通过id删除前端某一项数据
    const list = cartInfos.list;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      if (item.id === id) {
        const idx = list.indexOf(item);
        cartInfos.list.splice(idx, 1);
        break;
      }
    }

    if (cartInfos.list.length > 0) {
      // 重新计算 total
      reComputeTotal(dom);
    } else {
      const oPurchaseBox = doc.getElementsByClassName('purchase-box')[0];
      oPurchaseBox.remove();
      oList.innerHTML = noListTip.tpl();
    }
  }; */

  /**
 * 重构后的删除商品方法
 * @param {string/number} id - 要删除的商品ID
 * @param {HTMLElement} totalDom - 总价显示的DOM元素（确保总价实时更新）
 */
  const removeItem = (id, totalDom) => {
    // 1. 安全校验：若列表为空或总价DOM不存在，直接返回（避免无效操作）
    if (cartInfos.list.length === 0 || !totalDom) return;

    // 2. 查找要删除的商品索引（用findIndex高效定位，避免循环冗余）
    const delIndex = cartInfos.list.findIndex(elem => elem.id === id);
    // 若未找到对应商品（异常情况），直接返回
    if (delIndex === -1) return;

    // 3. 从数据模型中删除商品（splice会直接修改cartInfos.list）
    cartInfos.list.splice(delIndex, 1);

    // 4. 根据剩余商品数量处理后续逻辑
    if (cartInfos.list.length > 0) {
      // 4.1 还有商品：重新计算并更新总价
      reComputeTotal(totalDom);
    } else {
      // 4.2 无商品：移除purchaseBox + 显示空购物车提示 + 重置总价数据
      const oPurchaseBox = document.querySelector('.purchase-box');
      // 安全移除：确保purchaseBox存在再删除（避免DOM不存在报错）
      if (oPurchaseBox) oPurchaseBox.remove();
      // 显示空购物车提示
      oList.innerHTML = noListTip.tpl();
      // 重置总价数据（避免数据残留）
      cartInfos.total = 0;
    }
  };

  /* const reComputeTotal = (dom, isZero) => {
    cartInfos.total = 0;

    if (isZero) {
      dom.innerHTML = 0;
      return;
    }

    cartInfos.list.forEach(elem => {
      if (elem.checked) {
        cartInfos.total += Number(elem.total_price);
      }
    });

    dom.innerHTML = cartInfos.total;
  }; */

  /**
 * 重新计算总价（简化逻辑，增强防御性）
 * @param {HTMLElement} dom - 总价显示DOM元素
 */
  const reComputeTotal = (dom) => {
    // 防御性校验：DOM不存在则退出（避免报错）
    if (!dom) return;

    // 重新计算选中商品的总价
    cartInfos.total = cartInfos.list.reduce((sum, elem) => {
      // 只累加选中商品的总价（处理elem.checked未初始化的情况，默认视为未选中）
      return elem.checked === true ? sum + Number(elem.total_price) : sum;
    }, 0); // 初始值为0

    // 强制更新DOM显示（确保界面同步）
    dom.innerHTML = cartInfos.total;
  };

  const onMainCheck = () => {
    const oSubChecks = Array.from(document.getElementsByClassName('J_subCheck')),
      oMainCheck = document.getElementsByClassName('J_mainCheck')[0],
      oTotal = document.getElementsByClassName('J_totalPrice')[0];

    // 点击main全选item
    oSubChecks.forEach((elem, idx) => {
      elem.checked = oMainCheck.checked;
      cartInfos.list[idx].checked = oMainCheck.checked;
    });

    // oTotal.innerHTML = oMainCheck.checked ? total : 0;
    reComputeTotal(oTotal);
  }

  const purchaseCart = () => {
    let gids = [];
    const checkedGoods = cartInfos.list.filter(elem => elem.checked);

    if (checkedGoods.length < 1) {
      toast.showToast({
        icon: 'warning',
        title: '请选择要购买的商品',
        duration: 1500
      });
      return;
    }

    cartInfos.list.forEach(elem => {
      if (elem.checked) {
        gids.push(elem.id);
      }
    });

    cartModel.purchaseCart(1, gids.toString()).then(data => {
      const code = data.msg_code,
        oTotal = doc.getElementsByClassName('J_totalPrice')[0],
        oMainCheck = doc.getElementsByClassName('J_mainCheck')[0],
        oPurchaseBox = doc.getElementsByClassName('purchase-box')[0];

      if (+code === 200) {
        toast.showToast({
          icon: 'success',
          title: '支付成功',
          duration: 1500
        });

        // 支付成功，删除对应的item
        gids.forEach(id => {
          cartInfos.list.forEach((elem, idx) => {
            if (elem.id === id) {
              cartInfos.list.splice(idx, 1);
            }
          });
        });

        // 支付成功，重新渲染页面 删除purchase
        if (cartInfos.list.length > 0) {
          oList.innerHTML = listItem.tpl(cartInfos.list);

          // 重新计算总价
          reComputeTotal(oTotal);

          // 👇关键：同步更新全选按钮状态
          if (oMainCheck) {
            // 判断剩余商品是否全部选中
            const isAllChecked = cartInfos.list.every(elem => elem.checked);
            oMainCheck.checked = isAllChecked;
          } else if (oMainCheck) {
            // 若列表为空，取消全选
            oMainCheck.checked = false;
          }
        } else {
          oList.innerHTML = noListTip.tpl();
          oPurchaseBox.remove();
        }
      } else {
        toast.showToast({
          icon: 'warning',
          title: '支付失败',
          duration: 1500
        });
      }
    });
  };

  init();
}

new App(document);