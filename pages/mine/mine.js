// pages/mine/mine.js
const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

var app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fansNum: 0, // 粉丝数
    superPartnerCount: 0, // 合伙人数
    userCourses: '', // 我的课程
    HOMESHAREIMG:API.HOMESHAREIMG,
  },

  //解读列表
  unscramble(e) {
    wx.navigateTo({
      url: '../unscramble/unscramble',
    })
  },

  //我的课程查看更多
  ckMore(e) {
    wx.navigateTo({
      url: '../mycourse/mycourse',
    })
  },

  //提问与意见
  feedback(e) {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  //累计总收益点击
  inCome(e) {
    wx.navigateTo({
      url: '../myincome/myincome',
    })
  },

  //当前粉丝数量点击
  myFans(e) {
    wx.navigateTo({
      url: '../myfans/myfans',
    })
  },

  //社群合伙人数点击
  myPartner(e) {
    wx.navigateTo({
      url: '../mypartner/mypartner',
    })
  },

  //关于我们点击
  aboutUs() {
    wx.navigateTo({
      url: '../aboutUs/aboutus?urlType=1',
    })
  },

  //申请成为xxx  1导师,2合伙人,3高级合伙人
  toApply(e) {
    let type = ''
    switch (e.currentTarget.dataset.type) {
      case 1:
        type = '3'
        break;
      case 2:
        type = '1'
        break;
      case 3:
        type = '2'
        break;
    }
    this.applyStatus(type)
  },

  //查询申请状态
  applyStatus(type) {//申请类型1=初级合伙人2=高级合伙人3=专家
    wx.showLoading({
      title: '查询中',
    })
    let data = {
      user_id: wx.getStorageSync('userId'),
      type: type
    }
    API.applyStatus(data, app).then(res => {
      console.log("申请状态", JSON.stringify(res))
      let info = res.info;
      wx.hideLoading()
      let mType = ''
      if (info) {
        switch (parseInt(type)) {
          case 1:
            switch (parseInt(info.status)) {//1=审核中 2=审核通过 3审核不通过
              case 1:
                mType = 6
                break;
              case 2:
                mType = 7
                break;
              case 3:
                mType = 2
                break;
            }
            break;
          case 2:
            mType = 3
            break;
          case 3:
            switch (parseInt(info.status)) {
              case 1:
                mType = 4
                break;
              case 2:
                mType = 5
                break;
              case 3:
                mType = 1
                break;
            }
            break;
        }
      }
      wx.navigateTo({
        url: '../apply/apply?type=' + type + "&mType=" + mType,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
  },

  //获取我的收益
  getMyBalance() {
    let data = {
      user_id: wx.getStorageSync('userId')
    }
    API.getMyBalance(data, app).then(res => {
      let mData = res.balanceDetail
      mData.balance = res.balanceDetail.balance / 100
      mData.total_income = res.balanceDetail.total_income / 100
      this.setData({
        balanceDetail: mData
      })
    })
  },

  //我的粉丝
  getMyFansList(type) {
    let data = {
      user_id: wx.getStorageSync('userId'),
      type: type,
      page: 1,
      pagesize: 9999
    }
    API.getMyFansList(data, app).then(res => {
      that.setData({
        fansNum: res[0].count
      })
    })
  },


  //我的合伙人
  getMyPartnerList() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: 1,
      pagesize: 9999
    }
    API.getMyPartnerList(data, app).then(res => {
      that.setData({
        superPartnerCount: res[0].myGroupCount,
      })
    })
  },

  //提现
  withdraw(e) {
    wx.navigateTo({
      url: '../withdraw/withdraw?balance=' + this.data.balanceDetail.balance,
    })
  },

  //获取我的-顶部数据
  getUserHeadData() {
    let data = {
      user_id: wx.getStorageSync('userId'),
    }
    API.getUserHeadData(data, app).then(res => {
      console.log("我的合伙人数据", JSON.stringify(res[0]))
      wx.setStorageSync('isQudao', res[0].is_qudao) // 刷新身份权限
      that.setData({
        userHeadData: res[0],
        qudaoLevel: res[0].qudao_level ? res[0].qudao_level : 1,
        isQudao: res[0].is_qudao == 1,// 是合伙人
      })
      wx.setStorageSync('qudaoLevel', that.data.qudaoLevel)
    })
  },

  //获取我的课程
  getUserCourse() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: 1,
      pagesize: 3
    }
    API.getUserCourse(data, app).then(res => {
      console.log("我的课程", JSON.stringify(res.list))
      that.setData({
        userCourses: res.list,
      })
    })
  },

  //是否有新消息
  hasNewMessage() {
    let data = {
      user_id: wx.getStorageSync('userId'),
    }
    API.hasNewMessage(data, app).then(res => {
      console.log("是否有新消息", JSON.stringify(res))
      that.setData({
        hasNew: res.hasNew,
      })
    })
  },

  //我的-查询我的订单数量
  getUserOrderCount() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      type: 2
    }
    API.getUserOrderCount(data, app).then(res => {
      console.log("是否有待付款", JSON.stringify(res))
      that.setData({
        orderNum2: res.count,
      })
    })
    // 类型：1=全部，2=待付款，3=拼团中，4=已完成
    let data1 = {
      user_id: wx.getStorageSync('userId'),
      type: 3
    }
    API.getUserOrderCount(data1, app).then(res => {
      console.log("是否有拼团中", JSON.stringify(res))
      that.setData({
        orderNum3: res.count,
      })
    })
  },

  // 消息通知
  toMessageNotic: function () {
    wx.navigateTo({
      url: '/pages/messagenotic/messagenotic',
    })
  },

  // 收藏列表
  toCollectList: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },

  //浏览记录
  toRecords() {
    wx.navigateTo({
      url: '../browsingRecords/browsingrecords',
    })
  },

  // 我的订单 查看全部
  toAllorder: function (res) {
    var orderType = res.currentTarget.dataset.type;
    var brl = res.currentTarget.dataset.brl;
    wx.navigateTo({
      url: '../myorder/myorder?orderType=' + orderType + "&brl=" + brl,
    })
  },

  getList() {
    let data = {
      user_id: wx.getStorageSync('userId'),
      page: 1,
      pagesize: 999,
      type: 1
    }
    API.getHasBuyReadList(data, app).then(res => {
      console.log(JSON.stringify(res))
      let count = res[0].count
      this.setData({
        orderNum4: count
      })
    })
  },

  //邀请免费测评
  toInviteFreeEvaluation: function (res) {
    wx.navigateTo({
      url: '../inviteFreeEvaluation/inviteFreeEvaluation?adultNum=' + that.data.userHeadData.cr_num + "&childrenNum=" + that.data.userHeadData.et_num,
    })
  },

  // 上课详情
  toCourseUp: function (res) {
    wx.navigateTo({
      url: '../courseUp/courseUp',
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
  onShow: function (options) {
    let isQudao = wx.getStorageSync('isQudao') // 身份权限
    console.log("权限：" + JSON.stringify(isQudao))
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3, //这个数字是当前页面在tabBar中list数组的索引
        isQudao: isQudao == 1,// 是合伙人
      })
    }

    var authUserInfo = wx.getStorageSync('authUserInfo');
    console.log("授权信息" + JSON.stringify(authUserInfo))
    that.setData({
      authuser: authUserInfo,
    })

    if (authUserInfo) {
      that.setData({
        hasToken: true,
      })
      that.getMyBalance();
      that.getMyFansList(0);
      that.getMyPartnerList();
      that.getUserHeadData();
      that.getUserCourse();
      that.hasNewMessage()
      that.getUserOrderCount()
      that.getList()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '天赋教育TOP',
      imageUrl: that.data.HOMESHAREIMG,
      path: '/pages/mine/mine'
    }
  },

})