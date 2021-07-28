const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

//---------------------------收益明细-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    pageCount: 20,
    type: 1,
    noMore: true,
    detailType: ''
  },

  //获取明细
  getBalanceRecordByPage() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      type: this.data.type,
      page: this.data.page,
      pageCount: this.data.pageCount
    }
    if (this.data.page == 1) {
      this.setData({
        dataList: []
      })
    }
    API.getBalanceRecordByPage(data, app).then(res => {
      console.log("获取明细", JSON.stringify(res))
      let list = res
      if (list.length > 0) {
        list.forEach(element => {
          element.fee = element.fee / 100
        });
      }
      if (list.length < this.data.pageCount) {
        this.setData({
          dataList: this.data.dataList.concat(list),
          noMore: false
        })
      } else {
        this.setData({
          dataList: this.data.dataList.concat(list),
          noMore: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    this.setData({
      type: options.type
    })
    let title = ''
    let detailType = ''
    switch (Number(options.type)) {
      case 1:
        title = '推课奖金明细',
          detailType = '自购/锁粉/推课'
        break;
      case 2:
        title = '内推奖金明细'
        detailType = '内推'
        break;
      case 3:
        title = '管理奖金明细'
        detailType = '高级合伙人管理'
        break;
      case 4:
        title = '培育奖金明细'
        detailType = '合伙人内推/推课'
        break;
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      detailType: detailType
    })
    this.getBalanceRecordByPage()
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
    this.setData({
      page: 1,
      dataList: []
    })
    this.getBalanceRecordByPage()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.getBalanceRecordByPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})