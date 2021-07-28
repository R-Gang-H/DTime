// pages/topic/topic.js
const API = require('../../utils/api.js')
const utils = require('../../utils/util.js')
let app = getApp();

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ansIndex: 1,// 答到第几题了
    ansJson: [], // 测试答案
    ansComplate: false,// 答完了
    ansLength: 1,// 共多少题
    defCheck: false,// 默认没选择
    ansIdGroup: [],// 多选答案置为空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    utils.updateMini()
    that.setData({
      reportId: options.reportId, // 测评Id
    })
    // 关闭页面保存数据答题进度
    var ansIndex = wx.getStorageSync(options.reportId)
    setTimeout(function () {
      var dtIndex = ansIndex[0];
      var dtDanAn = ansIndex[1];
      console.log("上次答题进度==>" + dtIndex)
      console.log("上次答题答案==>" + dtDanAn)
      that.setData({
        ansIndex: dtIndex ? dtIndex : 1,// 上次答到第几题
        ansJson: dtDanAn ? dtDanAn : [],// 上次答到第几题
      })
      that.getTestQuestion();
    }, 500);

  },

  // 获取测试题目
  getTestQuestion() {
    API.getTestQuestion({
      report_id: that.data.reportId,
    }, app).then(res => {
      // console.log("全部题" + JSON.stringify(res))
      var ansQues = res[parseInt(that.data.ansIndex - 1)]
      that.setData({
        question: res,// 全部题
        ansQues: ansQues,// 某一题
        ansComplate: that.data.ansIndex == res.length,// 是否全部答完
        ansType: ansQues.type,// type:1单选,2多选,3和4文字描述
        ansLength: res.length,// 一共多少题
      })
    }).catch(() => {

    });
  },

  //单选
  radioChange(e) {
    var ansId = e.detail.value;
    console.log('radio选项值为：', ansId)
    that.setData({
      ansIdRodio: ansId
    })
  },

  //多选
  checkboxChange(e) {
    var ansId = e.detail.value;
    console.log('checkbox选项值为：', ansId)

    that.setData({
      ansIdGroup: []
    })

    const items = that.data.ansQues//当前项

    if (items.ans.length) {

      for (let i = 0, lenI = items.ans.length; i < lenI; i++) {
        items.ans[i].checked = false

        for (let j = 0, lenJ = ansId.length; j < lenJ; j++) {

          if (items.ans[i].id == ansId[j]) {
            items.ans[i].checked = true
            // that.data.ansIdGroup.splice(i,1); // 从索引i开始，删除长度为1
            that.data.ansIdGroup.push(ansId[j])
            break
          }

        }

      }

    }

    that.setData({
      ansIdGroup: that.data.ansIdGroup,
      ansQues: items,
    })
    console.log('ansIdGroup checkbox选项值为：', that.data.ansIdGroup)
  },

  //文本
  bindTextAreaInput: function (e) {
    var ansTxt = e.detail.value;
    console.log('文本内容值为：', ansTxt)
    that.setData({
      ansIdText: ansTxt
    })
  },

  // 上一题
  lastTopic() {
    var tid = that.data.ansQues.id;// 题目id
    var anstion = '';
    var cid;
    if (that.data.ansType == 1) {// type:1单选,2多选,3和4文字描述
      cid = String(that.data.ansIdRodio);// 选项id
      anstion = '{' + tid + ':' + cid + '}'
    } else if (that.data.ansType == 2) {
      cid = String(that.data.ansIdGroup);// 选项id
      anstion = '{' + tid + ':' + cid + '}'
    } else {
      cid = String(that.data.ansIdText);// 内容
      anstion = '{' + tid + ':' + cid + '}'
    }

    if (cid && cid.length > 0) {
      if (that.data.ansJson[parseInt(that.data.ansIndex - 1)]) {// 下页已有值
        that.data.ansJson[parseInt(that.data.ansIndex - 1)] = anstion
      } else {
        that.data.ansJson.push(anstion)
      }
    } else {
      // TODO
      anstion = '{' + tid + ':' + 999999 + '}'
      that.data.ansJson.push(anstion)
      // TODO
      // wx.showToast({
      //   title: '请答题',
      // })
      // return
    }

    that.setData({
      ansIndex: --that.data.ansIndex,// 答到第几题了
    })

    var ansQues = that.data.question[parseInt(that.data.ansIndex - 1)]

    that.setData({
      ansType: ansQues.type,// type:1单选,2多选,3和4文字描述
    })

    if (that.data.ansJson[parseInt(that.data.ansIndex - 1)]) {// 上页已有值
      var ansIndexJson = that.data.ansJson[parseInt(that.data.ansIndex - 1)]
      console.log("上页值==" + ansIndexJson.split(':'))
      var cid = String(ansIndexJson.split(':')[1].replace('}', ''));
      if (that.data.ansType == 1) {
        that.setData({
          ansIdRodio: cid,// 单选答案置为空
        })
      } else if (that.data.ansType == 2) {

        const items = ansQues//当前项
        if (items.ans.length) {
          for (let i = 0, lenI = items.ans.length; i < lenI; i++) {
            items.ans[i].checked = false
            for (let j = 0, lenJ = cid.split(",").length; j < lenJ; j++) {
              if (items.ans[i].id == cid.split(",")[j]) {
                items.ans[i].checked = true
                break
              }
            }
          }
        }

        that.setData({
          ansIdGroup: [cid],// 多选答案置为空
          ansQues: items
        })
      } else {
        that.setData({
          ansIdText: cid // 内容
        })
      }
    } else {
      that.setData({
        defCheck: false,// 默认没选择
        ansIdRodio: '',// 单选答案置为空
        ansIdGroup: [],// 多选答案置为空
        ansIdText: '',// 内容
      })
    }

    that.setData({
      ansJson: that.data.ansJson,
      ansQues: ansQues,// 某一题
      ansComplate: that.data.ansIndex == that.data.question.length,// 是否全部答完
    })
  },

  // 下一题
  lowerTopic() {
    var tid = that.data.ansQues.id;// 题目id
    var anstion = '';
    var cid = '';
    if (that.data.ansType == 1) {// type:1单选,2多选,3和4文字描述
      cid = String(that.data.ansIdRodio);// 选项id
      anstion = '{' + tid + ':' + cid + '}'
    } else if (that.data.ansType == 2) {
      cid = String(that.data.ansIdGroup);// 选项id
      anstion = '{' + tid + ':' + cid + '}'
    } else {
      cid = String(that.data.ansIdText);// 内容
      anstion = '{' + tid + ':' + cid + '}'
    }

    if (cid && cid.length > 0) {
      if (that.data.ansJson[parseInt(that.data.ansIndex - 1)]) {// 上页已有值
        that.data.ansJson[parseInt(that.data.ansIndex - 1)] = anstion
      } else {
        that.data.ansJson.push(anstion)
      }
    } else {
      wx.showToast({
        title: '请答题',
      })
      return
    }

    that.setData({
      ansIndex: ++that.data.ansIndex,// 答到第几题了
    })

    var ansQues = that.data.question[parseInt(that.data.ansIndex - 1)]
    console.log("ansQues===", ansQues)

    that.setData({
      ansType: ansQues.type,// type:1单选,2多选,3和4文字描述
    })

    if (that.data.ansJson[parseInt(that.data.ansIndex - 1)]) {// 下页已有值
      var ansIndexJson = that.data.ansJson[parseInt(that.data.ansIndex - 1)]
      console.log('ansIndexJson===', ansIndexJson)
      // TODO
      if (ansIndexJson.indexOf("999999") < 0) {
        // TODO

        console.log("下页值==" + ansIndexJson.split(':'))
        var cid = ansIndexJson.split(':')[1].replace('}', '');
        if (that.data.ansType == 1) {
          that.setData({
            ansIdRodio: cid,// 单选答案置为空
          })
        } else if (that.data.ansType == 2) {

          const items = ansQues//当前项
          if (items.ans.length) {
            for (let i = 0, lenI = items.ans.length; i < lenI; i++) {
              items.ans[i].checked = false
              for (let j = 0, lenJ = cid.split(",").length; j < lenJ; j++) {
                if (items.ans[i].id == cid.split(",")[j]) {
                  items.ans[i].checked = true
                  break
                }
              }
            }
          }

          that.setData({
            ansIdGroup: [cid],// 多选答案置为空
            ansQues: items
          })
        } else {
          that.setData({
            ansIdText: cid,// 内容
          })
        }
        // DOTO

      } else {
        that.setData({
          defCheck: false,// 默认没选择
          ansIdRodio: '',// 单选答案置为空
          ansIdGroup: [],// 多选答案置为空
          ansIdText: '',// 内容
        })
      }
      // DOTO
    } else {
      that.setData({
        defCheck: false,// 默认没选择
        ansIdRodio: '',// 单选答案置为空
        ansIdGroup: [],// 多选答案置为空
        ansIdText: '',// 内容
      })
    }

    that.setData({
      ansJson: that.data.ansJson,
      ansQues: ansQues,// 某一题
      ansComplate: that.data.ansIndex == that.data.question.length,// 是否全部答完
    })
  },

  //提交测试
  submitTest() {

    var tid = that.data.ansQues.id;// 题目id
    var anstion = '';
    var cid = '';
    if (that.data.ansType == 1) {// type:1单选,2多选,3和4文字描述
      cid = String(that.data.ansIdRodio);// 选项id
      anstion = '{' + tid + ':' + cid + '}'
    } else if (that.data.ansType == 2) {
      cid = String(that.data.ansIdGroup);// 选项id
      anstion = '{' + tid + ':' + cid + '}'
    } else {
      cid = (that.data.ansIdText);// 内容
      anstion = '{' + tid + ':' + cid + '}'
    }

    if (cid && cid.length > 0) {
      if (that.data.ansJson[parseInt(that.data.ansIndex - 1)]) {// 上页已有值
        that.data.ansJson[parseInt(that.data.ansIndex - 1)] = anstion
      } else {
        that.data.ansJson.push(anstion)
      }
    } else {
      wx.showToast({
        title: '请答题',
      })
      return
    }

    // var array = ["{57:234}", "{58:238}", "{59:242}", "{60:246}", "{61:250}", "{62:254}", "{63:258}", "{64:261}", "{65:265}", "{66:269}", "{67:273}", "{68:277}", "{69:281}", "{70:285}", "{71:289}", "{72:293}", "{73:297}", "{74:301}", "{75:306}", "{76:311}", "{77:316}", "{78:321}", "{79:326}", "{80:331}", "{81:336}", "{82:341}", "{83:346}", "{84:351}", "{85:356}", "{86:361}", "{87:366,367,368,369,370}", "{88:372,373,374,375,376}", "{89:378,379,380,381,382}", "{90:384,385,386,387,388}", "{91:390,391,392,393,394}", "{92:396,397,398,399,400}", "{93:402,403,404,405,406}", "{94:408,409,410,411,412}", "{95:414,415,416,417,418}", "{96:420,421,422,423,424}", "{97:426,427,428,429,430}"];

    var arrStr = utils.toJsonFormat(that.data.ansJson)
    // var arrStr = utils.toJsonFormat(array)
    // console.log("数组转JSON===" + arrStr)

    // console.log("数组转JSON=======" + JSON.parse(array))

    API.submitTest({
      report_id: that.data.reportId,
      ansjson: JSON.parse(arrStr)
    }, app).then(res => {
      console.log("测试提交成功==" + JSON.stringify(res))
      wx.redirectTo({
        url: '../testResult/testResult?reportId=' + that.data.reportId,
      })
    }).catch((res) => {
      console.log(JSON.stringify(res))
    });
  },

  onHide: function () {
    var data = [that.data.ansIndex, that.data.ansJson]
    // 关闭页面保存数据答题进度
    wx.setStorageSync(that.data.reportId, data)
  },

  onUnload: function (options) {
    var data = [that.data.ansIndex, that.data.ansJson]
    // 关闭页面保存数据答题进度
    wx.setStorageSync(that.data.reportId, data)
  },


})