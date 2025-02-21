function fun(n,o){
  console.log(o);
  return {
    fun: function (m){
      return fun(m,n);
    }
  };
}
var c = fun(0).func(1);
c.fun(2);
c.func(3)

// undefined 0 1 1