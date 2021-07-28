const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

//---------------------------------查看测评报告-------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    pagesize: 20,
    noMore: false,
    type: 1,
    listmarginbottom: 0,
    data: {},
    report_id: '',
    title: ''
  },

  //获取数据
  getList() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: this.data.page,
      pagesize: this.data.pagesize,
      report_id: this.data.report_id
    }
    API.getReportList(data, app).then(res => {
      console.log("解读报告", JSON.stringify(res))
      let mData = res.myreport // 待解读报告
      switch (parseInt(mData.sex)) {
        case 0:
          mData.sex = "未知"
          break;
        case 1:
          mData.sex = "男"
          break;
        case 2:
          mData.sex = "女"
          break;
      }
      let list = []
      list = res.list // 相关报告
      if (list.length > 0) {
        list.forEach(element => {
          switch (parseInt(element.sex)) {
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
        data: mData,
        dataList: this.data.dataList.concat(list)
      })
    })
  },

  //完成解读
  finish() {
    wx.showModal({
      title: '提示',
      content: '确定完成解读？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          API.finishRead({ report_id: this.data.report_id }, app).then(res => {
            wx.showToast({
              title: '解读已完成',
              icon: 'none'
            })
            let page = getCurrentPages()
            let lastPage = page[page.length - 2]
            lastPage.setData({
              reload: true
            })
            wx.navigateBack({
              delta: 1,
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 评测报告
  report: function (e) {
    var item = e.currentTarget.dataset.item
    console.log("测评报告", item.report_id)
    wx.navigateTo({
      url: '../report/reportResult/reportResult?typeUlr=1&reportId=' + item.report_id,
    })
  },

  // 专家解读报告  大数据解读
  bigdata: function (e) {
    var item = e.currentTarget.dataset.item
    console.log("专家报告", item.report_id)
    wx.navigateTo({
      url: '../report/reportResult/reportResult?typeUlr=3&reportId=' + item.report_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    let bottom = 0
    if (options.type == 1) {
      bottom = 160
    }
    this.setData({
      type: options.type,
      listmarginbottom: bottom,
      report_id: options.report_id,
      title: options.type == 2 ? '已完成解读' : '待解读报告'
    })
    this.getList()
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