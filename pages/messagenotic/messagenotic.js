// pages/messagenotic/messagenotic.js
const API = require("../../utils/api.js")
const util = require("../../utils/util.js")

var app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cterm: 1,
    brl: 90
  },

  //切换顶部的筛选条件
  switchTerm: function (e) {
    let id = e.currentTarget.dataset.id;
    let brl = e.currentTarget.dataset.brl;
    let that = this;
    that.setData({
      cterm: parseInt(id),
      brl: parseInt(brl)
    })
    if (id == 1) {
      that.myMessageList();
    } else {
      that.sysMessageList();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    that.myMessageList();
  },

  // 上课详情
  toCourseUp: function (res) {
    let typeMsg = res.currentTarget.data.type
    if (typeMsg == 1) {
      wx.navigateTo({
        url: '../courseUp/courseUp',
      })
    } else if (typeMsg == 8) {
      wx.navigateTo({
        url: '/pages/unscramble/unscramble',
      })
    } else if (typeMsg == 9) {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    }
  },

  // 消息提醒
  myMessageList: function () {
    let data = {
      user_id: wx.getStorageSync('userId')
    }
    API.myMessageList(data, app).then(res => {
      console.log("消息提醒", JSON.stringify(res))
      // type=1购买成功，2开团，3一人参加你的团购，4团购圆满成功，5收入提醒，6升级成功提醒，7成功加入提醒，8预约服务，9反馈答复，10一人参加你的接龙 
      let mData = res
      this.setData({
        msgData: mData
      })
    })
  },

  // 系统消息列表
  sysMessageList: function () {
    let data = {
      user_id: wx.getStorageSync('userId')
    }
    API.sysMessageList(data, app).then(res => {
      console.log("系统消息列表", JSON.stringify(res))
      let mData = res
      this.setData({
        msgData: mData
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})