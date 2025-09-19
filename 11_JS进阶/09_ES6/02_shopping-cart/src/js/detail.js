import '../css/detail.scss';
import { DetailModel } from '../models/detail';
import tools from '../utils/tools';
import ImgShow from '../components/detail/img_show/index';
import InfoBox from '../components/detail/info_box/index';
import TitleBox from '../components/detail/title_box/index';
import BottomBox from '../components/detail/bottom_box/index';

const detailModel = new DetailModel(),
  imgShow = new ImgShow(),
  infoBox = new InfoBox(),
  titleBox = new TitleBox(),
  bottomBox = new BottomBox();

const App = (doc) => {
  const oContainer = doc.getElementsByClassName('J_container')[0];

  detailModel.getGoodsDetail(tools.getUrlQueryValue('id'))
    .then(data => {
      let html = '';

      html += imgShow.tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          img_url: data.img_url,
          goods_name: data.goods_name
        }[key];
      });

      html += infoBox.tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          price: data.price,
          m_sales: data.m_sales
        }[key];
      });

      html += titleBox.tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          goods_name: data.goods_name
        }[key];
      });

      html += bottomBox.tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          id: data.id
        }[key];
      });

      oContainer.innerHTML = html;
    }).then(()=> {
      // DOM渲染完成执行事件处理函数
      bottomBox.bindEvent();
    });
};

new App(document);