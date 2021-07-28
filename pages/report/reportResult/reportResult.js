// pages/reportResult/reportResult.js
const API = require('../../../utils/api.js')
const util = require('../../../utils/util.js')

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportUrl: API.baseUrl + '/admin/index/getTestReport/report_id/',
    zJiaUrl: API.baseUrl + '/admin/index/getAutoReport/report_id/',
    loading: true,      //地图背景未加载完，显示loading
    userId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    console.log(options)
    that.setData({
      typeUlr: options.typeUlr,
      reportId: options.reportId,
    })
    // 1测评报告 2网页
    if (options.typeUlr == 1) {
      that.setData({
        webUrl: that.data.reportUrl + options.reportId, // 测评Id   
      })
    }
    if (options.typeUlr == 2) {
      that.setData({
        webUrl: options.linkUrl, // 测评报告网址
      })
    }
    if (options.typeUlr == 3) {
      that.setData({
        userId: options.userId ? options.userId : wx.getStorageSync('userId'),
      })
      that.setData({
        webUrl: that.data.zJiaUrl + options.reportId + '/user_id/' + that.data.userId, // 专家解读网址
      })
    }

  },

  /**
    * 图片加载完成方法
    */
  _imgLoadEvent: function (event) {
    console.log("加载成功", JSON.stringify(event))
    this.setData({
      loading: false
    })
  },

  _imgErrorEvent: function (event) {
    console.log("加载失败", JSON.stringify(event) + '\n' + new Date())
  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    return {
      title: '测评报告',
      path: '/pages/report/reportResult/reportResult?typeUlr=' + this.data.typeUlr + '&reportId=' + this.data.reportId + '&userId=' + this.data.userId,
    }
  },

  onShareTimeline: function () {
    return {
      title: '测评报告',
      query: '/pages/report//reportResult/reportResult?typeUlr=' + this.data.typeUlr + '&reportId=' + this.data.reportId + '&userId=' + this.data.userId,
    }
  }

})