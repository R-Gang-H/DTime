// pages/report/reportShare/reportShare.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

const app = getApp();

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
    util.updateMini()
    that.setData({
      reportId: options.reportId,
      isPuySuc: options.isPuySuc == 1,// 1:购买成功，2:参加
      shareId: options.shareId,// 分享用户
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙
    })
    that.getTestProduct();
  },

  // 获取测评商品id/价格
  getTestProduct() {

    API.getTestProduct({
      type: 1
    },app).then(res => {
      // (分)
      console.log("测评商品id/价格" + JSON.stringify(res))
      that.setData({
        testProduct: res[0]
      })
    }).catch(() => {
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var authUserInfo = wx.getStorageSync('authUserInfo');
    if (authUserInfo) {
      that.setData({
        hasToken: true,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 已登录立即参加
    if (that.data.hasToken) {
      return {
        title: that.data.courseDetail.product_name,
        path: '/pages/report/reportShare/reportShare?reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
      }
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=5&reportId=' + that.data.courseDetail.id,// 报告id
      })
    }
  }
})