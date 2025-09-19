import { HTTP } from '../utils/http';

class DetailModel extends HTTP {
  getGoodsDetail(gid){
    return new Promise((resolve)=> {
      this.ajax({
        url: 'ShoppingCart/getGoodsDetail',
        type: 'POST',
        dataType: 'JSON',
        data: {
          id: gid
        },
        success(data){
          const code = data.error_code;
          code === '1001' && (window.location.href = 'index.html');

          resolve(data);
        }
      });
    });
  }

  updateShoppingCart(gid){
    return new Promise((resolve)=> {
      this.ajax({
        url: 'ShoppingCart/updateShoppingCart',
        type: 'POST',
        dataType: 'JSON',
        data: {
          uid: 1,
          goodsId: gid
        },
        success(data){
          resolve(data.error_code);
        }
      });
    });
  }
}

export { DetailModel };