let a = 0,
    b = 0;
let A = function (a){
  A = function (b){
    alert(a + b++);
  };
  alert(a++);
};
A(1);
A(2);