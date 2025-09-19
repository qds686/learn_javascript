import '../css/index.scss';
import Header from '../components/header/index';
import { IndexModule } from '../models';
import ListItem from '../components/index/list_item/index'

const header = new Header(),
  listItem = new ListItem(),
  indexModel = new IndexModule();

// 主入口文件
const App = (doc) => {
  const oContainer = doc.getElementsByClassName('J_container')[0],
    oList = doc.getElementsByClassName('J_list')[0];

  const init = () => {
    // 首页list
    indexModel.getGoodsList(listItem.tpl)
      .then((list => {
        oList.innerHTML = list;
      }));

    // 首页header
    // 1.header-fixed+appendChild  2.insertBefore
    oContainer.appendChild(header.tpl('商品列表'));
  }

  init();
}

new App(document);