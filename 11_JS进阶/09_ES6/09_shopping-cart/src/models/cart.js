import { HTTP } from '../utils/http';

class CartModel extends HTTP {
  getCartList(uid) {
    return new Promise((resolve, reject) => {
      this.ajax({
        url: 'Shopping_cart/getCartList',
        type: 'POST',
        dataType: 'JSON',
        data: {
          uid
        },
        success(data) {
          resolve(data);
        }
      });
    });
  }

  updateCartNum(id, num) {
    return new Promise((resolve, reject) => {
      this.ajax({
        url: 'Shopping_cart/updateCartNum',
        type: 'POST',
        dataType: 'JSON',
        data: {
          id,
          num
        },
        success(data) {
          resolve(data);
        }
      });
    });
  }

  removeCartItem(id) {
    return new Promise((resolve, reject) => {
      this.ajax({
        url: 'Shopping_cart/removeCartItem',
        type: 'POST',
        dataType: 'JSON',
        data: {
          id
        },
        success(data) {
          // {msg: 'ok', msg_code: '200'}
          // console.log(data);
          resolve(data);
        }
      });
    });
  }

  purchaseCart(uid, gids) {
    return new Promise((resolve, reject) => {
      this.ajax({
        url: 'Shopping_cart/purchaseCart',
        type: 'POST',
        dataType: 'JSON',
        data: {
          uid,
          gids
        },
        success(data) {
          resolve(data);
        }
      });
    });
  }
}

export { CartModel };