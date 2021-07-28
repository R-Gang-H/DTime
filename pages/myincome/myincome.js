const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

//---------------------------我的收益-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    super: true,
    data: {}
  },

  //获取我的收益
  getMyBalance() {
    let data = {
      user_id: wx.getStorageSync('userId')
    }
    API.getMyBalance(data, app).then(res => {
      console.log("我的收益", JSON.stringify(res))
      let mData = res.balanceDetail
      mData.balance = res.balanceDetail.balance / 100
      mData.total_income = res.balanceDetail.total_income / 100
      mData.total_tuike = res.balanceDetail.total_tuike / 100
      mData.total_neitui = res.balanceDetail.total_neitui / 100
      mData.total_manage = res.balanceDetail.total_manage / 100
      mData.total_peiyu = res.balanceDetail.total_peiyu / 100
      this.setData({
        data: mData
      })
    })
  },

  //提现
  withdraw(e) {
    wx.navigateTo({
      url: '../withdraw/withdraw?balance=' + this.data.data.balance / 100,
    })
  },

  //1推课奖金 2内推奖金 3管理奖金 4培育奖金 5提现,  目前只有前四个
  detail(e) {
    let type = e.currentTarget.dataset.index
    console.log(type)
    if (type == 4 && !this.data.super) {
      wx.showToast({
        title: '培育奖金未解锁',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../incomeDetail/incomedetail?type=' + type,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.userId) {
      wx.setStorageSync('userId', options.userId);
    }
    util.updateMini()
    this.getMyBalance()
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