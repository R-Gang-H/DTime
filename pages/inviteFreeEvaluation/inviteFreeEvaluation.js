// pages/inviteFreeEvaluation/InviteFreeEvaluation.js
const API = require('../../utils/api.js')
const util = require('../../utils/util.js')

var app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adultNumber: '',// 成人数量
    childrenNumber: '',// 儿童数量
    selectAdultNumber: '',// 选择成人数量
    selectchildrenNumber: '',// 选择儿童数量
    isShowInfoView: '0',
    iconShareTestBg: API.YAOQINTESTBG,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    wx.hideShareMenu()
    console.log('成人数量' + options.adultNum)
    console.log('儿童数量' + options.childrenNum)
    let authuser = wx.getStorageSync('authUserInfo');
    console.log('yng' + authuser)
    that = this;
    that.setData({
      adultNumber: options.adultNum,
      childrenNumber: options.childrenNum,
      authuser: authuser
    })
  },

  // 成人数量
  inputAdultNumber(e) {
    var selectAdultNumber = e.detail.value
    console.log('成人数量', selectAdultNumber + "==" + that.data.adultNumber)
    if (parseInt(selectAdultNumber) > parseInt(that.data.adultNumber)) {
      wx.showToast({
        title: '数量超出上限',
        icon: 'error',
        duration: 2000
      })
      that.setData({
        selectAdultNumber: that.data.adultNumber
      })
      console.log('成人数量', that.data.selectAdultNumber)

    } else {
      that.setData({
        selectAdultNumber: selectAdultNumber
      })
    }

  },

  // 儿童数量
  inputChildrenNumber(e) {
    var selectchildrenNumber = e.detail.value
    console.log('儿童数量', selectchildrenNumber)
    if (parseInt(selectchildrenNumber) > parseInt(that.data.childrenNumber)) {
      wx.showToast({
        title: '数量超出上限',
        icon: 'error',
        duration: 2000
      })
      that.setData({
        selectchildrenNumber: that.data.childrenNumber
      })
    } else {
      that.setData({
        selectchildrenNumber: selectchildrenNumber
      })
    }

  },
  //查看邀请信息
  chackInfo: function () {
    that.setData({
      isShowInfoView: "1"
    })
  },

  closeInfoView: function () {
    that.setData({
      isShowInfoView: "0"
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return new Promise((resolve, reject) => {
      var selectAdultNumber = parseInt(that.data.selectAdultNumber)
      var selectchildrenNumber = parseInt(that.data.selectchildrenNumber)

      if (!selectAdultNumber) {
        selectAdultNumber = 0;
      }
      if (!selectchildrenNumber) {
        selectchildrenNumber = 0;
      }

      if (!selectAdultNumber && !selectchildrenNumber) {
        wx.showToast({
          icon: 'error',
          title: '请输入分享次数',
        })
        reject();
      } else {
        wx.showLoading({
          title: '正在请求分享数据...',
          icon: 'none'
        })
        // 转发成功
        let data = {
          user_id: wx.getStorageSync('userId'),
          cr_num: selectAdultNumber,
          et_num: selectchildrenNumber
        }
        API.sendInviteInfo(data).then(res => {
          console.log("我的分享数据", JSON.stringify(res))
          if (res.shareId != 0 || res.shareId != '') {
            that.setData({
              shareId: res.shareId,
              adultNumber: parseInt(that.data.adultNumber) - selectAdultNumber,
              childrenNumber: parseInt(that.data.childrenNumber) - selectchildrenNumber,
              selectAdultNumber: '',
              selectchildrenNumber: ''
            })
            wx.hideLoading()

            resolve({
              title: '邀请免费测',//输入标题
              imageUrl: that.data.iconShareTestBg,
              path: 'pages/inviteFreeEvaluation/inviteFreeEvaluationGet/inviteFreeEvaluationGet?shareId=' + res.shareId//wx.getStorageSync('userId'),
            })

          }
        }).catch((res) => {
          console.log(res + "取消")
          wx.hideLoading()
        });

      }

    })
  }
})