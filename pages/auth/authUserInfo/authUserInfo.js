// pages/auth/authUserInfo/authUserInfo.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

const app = getApp()
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasToken: '',      // 判断是否登录
    phoneNumber: true, // 手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options))
    util.updateMini()
    that = this
    that.setData({
      shareId: options.shareId,
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙 7：三人团 8：邀请测
      orderNumber: options.order_number,
      product_id: options.id,// 产品Id
      reportId: options.reportId,// 报告Id
      nickName: options.nickname,//昵称
      shareTime: options.share_time,// 合伙人发起时间戳
      jielongId: options.jielongId,// 接龙Id
      inType: options.inType,// inType:1是点申请解读去选专家解读 2:点帮我解读去选报告解读 3:学业提升 22:咨询
    })
    // 登录
    wx.login({
      success(e) {
        if (e.code) {
          console.log("code==>" + e.code)
          wx.setStorageSync('code', e.code);
          app.getLoginByWxMini(options.shareId)
            .then((user) => {
              that.setData({
                phoneNumber: user.username
              })
              if (user.username) {
                app.globalData.phoneNumber = user.username
                that.ifhasToken()
              }
            }).catch((res) => {
              console.log("error==>" + res.errMsg)
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },

  onShow:function(){
    wx.hideHomeButton({
      success: (res) => {},
    })
  },

  login() {
    this.ifhasToken()
  },

  // 是否有token
  ifhasToken() {
    app.getInfo(() => {
      var authUserInfo = wx.getStorageSync('authUserInfo');
      if (authUserInfo) {
        that.setData({
          hasToken: true,
          headPic: app.globalData.authUserInfo.avatarUrl,
        })
        if (app.globalData.phoneNumber) {
          that.getUserProfile(app.globalData.authUserInfo)
        }
      }
    });
  },


  ///拉取授权用户信息
  bindgetphonenumber: function (e) {
    console.log(e);
    let data = {
      user_id: app.globalData.userId,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    console.log("小程序授权手机号", data)
    API.getWxminiPhonenumber(data, app).then(res => {
      // console.log('bindgetphonenumber - res[0]' + res[0]);
      var user = res[0]
      console.log(user)

      //完善用户信息
      app.globalData.userId = user.user_id
      wx.setStorageSync('userId', user.user_id);
      app.globalData.phoneNumber = user.username
      wx.setStorageSync('phoneNumber', user.username);
      app.globalData.jkUserinfo = user
      wx.setStorageSync('jkUserinfo', user)

      that.setData({
        phoneNumber: user.username
      })
      if (user.username) {
        app.globalData.phoneNumber = user.username
        that.ifhasToken()
      }
    }).catch((res) => {
      console.log(res)
    });
  },


  getUserProfile(wxinfo) {
    console.log('app.globalData.userId' + app.globalData.userId);

    let data = {
      user_id: app.globalData.userId,
      nickname: wxinfo.nickName,
      headimgurl: wxinfo.avatarUrl,
      sex: wxinfo.gender,
      country: wxinfo.country,
      province: wxinfo.province,
      area: wxinfo.city
    }
    console.log("设置微信小程序用户信息", data)
    API.setWxminiUserInfo(data, app).then(res => {
      if (that.data.shareType == 1) {
        // 立即参团   拼团邀请
        wx.redirectTo({
          url: '/pages/groupDetail/groupDetail?order_number=' + that.data.orderNumber + "&isPuySuc=2&shareType=1&shareId=" + app.globalData.userId,
        })
      } else if (that.data.shareType == 2) {
        // 合伙人同意参加   合伙人邀请
        wx.redirectTo({
          url: '/pages/hehuorenShare/hehuorenShare?id=' + that.data.product_id + "&isPuySuc=2&shareType=2&shareId=" + app.globalData.userId + "&nicename=" + that.data.nickName,
        })
      } else if (that.data.shareType == 3) {
        // 商品邀请
        wx.redirectTo({
          url: '/pages/courseDetail/courseDetail?courseId=' + that.data.product_id + "&isPuySuc=2&shareType=3&openType=1&shareId=" + app.globalData.userId, // openType 1:商品详情 2:推荐朋友、三人团
        })
      } else if (that.data.shareType == 4) {
        // 解读邀请详情
        wx.redirectTo({
          url: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + that.data.nickName + '&courseId=' + that.data.product_id + "&inType=" + that.data.inType + "&isPuySuc=2&shareType=4&shareId=" + app.globalData.userId,// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询
        })
      } else if (that.data.shareType == 5) {
        // 测评邀请详情
        wx.redirectTo({
          url: '/pages/report/reportShare/reportShare?reportId=' + that.data.reportId + "&isPuySuc=2&shareType=5&shareId=" + app.globalData.userId,
        })
      } else if (that.data.shareType == 6) {
        // 群接龙
        wx.redirectTo({
          url: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.product_id + "&isPuySuc=2&shareType=6&shareId=" + app.globalData.userId + "&share_time=" + that.data.shareTime + "&jielongId=" + that.data.jielongId,
        })
      } else if (that.data.shareType == 7) {
        // 三人团
        wx.redirectTo({
          url: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.product_id + "&isPuySuc=2&shareType=7&shareId=" + app.globalData.userId + "&share_time=" + that.data.shareTime,
        })
      } else if (that.data.shareType == 8) {
        // 邀请测
        wx.redirectTo({
          url: '/pages/inviteFreeEvaluation/inviteFreeEvaluationGet/inviteFreeEvaluationGet?shareId=' + that.data.shareId,
        })
      } else {
        // 进入首页
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }).catch((res) => {
      console.log(res)
    });
  },

  toAboutus: function () {
    wx.navigateTo({
      url: '/pages/userAgree/userAgree?urlType=2',
    })
  },


})