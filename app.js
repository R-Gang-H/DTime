const API = require('utils/api.js');

let app = getApp();
let that;
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    that = this;

  },

  getLoginByWxMini(share_id) {
    return new Promise(function (resolve, reject) {
      var code = wx.getStorageSync('code');
      let data = {
        code: code,
        share_id: share_id
      }
      console.log("小程序授权登录", data)
      API.loginByWxMini(data, app).then(res => {
        console.log("授权登录", JSON.stringify(res))
        let user = res[0];
        that.globalData.userId = user.user_id
        wx.setStorageSync('userId', user.user_id);
        that.globalData.phoneNumber = user.username
        wx.setStorageSync('phoneNumber', user.username);
        that.globalData.jkUserinfo = user
        wx.setStorageSync('jkUserinfo', user)
        wx.setStorageSync('isQudao', user.is_qudao) // 保存身份权限
        resolve(user)
      }).catch((res) => {
        reject(res)
      })
    });

  },

  getInfo(retback) {
    let that = this
    if (!that.globalData.authUserInfo && !wx.getStorageSync('authUserInfo')) {

      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (e) => {
          that.globalData.authUserInfo = e.userInfo
          wx.setStorageSync('authUserInfo', e.userInfo)

          if (typeof (retback) == "function") {
            retback()
          }
        }
      })

    } else {
      if (typeof (retback) == "function") {
        that.globalData.authUserInfo = wx.getStorageSync('authUserInfo')
        that.globalData.jkUserInfo = wx.getStorageSync('jkUserInfo');
        that.globalData.userId = wx.getStorageSync('userId')
        that.globalData.phoneNumber = wx.getStorageSync('phoneNumber');
        retback()
      }
    }
  },


  // 调起支付的必要参数
  pay(order_number, retback) {
    var userId = wx.getStorageSync('userId');
    var data = {
      user_id: userId,
      order_number: order_number,
    }
    API.pay(data, app).then(res => {
      console.log('pay', JSON.stringify(res))
      this.payment(res[0], retback)
    }).catch((res) => {
      console.log((res))
    })
  },

  // 微信支付
  payment(res, retback) {
    var that = this;
    wx.requestPayment({
      "timeStamp": res.timeStamp + "",
      "nonceStr": res.nonceStr,
      "package": res.package,
      "signType": res.signType,
      "paySign": res.paySign,
      "success": function (success) {
        console.log('payment==', JSON.stringify(success))
        that.checkPayStatus(res, retback)
      },
      "fail": function (res) {
        console.log('fail==' + JSON.stringify(res))
      },
      "complete": function (res) {
        console.log('complete==' + JSON.stringify(res))
      }
    })
  },

  //检查支持状态
  checkPayStatus(res, retback) {
    API.checkPayStatus({
      order_number: res.order_number,
    }, app).then(success => {
      console.log('checkPaySuccess', JSON.stringify(success))
      var data = success[0]
      if (data && data.order_status == 2) {// 支付成功
        clearInterval(that.globalData.timer)
        if (typeof (retback) == "function") {
          retback(success)
        }
      } else {
        that.globalData.timer = setTimeout(() => {
          console.log('setInterval==', JSON.stringify(res))
          that.checkPayStatus(res, retback)
        }, 1000)
      }
    }).catch((error) => {
      console.log('checkPayError==' + JSON.stringify(error))
    });
  },

  // 分享朋友圈
  actionSheetMenu(retback) {
    wx.getSetting({
      success(e) {
        if (!e.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log('writePhotosAlbum 授权成功')
              if (typeof (retback) == "function") {
                retback()
              }
            }, fail() {
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none',
                success(res) {

                }
              })
            }
          })
        } else {
          if (typeof (retback) == "function") {
            retback()
          }
        }
      }
    })
  },


  UrlSign(e) {
    // '/tmp_106e913bf6754a6d330915c30e5e6341.jpg'
    // if (e != undefined && e != "" && e != null) {
    //   return ossSign.UrlSign(e)
    // }
    // else{
    //   return"/img/err.png";
    // }

  },


  globalData: {
    authUserInfo: null,
    jkUserInfo: null,
    userId: '',
    phoneNumber: '',
    timer: '',
  }

})