export let a = 0;

setTimeout(() => {
  console.log('来自exports', ++a); 
}, 300);

// module.exports = {
//   a
// };


