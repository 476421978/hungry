export function formatDate(date, fmt) {//替换成指定的时间格式显示
  if (/(y+)/.test(fmt)) {//匹配到以y开头一个或多个的字符串
    //1.正则表达式test方法test() 方法用于检测一个字符串是否匹配某个模式返回值：
      //如果字符串 string 中含有与 RegExpObject 匹配的文本，则返回 true，否则返回 false。
    //RegExp 对象表示正则表达式，它是对字符串执行模式匹配的强大工具。
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
