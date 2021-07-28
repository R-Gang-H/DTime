// pages/userAgree/userAgree.js
const API = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userXieyiUrl: API.baseUrl + '/admin/index/getUserXieyi',
    loading: true,      //地图背景未加载完，显示loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", JSON.stringify(options))
    util.updateMini()
    this.setData({
      urlType: options.urlType, // 1关于我们 2用户协议
    })
  },

  /**
    * 图片加载完成方法
    */
  _imgLoadEvent: function (event) {
    this.setData({
      loading: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})