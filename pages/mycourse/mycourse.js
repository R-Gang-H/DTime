// pages/mycourse/mycourse.js
const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

var app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore: true,
    current: 1,
  },

  //去评价点击
  qpj(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../studyFeedback/studyfeedback?item=' + JSON.stringify(item),
    })
  },

  // 上课详情
  toCourseUp: function (res) {
    wx.navigateTo({
      url: '../courseUp/courseUp',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
  },

  //获取我的课程
  getUserCourse() {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');
    var current = that.data.current;
    if (current == 1) {
      that.setData({
        newMyCourse: []
      })
    }
    let data = {
      user_id: userId,
      page: current,
      pageSize: 15,
    }
    API.getUserCourse(data, app).then(res => {
      // 关闭下来刷新
      wx.stopPullDownRefresh()
      console.log(JSON.stringify(res.list))

      res.list.forEach(item => {
        that.data.newMyCourse.push(item)
      })

      that.setData({
        userCourses: that.data.newMyCourse,
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
      })

      if (that.data.userCourses.length < 15 || that.data.pages <= that.data.current) {
        that.setData({
          hasmore: false,
        })
      }
      wx.hideLoading();
      // 无数据时显示空页面
      if (that.data.userCourses.length <= 0) {
        that.setData({
          hasmore: false,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.getUserCourse();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      current: 1
    })
    this.getUserCourse()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var curpage = that.data.current + 1;
    that.setData({
      current: curpage,
    })
    console.log("总页数", that.data.pages)

    if (curpage <= that.data.pages) {
      that.getUserCourse()
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },


})