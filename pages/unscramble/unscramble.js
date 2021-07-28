const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

//---------------------------解读列表-----------------------------------------
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
    dataList: [],
    noMore: true,
    singleTop: 35,
    type: 1,//type1 未解读,2已解读
    reload: false
  },

  //查看报告
  look(e) {
    wx.navigateTo({
      url: '../evaluationReport/evaluationreport?type=' + this.data.type + '&report_id=' + this.data.dataList[e.currentTarget.dataset.index].report_id,
    })
  },

  //获取列表
  getList(type) {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: this.data.page,
      pagesize: this.data.pagesize,
      type: type
    }
    API.getHasBuyReadList(data, app).then(res => {
      console.log(JSON.stringify(res))
      let list = []
      list = res[0].list
      if (list.length > 0) {
        list.forEach(element => {
          switch (Number(element.sex)) {
            case 0:
              element.sex = "未知"
              break;
            case 1:
              element.sex = "男"
              break;
            case 2:
              element.sex = "女"
              break;
          }
        });
      }
      if (list.length < this.data.pagesize) {
        this.setData({
          noMore: false
        })
      } else {
        this.setData({
          noMore: true
        })
      }
      this.setData({
        dataList: this.data.dataList.concat(list)
      })
    })
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
          singleTop: 35
        })
        break;
      case 2:
        this.setData({
          title1Style: this.data.titleStyle.commonStyle,
          title2Style: this.data.titleStyle.largeStyle,
          dataList: [],
          type: 2,
          page: 1,
          singleTop: 0
        })
        break;
    }
    this.getList(this.data.type)
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
    if (options.userId) {
      wx.setStorageSync('userId', options.userId);
    }
    this.getList(this.data.type)
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
    if (this.data.reload) {
      this.setData({
        page: 1,
        dataList: [],
        reload: false
      })
      this.getList(this.data.type)
    }
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
    this.setData({
      page: 1,
      dataList: []
    })
    this.getList(this.data.type)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.getList(this.data.type)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})