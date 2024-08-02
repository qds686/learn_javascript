// 需求：真实项目中，我们从服务器获取到了时间字符串，但是格式并不是我们需要的，我们需要呈现在页面中的是 
// => “yyyy年mm月dd日 hh时mm分ss秒”
// 此时就需要客户端基于JS完成时间格式字符串的数据解析
var time = "2024-8-2 9:55:12";

// 传递一个值，校验是否在10以下，是则加0
function addZero(str) {
  var strToNum = Number(str);
  if (!isNaN(strToNum)) {
    strToNum = strToNum > 9 ? strToNum : '0' + strToNum;
  }
  return strToNum;
}
/**
 * 思路1：根据字符串截取的方法，获取到字符串中“年月日”等数据信息
 *   + substr(n,m) 从索引n开始截取m个
 *   + substring(n,m) 从索引n开始截取到m个，不包含m
 *   + slice(n,m) 和substring一样，支持负数作为索引
 *   + indexOf / lastIndexOf([char]) 获取字符在字符串中第一次或者最后一次出现的索引，如果没有返回-1
 */

// 1.首先获取 中横线、空格、冒号的索引
var firstLineIdx = time.indexOf("-"), // 4
  secondLineIdx = time.lastIndexOf("-"), // 6
  spaceIdx = time.indexOf(" "), // 8
  firstColonIdx = time.indexOf(":"), // 10
  secondColonIdx = time.lastIndexOf(":"); // 13

// 2.根据索引截取字符串
var year = time.slice(0, firstLineIdx),
  mouth = time.slice(firstLineIdx + 1, secondLineIdx),
  day = time.slice(secondLineIdx + 1, spaceIdx),
  hour = time.slice(spaceIdx + 1, firstColonIdx),
  minutes = time.slice(firstColonIdx + 1, secondColonIdx),
  seconds = time.slice(secondColonIdx + 1);

var result = `${addZero(year)}年${addZero(mouth)}月${addZero(day)}日 ${addZero(hour)}时${addZero(minutes)}分${addZero(seconds)}秒`;
// console.log(result); // '2024年08月02日 09时55分12秒'


// 思路2
// 1.根据空格分隔字符串获取日期和时间字符串
// 2.分别通过分隔符获取具体的字符串
function timeFormat(str) {
  var timeArr = str.split(" "),
    dateString = timeArr[0],
    timeString = timeArr[1],
    localData = dateString.split("-"),
    localTime = timeString.split(":"),
    result;

  result = `${addZero(localData[0])}年${addZero(localData[1])}月${addZero(localData[2])}日 ${addZero(localTime[0])}时${addZero(localTime[1])}分${addZero(localTime[2])}秒`;
  return result;
}
var time = timeFormat(time);
// console.log(time); // '2024年08月02日 09时55分12秒'

// 方式三：正则
var time = "2024-8-2 9:55:12".split(/(?:\s|-|:)/);
var res = `${time[0]}年${addZero(time[1])}月${addZero(time[2])}日 ${addZero(time[3])}时${addZero(time[4])}分${addZero(time[5])}秒`
// console.log(res); // '2024年08月02日 09时55分12秒'

// 优化:基于es6的结构赋值快速获取每一项的信息
var time = "2024-8-2 9:55:12",
  resArr = time.split(/(?:\s|-|:)/),
  [year, month, day, hours, minutes, seconds] = resArr,
  res = `${year}年${addZero(month)}月${addZero(day)}日 ${addZero(hours)}时${addZero(minutes)}分${addZero(seconds)}秒`;
// console.log(res); // '2024年08月02日 09时55分12秒'