// pages/yanxuan/yanxuanAll/yanxuanAll.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

let app = getApp();

let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brl: 56,
    courses: [],
    haveMore: true,
    page: 1,
    ///1推荐2上新3销量
    orderBy: 1,
    age: "",
    tag_base: "",
    tag_xg: "",
    tag_tf: "",
    tag_xxfg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    util.updateMini()
    that.setData({
      tag_xg: options.tag_xg != 0 ? options.tag_xg : '',// 底层标签
      titleName: options.titleName,// 标题
    })

    wx.setNavigationBarTitle({
      title: that.data.titleName,
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
    let that = this;
    that.setData({
      courses: [],
      haveMore: true,
      page: 1
    })
    that.getProductList(1)

    console.log(this.data.age)
    console.log(this.data.tag_base)
    console.log(this.data.tag_xg)
    console.log(this.data.tag_tf)
    console.log(this.data.tag_xxfg)

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  ///切换顶部的筛选条件
  switchTerm: function (e) {
    let id = e.currentTarget.dataset.id;
    let brl = e.currentTarget.dataset.brl;
    let that = this;
    that.setData({
      orderBy: parseInt(id),
      brl: parseInt(brl),
      courses: [],
      haveMore: true,
      page: 1
    })
    that.getProductList(1)
  },

  ///获取课程
  getProductList: function (page) {
    let that = this;
    API.getProductList({
      page: page,
      pageCount: 10,
      orderBy: that.data.orderBy,
      age: that.data.age,
      tag_base: that.data.tag_base,
      tag_xg: that.data.tag_xg,
      tag_tf: that.data.tag_tf,
      tag_xxfg: that.data.tag_xxfg
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

  // 课程详情
  toCourseDetail: function (res) {
    var courseId = res.currentTarget.dataset.id
    console.log(courseId)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + courseId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
    })
  },

  shai: function () {
    wx.navigateTo({
      url: '/pages/yanxuan/yanxuanFiltrate/yanxuanFiltrate',
    })
  }
})