const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

let that;
//---------------------------提现-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    price: 0
  },

  //提现
  submit(e) {
    let price = this.data.price
    if (price > this.data.balance) {
      wx.showToast({
        title: '提现金额不能超过当前余额',
        icon: 'none'
      })
      return
    }
    if (price < 3 / 10) {// 最小提现0.3
      wx.showToast({
        title: '提现金额不能小于0.3元',
        icon: 'none'
      })
      return
    }
    let data = {
      user_id: wx.getStorageSync('userId'),
      money: price * 100, // 分
    }
    console.log("传参", data)
    API.cashoutApply(data, app).then(res => {
      console.log("提现成功", JSON.stringify(res))
      wx.showToast({
        title: '提现成功',
      })
      setTimeout(function () {
        that.getMyBalance();
      }, 3000)
    })
  },

  //获取输入的金额
  getPrice(e) {
    this.setData({
      price: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    util.updateMini()
    this.setData({
      balance: options.balance
    })
  },

  //获取我的收益
  getMyBalance() {
    let data = {
      user_id: wx.getStorageSync('userId')
    }
    API.getMyBalance(data, app).then(res => {
      console.log("收益", JSON.stringify(res))
      let mData = res.balanceDetail
      mData.balance = res.balanceDetail.balance / 100
      this.setData({
        balanceDetail: mData,
        balance: mData.balance,
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
    that.getMyBalance()
  },

})