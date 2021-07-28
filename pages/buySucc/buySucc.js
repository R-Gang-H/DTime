// pages/buySucc/buySucc.js
const API = require('../../utils/api')
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
    var orderType = options.order_type
    this.setData({
      order_type: options,// 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
      textCon: orderType == 1 ? '解读' : orderType == 2 ? '咨询' : orderType == 3 ? '学业提升' : orderType == 4 ? '测评' : orderType == 5 ? '21天训练营' : '严选'
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


  // 显示大图
  showImage: function (res) {
    let url = res.currentTarget.dataset.url;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
})