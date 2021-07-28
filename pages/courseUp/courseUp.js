// pages/courseUp/courseUp.js
const API = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gzhImg: API.gzhImg, // 公众号图片
    kefuImg: API.kefuImg, // 客服图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    util.updateMini()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 显示大图
  showImage: function (res) {
    let url = res.currentTarget.dataset.url;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },

})