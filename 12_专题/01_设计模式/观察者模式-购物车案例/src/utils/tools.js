export default (target) => {
  target.tplReplace = (template, replaceObject) => {
    return template().replace(/{{(.*?)}}/g, (node, key) => {
      return replaceObject[key];
    })
  }

  target.createElement = (elem, inner) => {
    const oElem = document.createElement(elem);
    oElem.innerHTML = inner;
    return oElem; 
  }

  target.getTarget = (ev) => {
    const e = ev || window.event;
    return e.target || e.srcElement;
  }
} 