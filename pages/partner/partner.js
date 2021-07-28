const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

let app = getApp();

let that;
//---------------------------合伙人商城-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cterm: 2,
    brl: 94,
    page: 1,
    pagesize: 20,
    pageCount: 20,
    dataList: [],
    noMore: false,
    age: "",
    tag_base: "",
    tag_xg: "",
    tag_tf: "",
    tag_xxfg: "",
    HOMESHAREIMG: API.HOMESHAREIMG,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log('options==' + JSON.stringify(options))
    util.updateMini()
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

    let isQudao = wx.getStorageSync('isQudao') // 身份权限
    console.log("权限：" + JSON.stringify(isQudao))

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2, //这个数字是当前页面在tabBar中list数组的索引
        isQudao: isQudao == 1,// 是合伙人
      })
    }

    var authUserInfo = wx.getStorageSync('authUserInfo');
    if (authUserInfo) {
      that.setData({
        hasToken: true,
      })
      switch (that.data.cterm) {
        case 1:
          that.getInvite()
          break;
        case 2:
          that.getBelong()
          break;
        case 3:
          that.getcourse()
          break;
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '现在去登录吗？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/authUserInfo/authUserInfo',
            })
          } else if (res.cancel) {
            console.log("返回上一页")
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
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
    switch (this.data.cterm) {
      case 1:
        this.getInvite()
        break;
      case 2:
        this.getBelong()
        break;
      case 3:
        this.getcourse()
        break;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    switch (this.data.cterm) {
      case 1:
        this.getInvite()
        break;
      case 2:
        this.getBelong()
        break;
      case 3:
        this.getcourse()
        break;
    }
  },

  ///切换顶部的筛选条件
  switchTerm: function (e) {
    let id = e.currentTarget.dataset.id;
    let brl = e.currentTarget.dataset.brl;
    let that = this;
    that.setData({
      cterm: parseInt(id),
      brl: parseInt(brl),
      dataList: [],
      page: 1
    })
    switch (this.data.cterm) {
      case 1:
        this.getInvite()
        break;
      case 2:
        this.getBelong()
        break;
      case 3:
        this.getcourse()
        break;
    }
  },

  //合伙人邀请
  getInvite() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: this.data.page,
      pagesize: this.data.pagesize
    }
    if (that.data.page == 1) {
      that.setData({
        dataList: []
      })
    }
    API.getInvite(data, app).then(res => {
      wx.stopPullDownRefresh()

      let mData = res
      console.log("邀请合伙人", JSON.stringify(mData))
      if (mData.length < this.data.pagesize) {
        this.setData({
          noMore: false
        })
      } else {
        this.setData({
          noMore: true
        })
      }
      this.setData({
        dataList: this.data.dataList.concat(mData)
      })
    })
  },

  //专属
  getBelong() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: this.data.page,
      pagesize: this.data.pagesize
    }
    if (that.data.page == 1) {
      that.setData({
        dataList: []
      })
    }
    API.getBelong(data, app).then(res => {
      wx.stopPullDownRefresh()

      let mData = res
      console.log("专属", JSON.stringify(mData))
      if (mData.length < this.data.pagesize) {
        this.setData({
          noMore: false
        })
      } else {
        this.setData({
          noMore: true
        })
      }
      this.setData({
        dataList: this.data.dataList.concat(mData)
      })
    })
  },

  //好课
  getcourse() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: this.data.page,
      pageCount: this.data.pageCount,
      age: this.data.age,
      tag_base: this.data.tag_base,
      tag_xg: this.data.tag_xg,
      tag_tf: this.data.tag_tf,
      tag_xxfg: this.data.tag_xxfg
    }
    if (that.data.page == 1) {
      that.setData({
        dataList: []
      })
    }
    API.getProductList(data, app).then(res => {
      wx.stopPullDownRefresh()

      let mData = res.list
      console.log("好课", JSON.stringify(mData))
      if (mData.length < this.data.pagesize) {
        this.setData({
          noMore: false
        })
      } else {
        this.setData({
          noMore: true
        })
      }
      this.setData({
        dataList: this.data.dataList.concat(mData),
      })
    })
  },

  shai: function () {
    wx.navigateTo({
      url: '/pages/yanxuan/yanxuanFiltrate/yanxuanFiltrate',
    })
  },

  //点击搜索条
  tosearch: function () {
    wx.navigateTo({
      url: '/pages/partnerSearch/partnerSearch',
    })
  },

  toRepterDetail: function (e) {
    var item = e.currentTarget.dataset.item
    console.log("详情" + JSON.stringify(item))
    if (that.data.cterm == 3) {
      wx.navigateTo({
        url: '/pages/courseDetail/courseDetail?courseId=' + item.id + "&openType=" + 2,// 1:商品详情 2:推荐朋友、三人团
      })
    } else {
      wx.navigateTo({
        url: '/pages/assessDetail/assessDetail?detail=' + JSON.stringify(item),
      })
    }
  },

  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '天赋教育TOP',
      imageUrl: that.data.HOMESHAREIMG,
      path: '/pages/partner/partner'
    }
  },

})