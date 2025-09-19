import './index.scss';
import tpl from './index.tpl';

// 导出header模块
export default () => {
  return {
    name: 'toast',
    showToast(opt) {
      const oToastBox = document.getElementsByClassName('toast-box')[0];

      if (oToastBox) return;

      let oToast = document.createElement('div');
      oToast.className = 'toast-box';
      oToast.innerHTML = tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          icon: opt.icon === 'warning' ? 'warning' : 'check',
          text: opt.title
        }[key];
      });

      document.body.appendChild(oToast);

      setTimeout(() => {
        const oToastBox = document.getElementsByClassName('toast-box')[0];
        oToastBox.remove();
      }, opt.duration || 2000); 
    }
  }
}