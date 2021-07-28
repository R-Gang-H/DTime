const API = require("../../utils/api.js")
const util = require("../../utils/util.js")

let app = getApp();

var that;
//---------------------------提问与意见-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    focus: false,
  },

  //提交
  submit(e) {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');

    let data = {
      user_id: userId,
      content: that.data.inputText,
    }
    API.feedback(data, app).then(res => {

      console.log("反馈提问", JSON.stringify(res))

      wx.hideLoading();

      wx.showToast({
        title: '意见已反馈',
      })
      that.getUserFeedbackList()
    })
  },

  getUserFeedbackList: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');

    let data = {
      user_id: userId,
      page: 1,
      pagesize: 999,
    }
    API.getUserFeedbackList(data, app).then(res => {

      console.log("反馈提问列表", JSON.stringify(res.list))

      wx.hideLoading();

      that.setData({
        dataList: res.list,
        inputText: '',
      })

    })
  },

  //获取输入框内容
  getFeedback(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  //点击获取input焦点
  getFocus(e) {
    this.setData({
      focus: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    let authuser = wx.getStorageSync('authUserInfo');
    that = this;
    console.log('options==' + JSON.stringify(options)
      + "\n授权信息" + JSON.stringify(authuser))
    that.setData({
      nickName: authuser.nickName,
    })
    if (options.userId) {
      wx.setStorageSync('userId', options.userId);
    }
    if (options.nickName) {
      that.setData({
        nickName: options.nickName,
      })
    }
    that.getUserFeedbackList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})