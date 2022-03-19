export default function (timestamp, format) {
  var jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date())
  var pad = function (n, c) {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n
    } else {
      return n
    }
  }
  var textWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  var txtOrdin = { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st' }
  var txtMonths = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  var f = {
    // Day
    d: function () { return pad(f.j(), 2) },
    D: function () { return f.l().substr(0, 3) },
    j: function () { return jsdate.getDate() },
    l: function () { return textWeekdays[f.w()] },
    N: function () { return f.w() + 1 },
    S: function () { return txtOrdin[f.j()] ? txtOrdin[f.j()] : 'th' },
    w: function () { return jsdate.getDay() },
    z: function () { return (jsdate - new Date(jsdate.getFullYear() + '/1/1')) / 864e5 >> 0 },
    // Week
    W: function () {
      let a = f.z()
      let b = 364 + f.L() - a
      let nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() || 7) - 1
      let nd2 = nd
      if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
        return 1
      } else {
        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
          nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31')
          return this('W', Math.round(nd2.getTime() / 1000))
        } else {
          return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0)
        }
      }
    },
    // Month
    F: function () { return txtMonths[f.n()] },
    m: function () { return pad(f.n(), 2) },
    M: function () { return f.F().substr(0, 3) },
    n: function () { return jsdate.getMonth() + 1 },
    t: function () {
      var n
      if ((n = jsdate.getMonth() + 1) === 2) {
        return 28 + f.L()
      } else {
        if ((n & 1 && n < 8) || (!(n & 1) && n > 7)) {
          return 31
        } else {
          return 30
        }
      }
    },

    // Year
    L: function () {
      var y = f.Y()
      return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0
    },
    // o not supported yet
    Y: function () { return jsdate.getFullYear() },
    y: function () { return (jsdate.getFullYear() + '').slice(2) },

    // Time
    a: function () { return jsdate.getHours() > 11 ? 'pm' : 'am' },
    A: function () { return f.a().toUpperCase() },
    B: function () {
      // peter paul koch:
      var off = (jsdate.getTimezoneOffset() + 60) * 60
      var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off
      var beat = Math.floor(theSeconds / 86.4)
      if (beat > 1000) beat -= 1000
      if (beat < 0) beat += 1000
      if ((String(beat)).length === 1) beat = '00' + beat
      if ((String(beat)).length === 2) beat = '0' + beat
      return beat
    },
    g: function () { return jsdate.getHours() % 12 || 12 },
    G: function () { return jsdate.getHours() },
    h: function () { return pad(f.g(), 2) },
    H: function () { return pad(jsdate.getHours(), 2) },
    i: function () { return pad(jsdate.getMinutes(), 2) },
    s: function () { return pad(jsdate.getSeconds(), 2) },
    // u 暂不支持
    // Timezone
    // e 暂不支持
    // I 暂不支持
    O: function () {
      var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4)
      if (jsdate.getTimezoneOffset() > 0) {
        t = '-' + t
      } else {
        t = '+' + t
      }
      return t
    },
    P: function () {
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    // yyyy-MM-DD HH:ii:ss
    T: function () { return f.Y() + '-' + f.m() + '-' + f.d() + ' ' + f.H() + ':' + f.i() + ':' + f.s() },
    // Z 暂不支持

    // Full Date / Time
    c: function () { return f.Y() + '-' + f.m() + '-' + f.d() + 'T' + f.h() + ':' + f.i() + ':' + f.s() + f.P() },
    // r 暂不支持
    U: function () { return Math.round(jsdate.getTime() / 1000) }
  }
  return format.replace(/[\\]?([a-zA-Z])/g, function (t, s) {
    let ret
    if (t !== s) {
      // escaped
      ret = s
    } else if (f[s]) {
      // date 函数已存在
      ret = f[s]()
    } else {
      // nothing special
      ret = s
    }
    return ret
  })
}

// js的Date对象转timestamp
export function date2Timestamp (date) {
  return parseInt(date.getTime() / 1000)
}

// timestamp转js的Date对象
export function timestamp2Date (timestamp) {
  return new Date(timestamp * 1000)
}

// 时间字符串转timestamp
// date格式例子: '2006-01-02 15:04:05' 或 2016/01/02 15:04:05
// date 可以只有年，年月，年月日....不完整部分结果默认为对应部分的最小值，比如2006-01等价于2006-01-01 00:00:00
export function str2Timestamp (date) {
  date = date.replace(/-/g, '/')
  return date2Timestamp(new Date(date))
}
