// 一、创建Date对象的方式
// 1.没有传入任何的参数，获取到当前时间
var date1 = new Date();
console.log(date1); // 'Tue Jul 30 2024 23:29:50 GMT+0800 (中国标准时间)'

// 2.传入参数：时间字符串
var date2 = new Date("2024-7-30");
console.log(date2); // 'Tue Jul 30 2024 00:00:00 GMT+0800 (中国标准时间)'

// 3.传入具体的年月日时分秒毫秒
var date3 = new Date(2024, 10, 10, 11, 12, 22, 22);
console.log(date3); // 'Sun Nov 10 2024 11:12:22 GMT+0800 (中国标准时间)'

// 4.传入一个Unix时间戳
// 1s = 1000ms
var date4 = new Date(10004343433);
console.log(date4); // 'Mon Apr 27 1970 02:59:03 GMT+0800 (中国标准时间)'

// 二、Date两种表示标准

var date5 = new Date();
console.log(date5); // 'Tue Jul 30 2024 23:40:39 GMT+0800 (中国标准时间)'

// 1.方法以美式英语和人类易读的形式返回一个日期对象日期部分的字符串。
console.log(date5.toDateString()); // 'Tue Jul 30 2024'

// 2.方法返回一个 ISO（ISO 8601 Extended Format）格式的字符串： YYYY-MM-DDTHH:mm:ss.sssZ。时区总是 UTC（协调世界时），加一个后缀“Z”标识。
console.log(date5.toISOString()); // '2024-07-30T15:45:30.011Z'

// 3. 获取当前日期到1970年1月1号 00：00:00 之间的毫秒差
console.log(date5.getTime()); // 1722358790684

// 4. 获取到的是年月日，时分秒
console.log(date5.toLocaleString()); // '2024/7/31 01:00:54'

// 5. 获取到是字符串的年月日
console.log(date5.toLocaleDateString()); // '2024/7/31'

// 6. 获取到的是字符串的时分秒
console.log(date5.toLocaleTimeString()); // '01:03:12'

// 三、Date对象方法
var date6 = new Date();

// 1.获取想要的时间信息
// 获取年份（4位数）
var year = date6.getFullYear();
// 获取月份，从0到11
var month = date6.getMonth() + 1;
// 获取当月的具体日期，从1到31
var day = date6.getDate();
var hour = date6.getHours();
var minute = date6.getMinutes();
var second = date6.getSeconds();
console.log(year, month, day, hour, minute, second); // 2024 7 31 0 22 10
console.log(`${year}/${month}/${day} ${hour}:${minute}:${second}`); // '2024/7/31 0:22:31'

var weekday = date6.getDay() // 一周中的第几天
console.log(weekday) // 3

// 四、获取Unix时间戳
var date7 = new Date();
var date8 = new Date("2025-6-5");

// 获取当前时间的时间戳
var timestamp1 = Date.now();
console.log(timestamp1); // 1722358035804

// 将Date对象，转成时间戳
var timestamp2 = date7.getTime();
var timestamp3 = date8.valueOf();
console.log(timestamp2, timestamp3); // 1722358192525 1749052800000

// 五、将字符串事件转成时间戳
var timeString = "04/24/2024";

// 1.方式一
var date9 = new Date(timeString);
var timestamp4 = date9.getTime();
console.log(date9, timestamp4); // 'Wed Apr 24 2024 00:00:00 GMT+0800 (中国标准时间)'  1713888000000

// 2.方式二
var timestamp5 = Date.parse(timeString);
console.log(timestamp5); // 1713888000000

