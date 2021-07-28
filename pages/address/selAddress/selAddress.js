// pages/Address/Address.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js');

const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore: true,
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
  },

  // 获取我的收货地址
  getUserAddress() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');
    var current = that.data.current;
    if (current == 1) {
      that.setData({
        newUserAddress: []
      })
    }
    API.getUserAddress({
      user_id: userId,
      page: current,
      pageSize: 15,
    }, app).then(res => {
      // 关闭下来刷新
      wx.stopPullDownRefresh()
      console.log(JSON.stringify(res))

      res.forEach(item => {
        that.data.newUserAddress.push(item)
      })

      that.setData({
        userAddress: that.data.newUserAddress,
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
      })

      if (that.data.userAddress.length < 15 || that.data.pages <= that.data.current) {
        that.setData({
          hasmore: false,
        })
      }
      wx.hideLoading();
      // 无数据时显示空页面
      if (that.data.userAddress.length <= 0) {
        that.setData({
          hasmore: false,
        })
      }

    }).catch(() => {

    });
  },

  // 选择地址
  backHome: function (res) {
    var itemAdd = res.currentTarget.dataset.itemadd
    var pages = getCurrentPages(); // 获取页面栈
    console.log("页面", getCurrentPages())
    if (pages.length > 1) {
      //上一个页面实例对象
      pages.forEach(item => {
        // route: "pages/yanxuan/yanxuanMain/yanxuanMain"
        if (item.route.indexOf('courseDetail/courseDetail') >= 0 || item.route.indexOf('groupDetail/groupDetail') >= 0 || item.route.indexOf('groupThreeDetail/groupThreeDetail') >= 0) {// 包含
          var prePage = item
          //关键在这里  changeData为上一页的方法
          var yjAddress = itemAdd.province + itemAdd.city + itemAdd.area + itemAdd.address
          prePage.changeAddress(yjAddress, itemAdd.id)
          //返回上一页
          wx.navigateBack({
            delta: 1
          })
        }
      });

    }
  },

  // 新增或者编辑
  newEditAddress: function (res) {
    var addType = res.currentTarget.dataset.addtype;
    var addInfo;
    if (addType == 2) {
      addInfo = res.currentTarget.dataset.item;
    }
    console.log("1是新增2是编辑", addType)
    wx.navigateTo({
      url: '../editAddress/editAddress?addType=' + addType + "&addInfo=" + JSON.stringify(addInfo),
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      current: 1
    })
    that.getUserAddress();
  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.setData({
      current: 1
    })
    this.getUserAddress()

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
      that.getUserAddress()
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

})