function getUrlQueryValue (key) {
	// id=1 | &id=1以空或&开始
	// name=张三&age=20&gender=男
	const reg = new RegExp('(^|&)'+ key +'=([^&]*)(&|$)', 'i'),
				// search: ?id=1
	      res = window.location.search.substr(1).match(reg);

	return res != null ? decodeURIComponent(res[2]) : null;
}

module.exports = {
	getUrlQueryValue
}