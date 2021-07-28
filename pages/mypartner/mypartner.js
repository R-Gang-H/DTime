const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

let that;
//---------------------------------我的合伙人页面-------------------------------
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
    title3Style: '',
    data: {},
    dataList: [],
    page: 1,
    pagesize: 20,
    noMore: true,
    type: 1,//1高级 2初级 3社群
    isTo: true,// 防连点
  },

  //item点击
  itemClick(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../mypartnerdetail/mypartnerdetail?headurl=' + item.headimgurl + '&nickname=' + item.nickname + '&type=' + that.data.type
    })
  },

  //获取列表数据
  getDataList() {
    if (that.data.page == 1) {
      that.setData({
        dataList: []
      })
    }
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: that.data.page,
      pagesize: that.data.pagesize
    }
    console.log("我的合伙人", data)
    API.getMyPartnerList(data, app).then(res => {
      let list = []
      switch (that.data.type) {
        case 1:
          list = res[0].superPartnerList
          break;
        case 2:
          list = res[0].primaryPartnerList
          break;
        case 3:
          list = res[0].myGroupList
          break;
      }
      if (list.length < that.data.pagesize) {
        that.setData({
          data: res[0],
          dataList: that.data.dataList.concat(list),
          noMore: false
        })
      } else {
        that.setData({
          data: res[0],
          dataList: that.data.dataList.concat(list),
          noMore: true
        })
      }
    })
  },

  //tabTitle点击
  tabClick(e) {
    that.tabChange(e.target.dataset.type)
  },

  //tabTitle点击变换
  tabChange(index) {
    if (that.data.isTo) {
      that.setData({
        isTo: false,
      })

      switch (Number(index)) {
        case 1:
          that.setData({
            title1Style: that.data.titleStyle.largeStyle,
            title2Style: that.data.titleStyle.commonStyle,
            title3Style: that.data.titleStyle.commonStyle,
            dataList: [],
            type: 1,
            page: 1
          })
          break;
        case 2:
          that.setData({
            title1Style: that.data.titleStyle.commonStyle,
            title2Style: that.data.titleStyle.largeStyle,
            title3Style: that.data.titleStyle.commonStyle,
            dataList: [],
            type: 2,
            page: 1
          })
          break;
        case 3:
          that.setData({
            title1Style: that.data.titleStyle.commonStyle,
            title2Style: that.data.titleStyle.commonStyle,
            title3Style: that.data.titleStyle.largeStyle,
            dataList: [],
            type: 3,
            page: 1
          })
          break;
      }
      that.getDataList()

      setTimeout(function () {
        that.setData({
          isTo: true,
        })
      }, 500)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    that.setData({
      title1Style: that.data.titleStyle.largeStyle,
      title2Style: that.data.titleStyle.commonStyle,
      title3Style: that.data.titleStyle.commonStyle
    })
    that.getDataList()
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
    that.setData({
      page: 1,
      dataList: []
    })
    that.getDataList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    that.setData({
      page: that.data.page + 1
    })
    that.getDataList()
  },

})