const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

//---------------------------我的合伙人详情-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headUrl: '',
    userId: '',//合伙人id
    type: '',
    nickname: '',
    data: {}
  },

  getPartnerDetail() {
    let data = {
      user_id: wx.getStorageSync('userId')
    }
    API.getMyPartnerDetail(data, app).then(res => {
      let mData = res[0]
      mData.thisMonthfansOrderPrice = res[0].thisMonthfansOrderPrice / 100
      mData.lastMonthfansOrderPrice = res[0].lastMonthfansOrderPrice / 100
      mData.lastGroupOrderPrice = res[0].lastGroupOrderPrice / 100
      this.setData({
        data: mData
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    let mType = ''
    switch (Number(options.type)) {
      case 1:
        mType = '高级合伙人'
        break;
      case 2:
        mType = '初级合伙人'
        break;
      case 3:
        mType = '社群'
        break;
    }
    this.setData({
      headUrl: options.headurl,
      type: mType,
      nickname: options.nickname
    })
    this.getPartnerDetail()
  },

})