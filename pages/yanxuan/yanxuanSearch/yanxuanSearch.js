// pages/yanxuan/yanxuanSearch/yanxuanSearch.
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
    haveMore: true,
    page: 1,
    keywords: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    // this.getProductList(1);
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
    let that = this;
    that.setData({
      courses: [],
      haveMore: true,
      page: 1
    })
    that.getProductList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.haveMore == true) {
      that.getProductList(that.data.page)
    }
  },

  ///获取热门课程
  getProductList: function (page) {
    let that = this;
    API.getProductList({
      page: page,
      pageCount: 10,
      keywords: that.data.keywords
    }, app).then(res => {
      wx.stopPullDownRefresh({})
      let haveMore = true;
      let courses = that.data.courses || [];
      let page = that.data.page;
      if (res.list.length >= 10) {
        ///说明有可能还有下一页数据
        haveMore = true;
        page += 1;
      } else {
        ///已经加载全部数据
        haveMore = false;
      }
      let newCourses = courses.concat(res.list)

      that.setData({
        haveMore: haveMore,
        courses: newCourses,
        page: page
      })
    }).catch(() => {

    });
  },

  // 取消
  cancel: function () {
    this.setData({
      haveMore: false,
      courses: [],
      page: 1,
      keywords: ''
    })
  },

  // 搜索
  search: function (e) {
    console.log(e)
    let that = this;
    that.setData({
      courses: [],
      haveMore: true,
      page: 1,
      keywords: e.detail.value
    })
    that.getProductList(1)
  },


  // 课程详情
  toCourseDetail: function (res) {
    var courseId = res.currentTarget.dataset.id
    console.log(courseId)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + courseId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
    })
  },
})