import './index.scss';
import tpl from './index.tpl';

// 导出header模块
export default () => {
  return {
    name: 'header',
    showRemove: false,
    tpl(title, is_show) {
      // 动态创建div
      let oHeader = document.createElement('div');
      oHeader.className = 'header';
      oHeader.innerHTML = tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          title,
          is_show: is_show ? 'show' : ''
        }[key];
      });
      return oHeader;
    },

    onEditBtn() {
      this.showRemove = !this.showRemove;

      const oRemoveCell = Array.from(document.getElementsByClassName('remove-cell')),
        oEditItemBtn = document.getElementsByClassName('J_editItem')[0];

      oRemoveCell.forEach(elem => {
        if (this.showRemove) {
          oEditItemBtn.innerHTML = '关闭';
          elem.className += ' show';
        } else {
          oEditItemBtn.innerHTML = '编辑';
          elem.className = 'cell remove-cell';
        }
      });
    }
  }
}