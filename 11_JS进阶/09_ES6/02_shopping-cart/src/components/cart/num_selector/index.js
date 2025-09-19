import './index.scss';
import tpl from './index.tpl';

export default () => {
	return {
		name: 'numSelector',
		tpl (id, num, limitation, index) {
			return tpl().replace(/{{(.*?)}}/g, (node, key) => {
        return {
          id, num, limitation, index
        }[key];        
			});
		}
	}
}