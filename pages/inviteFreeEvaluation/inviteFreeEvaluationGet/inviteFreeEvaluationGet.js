// pages/inviteFreeEvaluation/inviteFreeEvaluationGet/inviteFreeEvaluationGet.js

const API = require('../../../utils/api.js')
const util = require('../../../utils/util.js')

var app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasToken: '',      // 判断是否登录
    shareInfo: '',         //分享详情
    nickName: '',          //赠送人昵称
    selectAdultNumber: '',// 选择成人数量
    selectchildrenNumber: '',// 选择儿童数量
    isReceive: false,   //是否领取
    isExpire: false,   //是否过期
    shareStatus: 0,     //分享状态
    infoImage: API.YAOQINTEST,  //图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('领取页面')
    console.log(options)
    util.updateMini()
    that = this;
    that.setData({
      shareId: options.shareId,
    })
    that.getShareInfo()
  },

  //获取分享信息
  getShareInfo: function () {
    let data = {
      share_id: that.data.shareId,
    }
    API.getShareAnswerDetail(data).then(res => {
      console.log("我的分享数据", JSON.stringify(res))
      that.setData({
        shareInfo: res,
      })
    })
  },


  //领取测评
  getEvaluationNum: function () {

    // 已登录立即参加
    if (that.data.hasToken) {

      // "status":"状态(0分享中,1已过期,2已领取)"
      if (that.data.shareInfo.status == 0) {

        let data = {
          share_id: that.data.shareId,
          user_id: wx.getStorageSync('userId'),
          // share_id: 5,
        }
        API.getReceiveShareAnswer(data).then(res => {
          console.log("领取测评", JSON.stringify(res))

          wx.showModal({
            title: '提示',
            content: '恭喜您获得天赋教养TOP测试的儿童测评' + that.data.shareInfo.et_num + '次和成人测评' + that.data.shareInfo.cr_num + '次。快来参与测试吧',
            showCancel: false,
            confirmText: '开始测试',
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/report/myreportList/myreportList',
                })
                // } else if (res.cancel) {
                //   console.log("返回上一页")
                //   wx.switchTab({
                //     url: '/pages/index/index',
                //   })
              }
            }
          })

        }).catch((res) => {
          console.log("领取失败", JSON.stringify(res))
          wx.showToast({
            title: '领取失败',
            icon: 'error',
            duration: 2000
          })
        });

      } else if (that.data.shareInfo.status == 1) {

        wx.showModal({
          title: '提示',
          content: '测评已过期。',
          showCancel: false,
          confirmText: '知道了',
          success(res) {
            if (res.confirm) {
              console.log("返回上一页")
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          }
        })

      } else if (that.data.shareInfo.status == 2) {

        let userId = wx.getStorageSync('userId');
        API.getAllTest({
          user_id: userId,
          page: 1,
          pageSize: 3,
        }, app).then(res => {
          console.log(JSON.stringify(res.list))

          that.setData({
            unReadReport: res.list.length > 0,
          })

          if (that.data.unReadReport) {// 有没完成的测评
            wx.showModal({
              title: '提示',
              content: '测评已经被领取。检测到您还有没完成的测评，请您开始测评吧',
              showCancel: false,
              confirmText: '开始测试',
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/report/myreportList/myreportList',
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '测评已经被领取。',
              showCancel: false,
              confirmText: '知道了',
              success(res) {
                if (res.confirm) {
                  console.log("返回上一页")
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              }
            })
          }

        }).catch(() => {
          wx.showModal({
            title: '提示',
            content: '测评已经被领取。',
            showCancel: false,
            confirmText: '知道了',
            success(res) {
              if (res.confirm) {
                console.log("返回上一页")
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
        });

      }

    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareType=8&shareId=' + that.data.shareId
      })
    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var authUserInfo = wx.getStorageSync('authUserInfo');
    if (authUserInfo) {
      that.setData({
        hasToken: true,
      })
    }else{
      setTimeout(res=>{
        // 跳转登录页面
        wx.redirectTo({
          url: '/pages/auth/authUserInfo/authUserInfo?shareType=8&shareId=' + that.data.shareId
        })
      },500)
    }
  },

})