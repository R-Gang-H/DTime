// pages/textResult/textResult.js
const util = require('../../utils/util.js')

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    util.updateMini()
    that.setData({
      reportId: options.reportId, // 测评Id
    })

    setTimeout(function () {
      wx.redirectTo({
        url: '../report/reportResult/reportResult?typeUlr=1&reportId=' + that.data.reportId,
      })
    }, 5000)

  },

})