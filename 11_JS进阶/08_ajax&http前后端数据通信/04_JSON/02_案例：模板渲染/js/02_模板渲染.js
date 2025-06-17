function render() {
  var jsonData = document.getElementById('J_data').innerHTML,
    tpl = document.getElementById('J_tpl').innerHTML,
    data = JSON.parse(jsonData),
    len = data.length,
    oList = document.getElementsByClassName('j-list')[0],
    list = '',
    item;

  for (var i = 0; i < len; i++) {
    item = data[i];

    list += setTplToHTML(tpl, regTpl, {
      career: item.career,
      city: item.city,
      salary: item.salary,
      img: item.img
    });
  }
  oList.innerHTML = list;
}

render();

function setTplToHTML(tpl, regTpl, opt) {
  return tpl.replace(regTpl(), function (node, key) {
    return opt[key];
  });
}

function regTpl() {
  return new RegExp(/{{(.*?)}}/, 'gim');
}