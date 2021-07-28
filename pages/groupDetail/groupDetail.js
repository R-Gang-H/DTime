// pages/groupDetail/groupDetail.js
const API = require('../../utils/api.js');
const utils = require('../../utils/util.js')

const app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gzhImg: API.gzhImg, // 公众号图片
    kefuImg: API.kefuImg, // 客服图片
    SANRENTUAN: API.SANRENTUAN,
    isPuySuc: false,  // true支付成功，false参团
    h: 23,//时
    m: 59,//分
    s: 59,//秒
    timer: null,//重复执行
    showFkDetail: false,
    yjAddress: '', // 地址
    addressId: '',// 邮寄地址
    isCTSuc: false,//true参团成功，false参团失败
    isPTEnd: false,// 拼团是否结束 true结束false没结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    utils.updateMini()
    that = this;
    that.setData({
      orderNumber: options.order_number,
      isPuySuc: options.isPuySuc == 1,// 1:购买成功，2:参团
      shareId: options.shareId,// 分享用户
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙
    })
    if (options.isjwt && options.isjwt == 1) {
      API.cryptToken({
        user_id: options.shareId
      }, app).then(res2 => {
        console.log("cryptToken==" + JSON.stringify(res2))
        let userId = res2
        that.setData({
          shareId: userId,// 分享用户
        })
      }).catch((res) => {
        console.log("catch2", res)
      });
    }
    setTimeout(res => {
      that.getGroupBuyInfo()
    }, 500)
  },

  // 查询开团详情
  getGroupBuyInfo: function () {
    let that = this;
    API.getGroupBuyInfo({
      order_number: that.data.orderNumber,
    }, app).then(res => {
      console.log("查询开团详情" + JSON.stringify(res))
      var courseDetail = res[0];
      // console.log(courseDetail)
      that.setData({
        courseDetail: courseDetail,
        orderBuyType: courseDetail.order_buy_type,
        isCTSuc: courseDetail.user_images ? courseDetail.user_images.split(',').length >= 3 : false,//true拼团成功
      })

      let currentTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
      let endTime = courseDetail.end_time;
      let date = endTime - currentTime;// 秒
      console.log('结束时间', '当前时间戳:' + currentTime + ',结束时间戳:' + endTime + ",时间差:" + date)
      if (date > 0) {
        var time = date * 1000;//秒转毫秒

        var d, h, m, s, ms;
        d = Math.floor(time / 1000 / 60 / 60 / 24);
        h = Math.floor(time / 1000 / 60 / 60 % 24);
        m = Math.floor(time / 1000 / 60 % 60);
        s = Math.floor(time / 1000 % 60);
        ms = Math.floor(time % 1000);
        let timeStr = d + "天" + h + "时" + m + "分"
        console.log(timeStr)

        const hour = d * 24 + h
        const minute = m
        const second = s

        that.setData({
          h: hour,//时
          m: minute,//分
          s: second,//秒
        })
        console.log("结束时间", hour + ":" + minute + ":" + second)
        that.data.timer = setInterval(() => {

          let currentTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
          let endTime = courseDetail.end_time;
          let date = endTime - currentTime;// 秒
          if (date > 0) {
            that.timeCount()
          } else {
            //当时间归零停止计时器
            clearInterval(that.data.timer)

            that.setData({
              h: 0,//时
              m: 0,//分
              s: 0,//秒
              isCTSuc: false,
              isPTEnd: true,// 拼团成功已结束
            })

          }

        }, 1000)

      } else {
        that.setData({
          h: 0,//时
          m: 0,//分
          s: 0,//秒
          isCTSuc: false,
          isPTEnd: true,// 拼团成功已结束
        })
      }

    }).catch(() => {

    });
  },

  //24小时倒计时
  timeCount() {
    --that.data.s;
    if (that.data.s < 0) {
      --that.data.m;
      that.data.s = 59;
    }
    if (that.data.m < 0) {
      --that.data.h;
      that.data.m = 59
    }
    if (that.data.h < 0) {
      that.data.s = 0;
      that.data.m = 0;
    }

    that.setData({
      h: utils.zeroFill('' + that.data.h, 2),
      m: utils.zeroFill('' + that.data.m, 2),
      s: utils.zeroFill('' + that.data.s, 2),
    })

  },

  // 返回首页
  toHome: function () {
    // wx.switchTab({
    //   url: '/pages/index/index',
    // })
    wx.navigateTo({
      url: '../buySucc/buySucc?order_type=6',// 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
    })
  },

  // 跳转到图片分享
  shareKc() {
    app.actionSheetMenu(() => {
      var that = this;
      let userId = wx.getStorageSync('userId');

      API.decryptToken({
        token: userId
      }, app).then(res2 => {
        console.log("decryptToken3==" + JSON.stringify(res2) + res2[0].user_id)
        let userId = res2[0].user_id

        that.setData({
          path: '/pages/groupDetail/groupDetail?order_number=' + that.data.orderNumber + "&isPuySuc=2&shareId=" + userId + "&isjwt=1",
        })
        setTimeout(res => {
          wx.navigateTo({
            url: '/pages/shareKc/shareKc?id=' + that.data.courseDetail.product_id + '&path=' + encodeURIComponent(that.data.path),
          })
        }, 500)
      });

    }).catch((res) => {
      console.log("catch2", res)
    });

  },

  // 显示大图
  showImage: function (res) {
    let url = res.currentTarget.dataset.url;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var authUserInfo = wx.getStorageSync('authUserInfo');
    if (authUserInfo) {
      let userId = wx.getStorageSync('userId');
      that.setData({
        hasToken: true,
      })
      console.log('userId===', userId)

      if (userId) {

        API.decryptToken({
          token: userId
        }, app).then(res1 => {
          console.log("decryptToken1==" + JSON.stringify(res1))

          if (that.data.shareId) {

            API.decryptToken({
              token: that.data.shareId
            }, app).then(res2 => {
              console.log("decryptToken2==" + JSON.stringify(res2) + '\n' + res1[0].user_id + '\n' + res2[0].user_id)
              that.setData({
                isZJSRT: res1[0].user_id == res2[0].user_id,// 自己发起的三人团
              })
              console.log("==", that.data.isZJSRT)
            }).catch((res) => {
              console.log("catch2", res)
            });

          }

        }).catch((res) => {
          console.log("catch1", res)
        });
      }
    } else {
      setTimeout(res => {
        // 跳转登录页面
        wx.redirectTo({
          url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=1&order_number=' + that.data.orderNumber,// 订单编号
        })
      }, 500)
    }
  },

  // 邮寄地址
  youjiDZ: function () {
    wx.navigateTo({
      url: '../address/selAddress/selAddress',
    })
  },

  //更新地址
  changeAddress: function (yjAddress, addressId) {
    console.log(yjAddress + "==" + addressId)
    this.setData({
      yjAddress: yjAddress,
      addressId: addressId,
      showFkDetail: true,
    })
  },

  // 显示付款详情
  showFkDetail(res) {
    let that = this;
    var courseDetail = res.currentTarget.dataset.item
    var order_number = courseDetail.order_number
    console.log("详情", JSON.stringify(courseDetail))
    let userId = wx.getStorageSync('userId');

    // 已登录立即参团
    if (that.data.hasToken) {
      this.setData({
        showFkDetail: true,
      })
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=1&order_number=' + order_number,// 订单编号
      })
    }
  },
  cancelFkDetail() {
    this.setData({
      showFkDetail: false,
    })
  },


  // 微信支付
  WeiXinBuy() {
    let that = this;
    var courseDetail = that.data.courseDetail
    let userId = wx.getStorageSync('userId');
    var order_buy_type = courseDetail.order_buy_type;
    var order_price = courseDetail.group_price;
    var product_id = courseDetail.product_id;
    var group_buy_id = courseDetail.group_buy_id;

    if (that.data.isPTEnd) {
      order_price = courseDetail.order_price;
    }

    // product_form 产品形式1=视频2=书(实物)3=直播课4=音频课
    if (courseDetail.product_form == 2 && !that.data.addressId) {
      wx.showToast({
        title: '请选择地址',
        icon: 'error'
      })
      return
    }

    let data = {
      user_id: userId,
      order_buy_type: order_buy_type,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
      order_type: 6, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
      order_price: order_price,// 课程优惠价
      // order_price: 1,// 分
      product_id: product_id, // 测评id(order_type=6必传)
      share_id: that.data.shareId, // 分享链接所属的合伙人id(登录状态下打开购买链接必传)
      group_buy_id: group_buy_id,// 别人参与普通用户发起团购的团购id(参与别人团购必传)
      addressId: that.data.addressId,// 实物邮寄地址(严选下的实物类型必传)
    }
    console.log("别人参团参数", data)
    API.makeOrder(data, app).then(res => {
      console.log("购买课程==" + JSON.stringify(res))
      app.pay(res[0].order_number, (suc) => {
        console.log(("支付成功" + JSON.stringify(suc)))

        API.getGroupBuyInfo({
          order_number: that.data.orderNumber,
        }, app).then(res => {
          console.log("支付成功查询开团详情" + JSON.stringify(res))
          var courseDetail = res[0];
          // console.log(courseDetail)
          that.setData({
            courseDetail: courseDetail,
            isCTSuc: true,
            showFkDetail: false,
          })

        }).catch(() => {

        });



      }).catch((e) => {
        console.log((e))
      })
    }).catch(() => {

    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    return {
      title: that.data.courseDetail.product_name,
      imageUrl: that.data.SANRENTUAN,
      path: '/pages/groupDetail/groupDetail?order_number=' + that.data.orderNumber + "&isPuySuc=2&shareId=" + userId,
    }
  },

  onShareTimeline: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    return {
      title: that.data.courseDetail.product_name,
      query: '/pages/groupDetail/groupDetail?order_number=' + that.data.orderNumber + "&isPuySuc=2&shareId=" + userId,
    }
  },

  onHide: function () {
    clearInterval(that.data.timer)
  },

  onUnload: function () {
    clearInterval(that.data.timer)
  }

})