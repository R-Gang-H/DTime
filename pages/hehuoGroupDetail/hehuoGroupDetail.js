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
    h: 23,//时
    m: 59,//分
    s: 59,//秒
    timer: null,//重复执行
    isCTSuc: false,//true参团成功，false参团失败
    addressId: ''// 地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    utils.updateMini()
    that = this;
    that.setData({
      productId: options.id,
      isPuySuc: options.isPuySuc == 1,// 1:购买成功，2:参团
      shareId: options.shareId,// 分享用户
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙
      shareTime: options.share_time,// 合伙人发起团购时间（unix时间戳）
      jielongId: options.jielongId// 接龙Id
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
      that.getShareGroupBuyInfo()
    }, 500)
  },

  // 查询开团详情
  getShareGroupBuyInfo: function () {
    let that = this;
    let userId = wx.getStorageSync('userId');
    let data = {
      user_id: userId ? userId : that.data.shareId,
      product_id: that.data.productId,// 产品Id
      order_buy_type: 3,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
      share_time: that.data.shareTime, // 合伙人发起团购时间（unix时间戳）
      group_buy_id: that.data.jielongId,// 接龙Id
    }
    console.log("接龙开团详情", data)
    API.getShareGroupBuyInfo(data, app).then(res => {
      console.log("查询开团详情" + JSON.stringify(res))
      var courseDetail = res;
      // console.log(courseDetail)
      that.setData({
        info: courseDetail,
        courseDetail: courseDetail.product,
        // isCTSuc: courseDetail.headimgs ? courseDetail.headimgs.split(',').length == 10 : false,//true拼团成功
        jlPrice: parseInt(courseDetail.num) >= parseInt(courseDetail.product.third_need_num) ? courseDetail.product.third_price
          : parseInt(courseDetail.num) >= parseInt(courseDetail.product.second_need_num) ? courseDetail.product.second_price
            : parseInt(courseDetail.num) >= parseInt(courseDetail.product.first_need_num) ? courseDetail.product.first_price
              : courseDetail.product.price,
        jwPrice: parseInt(courseDetail.num) >= parseInt(courseDetail.product.third_need_num) ? courseDetail.product.third_price
          : parseInt(courseDetail.num) >= parseInt(courseDetail.product.second_need_num) ? courseDetail.product.third_price
            : parseInt(courseDetail.num) >= parseInt(courseDetail.product.first_need_num) ? courseDetail.product.second_price
              : courseDetail.product.first_price,
        jlRen: parseInt(courseDetail.num) >= parseInt(courseDetail.product.third_need_num) ? courseDetail.product.third_need_num
          : parseInt(courseDetail.num) >= parseInt(courseDetail.product.second_need_num) ? courseDetail.product.third_need_num
            : parseInt(courseDetail.num) >= parseInt(courseDetail.product.first_need_num) ? courseDetail.product.second_need_num
              : courseDetail.product.first_need_num
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
            })

          }

        }, 1000)

      } else {
        that.setData({
          h: 0,//时
          m: 0,//分
          s: 0,//秒
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
      h: that.data.h,
      m: that.data.m,
      s: that.data.s,
    })

  },

  // 立即群接龙
  addJieLong: function () {
    let that = this;
    let userId = wx.getStorageSync('userId');
    // 已登录立即参团
    if (that.data.hasToken) {
      that.WeiXinBuy();
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?id=' + that.data.productId + "&shareId=" + that.data.shareId + "&share_time=" + that.data.shareTime + '&shareType=6' + "&jielongId=" + that.data.jielongId
      })
    }

  },

  // 显示大图
  showImage: function (res) {
    let url = res.currentTarget.dataset.url;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  // 微信支付
  WeiXinBuy() {
    let that = this;
    var courseDetail = that.data.courseDetail
    let userId = wx.getStorageSync('userId');
    var type = courseDetail.type;
    var order_price = that.data.jlPrice;
    var product_id = courseDetail.id;
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
      order_buy_type: 3,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
      order_type: type, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
      order_price: order_price,// 课程优惠价
      // order_price: 1,// 分
      // product_id: product_id, // 产品Id(order_type=6必传)
      // report_id:product_id,//测评id(order_type=1必传)
      share_id: that.data.shareId, // 分享链接所属的合伙人id(登录状态下打开购买链接必传)
      share_time: that.data.shareTime,// 合伙人发起的团购时间戳(合伙人团购必传)
      jielong_id: that.data.jielongId,// 别人参与普通用户发起团购的团购id(参与别人团购必传)
      addressId: that.data.addressId,// 实物邮寄地址(严选下的实物类型必传)
    }
    console.log("接龙人参数", data)
    API.makeOrder(data, app).then(res => {
      console.log("购买课程==" + JSON.stringify(res))
      app.pay(res[0].order_number, (suc) => {
        console.log(("支付成功" + JSON.stringify(suc)))

        wx.showLoading({
          title: '恭喜您接龙成功',
        })

        setTimeout(function () {

          let data = {
            user_id: userId ? userId : that.data.shareId,
            product_id: that.data.productId,// 产品Id
            order_buy_type: 3,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
            share_time: that.data.shareTime, // 合伙人发起团购时间（unix时间戳）
            group_buy_id: that.data.jielongId,// 接龙Id
          }
          console.log("接龙开团详情", data)
          API.getShareGroupBuyInfo(data, app).then(res => {
            console.log("接龙成功查询开团详情" + JSON.stringify(res))
            wx.hideLoading()
            var courseDetail = res;
            // console.log(courseDetail)
            that.setData({
              info: courseDetail,
              courseDetail: courseDetail.product,
              isCTSuc: true,
            })
          }).catch(() => {

          });

        }, 2000)

      }).catch((e) => {
        console.log((e))
      })
    }).catch(() => {

    });

  },

  // 返回首页
  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
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

      API.decryptToken({
        token: userId
      }, app).then(res1 => {
        console.log("decryptToken1==" + JSON.stringify(res1))

        API.decryptToken({
          token: that.data.shareId
        }, app).then(res2 => {
          console.log("decryptToken2==" + JSON.stringify(res2) + '\n' + res1[0].user_id + '\n' + res2[0].user_id)
          that.setData({
            isZJQJL: res1[0].user_id == res2[0].user_id,// 自己发起的群接龙
          })
          console.log("==", that.data.isZJQJL)
        }).catch((res) => {
          console.log("catch2", res)
        });

      }).catch((res) => {
        console.log("catch1", res)
      });

    } else {
      setTimeout(res => {
        // 跳转登录页面
        wx.redirectTo({
          url: '/pages/auth/authUserInfo/authUserInfo?id=' + that.data.productId + "&shareId=" + that.data.shareId + "&share_time=" + that.data.shareTime + '&shareType=6' + "&jielongId=" + that.data.jielongId
        })
      }, 500)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.courseDetail.product_name,
      path: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.productId + "&shareId=" + that.data.shareId + "&share_time=" + that.data.shareTime + '&shareType=6' + "&jielongId=" + that.data.jielongId,
    }
  },

  onShareTimeline: function () {
    var that = this;
    return {
      title: that.data.courseDetail.product_name,
      query: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.productId + "&shareId=" + that.data.shareId + "&share_time=" + that.data.shareTime + '&shareType=6' + "&jielongId=" + that.data.jielongId,
    }
  },

  onHide: function () {
    clearInterval(that.data.timer)
  },

  onUnload: function () {
    clearInterval(that.data.timer)
  }

})