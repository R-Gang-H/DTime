const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 删除数组中的某一个对象
 * @param arr {Array} 数组
 * @param obj {Object} 需要删除的对象
 * @returns {Array} 处理之后的数组
 */
const arrRemoveObj = (arr, obj) => {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i].order_id === obj) {
      if (i === 0) {
        arr.shift();
        return arr;
      } else if (i === len - 1) {
        arr.pop();
        return arr;
      } else {
        arr.splice(i, 1);
        return arr;
      }
    }
  }
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，Y/M/D h:m:s
 */
function getDateTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  if (number.length > 10) {
    date = new Date(number * 1000);
  }

  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

// 转换提交测评传参格式
function toJsonFormat(ansJson) {
  console.log(ansJson)

  var arrJson = ''
  for (let i = 0; i < ansJson.length; i++) {
    const element = ansJson[i];
    if (i == 0) {
      arrJson += '{'
    }

    var item = element.split(':')// 分割每项
    if (item) {
      arrJson += '\"'
      arrJson += item[0].replace('{', '')
      arrJson += '\"'
      arrJson += ':'
      if (item[1] && item[1].indexOf(',') >= 0) {// 数组
        // arrJson += '\"'
        arrJson += '['
        arrJson += item[1].replace('}', '')
        arrJson += ']'
        // arrJson += '\"'
      } else {// 单个
        arrJson += '\"'
        arrJson += item[1].replace('}', '')
        arrJson += '\"'
      }
      if (i < ansJson.length - 1) {
        arrJson += ','
      }

      if (i == ansJson.length - 1) {
        arrJson += '}'
      }

    }

  }
  var arrStr = JSON.stringify(arrJson)
  console.log("util 数组转JSON===" + JSON.parse(arrStr))
  return arrStr
}

// 时间戳转时分秒,传秒
function toTimeHMS(time) {
  var d, h, m, s, ms;
  d = Math.floor(time / 1000 / 60 / 60 / 24);
  h = Math.floor(time / 1000 / 60 / 60 % 24);
  m = Math.floor(time / 1000 / 60 % 60);
  s = Math.floor(leftTime / 1000 % 60);
  ms = Math.floor(leftTime % 1000);
  let timeStr = d + "天" + h + "时" + m + "分"
  return timeStr
}

//补零方法
function zeroFill(str, n) {
  // str为数字字符串 n为需要的位数，不够补零
  if (str.length < n) {
    str = '0' + str
  }
  return str
}

//把base64转换成图片
function getBase64ImageUrl(data) {
  /// 获取到base64Data
  var base64Data = data;
  /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
  base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
  /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
  const base64ImgUrl = "data:image/png;base64," + base64Data;
  /// 刷新数据
  return base64ImgUrl;
}

const fsm = wx.getFileSystemManager()
const FILE_BASE_NAME = 'tmp_base64src'// 
function base64src(base64data, cb) {
  // console.log('util1', base64data)
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || []
  if (!format) {
    console.log('util2', 'ERROR_BASE64SRC_PARSE')
    return (new Error('ERROR_BASE64SRC_PARSE'))
  }
  var timestamp = Date.parse(new Date());
  const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME + (timestamp / 1000)}.${format}`
  // console.log('util3', filePath)
  const buffer = wx.base64ToArrayBuffer(bodyData)
  // console.log('util4', buffer)
  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success() {
      cb(filePath)
    },
    fail() {
      return (new Error('ERROR_BASE64SRC_WRITE'))
    }
  })
}

// 版本更新
function updateMini() {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log('onCheckForUpdate====', res)
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        console.log('res.hasUpdate====')
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              console.log('success====', res)
              // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
          })
        })
      }
    })
  }
}

module.exports = {
  formatTime,
  toJsonFormat,
  getDateTime,
  toTimeHMS,
  zeroFill,
  arrRemoveObj,
  getBase64ImageUrl,
  base64src,
  updateMini,
}
