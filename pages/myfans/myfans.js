const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

//--------------------------------------我的粉丝------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleStyle: {
      largeStyle: 'font-size:38rpx;color:#212832;font-weight:bold;',
      commonStyle: 'font-size:28rpx;color:#858C96;font-weight:normal;'
    },
    title1Style: '',
    title2Style: '',
    page: 1,
    pagesize: 20,
    fansNum1: 0,
    fansNum2: 0,
    type: 1,//type=0全部粉丝；type=1正式粉丝；type=2临时粉丝
    dataList: [],
    noMore: true,
    countText: '预锁粉丝'
  },

  //tabTitle点击
  tabClick(e) {
    this.tabChange(e.target.dataset.type)
  },

  //tabTitle点击变换
  tabChange(index) {
    switch (Number(index)) {
      case 1:
        this.setData({
          title1Style: this.data.titleStyle.largeStyle,
          title2Style: this.data.titleStyle.commonStyle,
          dataList: [],
          type: 1,
          page: 1,
          countText: '预锁粉丝'
        })
        break;
      case 2:
        this.setData({
          title1Style: this.data.titleStyle.commonStyle,
          title2Style: this.data.titleStyle.largeStyle,
          dataList: [],
          type: 2,
          page: 1,
          countText: '粉丝到期时间'
        })
        break;
    }
    this.getMyFansList(this.data.type)
  },

  //我的粉丝
  getMyFansList(type) {
    let that = this;
    let data = {
      user_id: wx.getStorageSync('userId'),
      type: type,
      page: that.data.page,
      pagesize: that.data.pagesize
    }
    API.getMyFansList(data, app).then(res => {
      console.log("粉丝", JSON.stringify(res))
      wx.stopPullDownRefresh()
      switch (type) {
        case 1:
          that.setData({
            fansNum1: res[0].count
          })
          break;
        case 2:
          that.setData({
            fansNum2: res[0].count
          })
          break;
      }
      if (that.data.type == type) {
        let list = res[0].list
        if (list.length < that.data.pagesize) {
          that.setData({
            dataList: that.data.dataList.concat(list),
            noMore: false
          })
        } else {
          that.setData({
            dataList: that.data.dataList.concat(list),
            noMore: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    this.setData({
      title1Style: this.data.titleStyle.largeStyle,
      title2Style: this.data.titleStyle.commonStyle
    })
    this.getMyFansList(1)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
    this.setData({
      dataList: []
    })
    this.getMyFansList(this.data.type)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.getMyFansList(this.data.type)
  },

})