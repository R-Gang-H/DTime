// pages/myorder/myorder.js
const API = require("../../utils/api.js")
const util = require("../../utils/util.js")

var app = getApp();

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore: true,
    current: 1,
    cterm: 1,
    brl: 30,
    type: 1,// 类型：1=全部，2=待付款，3=拼团中，4=已完成
    showFkDetail: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    util.updateMini()
    that = this;
    that.setData({
      current: 1,
      type: options.orderType,
      cterm: options.orderType,
      brl: parseInt(options.brl),
    })
    if (options.userId) {
      wx.setStorageSync('userId', options.userId);
    }

  },

  //切换顶部的筛选条件
  switchTerm: function (e) {
    let id = e.currentTarget.dataset.id;
    console.log('switchTerm' + id)
    let brl = e.currentTarget.dataset.brl;
    let that = this;
    that.setData({
      cterm: parseInt(id),
      brl: parseInt(brl),
      type: parseInt(id),
      current: 1,
    })
    if (id > 0) {
      that.getUserOrderList();
    } else {
      that.setData({
        myOrders: '',
        hasmore: true,
      })
    }
  },

  // 课程详情
  toCourseDetail: function (res) {
    var courseId = res.currentTarget.dataset.id
    console.log(courseId)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + courseId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (that.data.type != 5) {
      that.getUserOrderList();
    } else {
      that.setData({
        myOrders: '',
        hasmore: true,
      })
    }
  },

  //获取我的课程
  getUserOrderList() {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');
    var current = that.data.current;
    if (current == 1) {
      that.setData({
        newMyOrder: []
      })
    }

    console.log("我的订单 type", that.data.type)
    let data = {
      user_id: userId,
      type: that.data.type,
      page: current,
      pageSize: 15,
    }
    API.getUserOrderList(data, app).then(res => {
      // 关闭下来刷新
      wx.stopPullDownRefresh()
      console.log("我的订单", JSON.stringify(res.list))

      res.list.forEach(item => {
        that.data.newMyOrder.push(item)
      })

      that.setData({
        myOrders: that.data.newMyOrder,
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
      })

      if (that.data.myOrders.length < 15 || that.data.pages <= that.data.current) {
        that.setData({
          hasmore: false,
        })
      }
      wx.hideLoading();
      // 无数据时显示空页面
      if (that.data.myOrders.length <= 0) {
        that.setData({
          hasmore: false,
        })
      }
    })
  },


  // 继续邀请
  conTinue: function (res) {
    var item = res.currentTarget.dataset.item
    var shareType = res.currentTarget.dataset.sharetype
    console.log("继续邀请", JSON.stringify(item) + "==" + shareType)
    this.setData({
      orderNumber: item.order_number,
      productName: item.product_name,
      productId: item.id,
      shareType: shareType,// 1继续邀请 2推荐好友
      showFkDetail: true,
    })
  },
  cancelFkDetail() {
    this.setData({
      showFkDetail: false,
    })
  },

  // 去删除
  toDel: function (res0) {
    wx.showModal({
      title: '提示',
      content: '确定删除该订单？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中...',
          })
          let userId = wx.getStorageSync('userId');
          var order_id = res0.currentTarget.dataset.order_id
          console.log("删除订单id", order_id)

          let data = {
            user_id: userId,
            order_id: order_id,
          }
          API.delOrder(data, app).then(res => {
            wx.hideLoading();
            console.log("删除订单", JSON.stringify(res.list))

            wx.showToast({
              title: '订单已删除',
              icon: 'success',
              duration: 2000
            })

            setTimeout(res => {
              // that.getUserOrderList();
              let myOrders = util.arrRemoveObj(that.data.newMyOrder, order_id)
              console.log("删除订单data", JSON.stringify(myOrders))
              that.setData({
                myOrders: myOrders,
              })

              if (that.data.myOrders.length < 15 || that.data.pages <= that.data.current) {
                that.setData({
                  hasmore: false,
                })
              }
              wx.hideLoading();
              // 无数据时显示空页面
              if (that.data.myOrders.length <= 0) {
                that.setData({
                  hasmore: false,
                })
              }

            }, 2000)


          }).catch(res => {
            wx.showToast({
              title: '删除失败',
              icon: 'success',
              duration: 2000
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

  // 去支付
  toPuy: function (res) {
    var order_number = res.currentTarget.dataset.order_number
    console.log("支付订单", order_number)
    app.pay(order_number, (suc) => {
      console.log(("支付成功" + JSON.stringify(suc)))
      that.getUserOrderList()
    }).catch((e) => {
      console.log((e))
    })
  },

  //去评价点击
  qpj(e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/studyFeedback/studyfeedback?item=' + JSON.stringify(item),
    })
  },

  // 上课详情
  toCourseUp: function (res) {
    wx.navigateTo({
      url: '/pages/courseUp/courseUp',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      current: 1
    })
    if (that.data.cterm != 5) {
      that.getUserOrderList();
    } else {
      wx.stopPullDownRefresh()
      that.setData({
        myOrders: '',
        hasmore: true,
      })
    }

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
      that.getUserOrderList()
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    console.log("分享信息", userId + "：" + that.data.productName + "：" + that.data.orderNumber)
    that.setData({
      showFkDetail: false,
    })
    if (that.data.shareType == 1) {// 继续邀请
      return {
        title: that.data.productName,
        path: '/pages/groupDetail/groupDetail?order_number=' + that.data.orderNumber + "&isPuySuc=2&shareId=" + userId,
      }
    } else if (that.data.shareType == 2) {
      return {
        title: that.data.productName,
        path: '/pages/courseDetail/courseDetail?courseId=' + that.data.productId + "&isPuySuc=2&shareId=" + userId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
      }
    }
  },

  onShareTimeline: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    that.setData({
      showFkDetail: false,
    })
    if (that.data.shareType == 1) {// 继续邀请
      return {
        title: that.data.productName,
        query: '/pages/groupDetail/groupDetail?order_number=' + that.data.orderNumber + "&isPuySuc=2&shareId=" + userId,
      }
    } else if (that.data.shareType == 2) {// 推荐好友
      return {
        title: that.data.productName,
        path: '/pages/courseDetail/courseDetail?courseId=' + that.data.productId + "&isPuySuc=2&shareId=" + userId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
      }
    }
  },

})