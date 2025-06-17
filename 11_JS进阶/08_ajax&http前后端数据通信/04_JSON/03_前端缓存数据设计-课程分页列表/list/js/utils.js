function addEvent(el, type, fn){
  if(el.addEventListener){
  	el.addEventListener(type, fn, false);
  }else if(el.attachEvent){
  	el.attachEvent('on' + type, function(){
  		fn.call(el);
  	})
  }else{
  	el['on' + type] = fn;
  }
}

function setTplToHTML(tpl, regExp, opt){
  return tpl.replace(regExp(), function(node, key){
    return opt[key];
  });
}

function regTpl(){
  return new RegExp(/{{(.*?)}}/, 'gim');
}
