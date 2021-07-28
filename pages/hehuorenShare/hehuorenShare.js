// pages/hehuorenShare/hehuorenShare.js
const API = require('../../utils/api.js');
const utils = require('../../utils/util.js')

const app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFkDetail: false,
    isCTSuc: false,//true已参团，false没参加
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    utils.updateMini()
    that = this;
    let jkuser = wx.getStorageSync('jkUserinfo');
    console.log('options==' + JSON.stringify(options)
      + "\n接口信息" + JSON.stringify(jkuser))
    that.setData({
      product_id: options.id,
      isPuySuc: options.isPuySuc == 1,// 1:购买成功，2:参加
      shareId: options.shareId,// 分享用户
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙
      nickname: options.nickname,
      jkuser: jkuser,//用户信息
    })

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
    } else {
      setTimeout(res => {
        // 跳转登录页面
        wx.redirectTo({
          url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=2&id=' + that.data.product_id + "&nickname=" + that.data.nickname,// 商品id
        })
      }, 500)
    }
    that.getProductDetail(that.data.product_id);
  },

  // 查询课程详情
  getProductDetail: function (id) {
    let that = this;
    var userId = wx.getStorageSync('userId')
    API.getProductDetail({
      id: parseInt(id),
      user_id: userId ? userId : that.data.shareId,
    }, app).then(res => {

      console.log("课程详情" + JSON.stringify(res))
      var courseDetail = res;
      // console.log(courseDetail)
      that.setData({
        courseDetail: courseDetail.info,
        isCollect: courseDetail.info.isCollect == 1, // 0是没有收藏 1是收藏
        info: courseDetail.info,// 课程详情
        detailImages: courseDetail.info.detail_images ? courseDetail.info.detail_images.split(',') : '',// 详情图片
        commentList: courseDetail.commentList,// 学习反馈
        recommendProduct: courseDetail.recommendProduct,// 推荐课程
      })

      that.setdemoTop();

    }).catch(() => {

    });
  },

  /**
      * 图片加载完成方法
      */
  _imgLoadEvent: function (event) {
    // setTimeout(function () {
    var query = wx.createSelectorQuery()//创建节点查询器

    //选择id为comment的节点并查询的它布局位置
    query.select('#demo1').boundingClientRect()
    query.select('#demo2').boundingClientRect()
    query.select('#demo3').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {//执行请求
      console.log("demoRes", res)
      that.setData({
        demo1Top: res[0].top, //滚动到页面节点的上边界坐标
        demo2Top: res[1].top, //滚动到页面节点的上边界坐标
        demo3Top: res[2].top, //滚动到页面节点的上边界坐标
      })
    })
    // }, 500)
  },

  setdemoTop: function () {
    setTimeout(function () {
      if (!that.data.detailImages.length) {
        var query = wx.createSelectorQuery()//创建节点查询器

        //选择id为comment的节点并查询的它布局位置
        query.select('#demo1').boundingClientRect()
        query.select('#demo2').boundingClientRect()
        query.select('#demo3').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {//执行请求
          console.log("demoRes", res)
          that.setData({
            demo1Top: res[0].top, //滚动到页面节点的上边界坐标
            demo2Top: res[1].top, //滚动到页面节点的上边界坐标
            demo3Top: res[2].top, //滚动到页面节点的上边界坐标
          })
        })
      }
    }, 500)
  },

  // 收藏
  collectPro: function () {
    var userId = wx.getStorageSync('userId')
    API.collectProduct({
      user_id: userId,
      product_id: that.data.info.id, // 产品id
    }, app).then(res => {
      console.log("收藏成功==" + JSON.stringify(res))
      that.setData({
        isCollect: true, // 0是没有收藏 1是收藏
      })
    }).catch(() => {

    });
  },

  // 取消收藏
  delCollectPro: function () {
    var userId = wx.getStorageSync('userId')
    API.delCollectProducts({
      user_id: userId,
      product_ids: that.data.info.id, // 产品id
    }, app).then(res => {
      console.log("取消收藏成功==" + JSON.stringify(res))
      that.setData({
        isCollect: false, // 0是没有收藏 1是收藏
      })
    }).catch(() => {

    });
  },

  tobTo(e) {
    var tobIndex = e.currentTarget.dataset.index;
    var toView = e.currentTarget.dataset.toview;
    console.log(toView)
    this.setData({
      tobIndex: tobIndex,
      toView: toView,
    })

    var resTop = that.data.demo1Top
    switch (tobIndex) {
      case '1':
        resTop = that.data.demo1Top
        break;
      case '2':
        resTop = that.data.demo2Top
        break;
      case '3':
        resTop = that.data.demo3Top
        break;
      case '4':
        resTop = that.data.demo4Top
        break;
    }

    wx.pageScrollTo({
      scrollTop: resTop,//滚动到页面节点的上边界坐标
      duration: 300   // 滚动动画的时长
    });

  },

  showImages(res) {
    let images = res.currentTarget.dataset.images
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: images ? images.split(',') : [] // 需要预览的图片http链接列表
    })
  },

  // 显示付款详情
  showFkDetail() {
    let that = this;
    var courseDetail = that.data.courseDetail
    console.log("详情", JSON.stringify(courseDetail))
    let userId = wx.getStorageSync('userId');

    // 已登录立即参加
    if (that.data.hasToken) {
      this.setData({
        showFkDetail: true,
      })
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=2&id=' + that.data.product_id + "&nickname=" + that.data.nickname,// 商品id
      })
    }
  },
  cancelFkDetail() {
    this.setData({
      showFkDetail: false,
    })
  },


  toLunto() {
    // 已登录立即参加
    if (that.data.hasToken) {
      wx.navigateTo({
        url: '/pages/expert/xlianyinDetail/xlianyinDetail'
      })
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=2&id=' + that.data.product_id,// 商品id
      })
    }
  },

  // 微信支付
  WeiXinBuy() {
    let that = this;
    // 已登录立即参加
    if (that.data.hasToken) {
      this.setData({
        showFkDetail: true,
      })
      // 已经是专家或合伙人
      if (that.data.jkuser.is_qudao == 1 || that.data.jkuser.is_expert == 1) {
        that.setData({
          isCTSuc: true,
          showFkDetail: false
        })
      } else {
        var courseDetail = that.data.courseDetail
        let userId = wx.getStorageSync('userId');
        var order_price = courseDetail.price;
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
          order_buy_type: 1,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
          order_type: 5, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
          order_price: order_price,// 课程优惠价
          // order_price: 1,// 分
          product_id: that.data.product_id,
          share_id: that.data.shareId,// 分享链接所属的合伙人id(登录状态下打开购买链接必传)
        }
        console.log("别人参团参数", data)
        API.makeOrder(data, app).then(res => {
          console.log("购买课程==" + JSON.stringify(res))
          app.pay(res[0].order_number, (suc) => {
            console.log(("支付成功" + JSON.stringify(suc)))
            that.setData({
              isCTSuc: true,
              showFkDetail: false
            })

          }).catch((e) => {
            console.log((e))
          })
        }).catch(() => {

        });

      }

    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=2&id=' + that.data.product_id + "&nickname=" + that.data.nickname,// 商品id
      })
    }

  },

  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  toAboutus: function () {
    wx.navigateTo({
      url: '/pages/userAgree/userAgree?urlType=2',
    })
  },



  onPageScroll: function (res) {
    let scrollTo = res.scrollTop;
    // console.log(scrollTo)

    if (scrollTo > 380) {
      if (scrollTo > 380 && scrollTo < that.data.demo2Top) {
        that.setData({
          tobIndex: 1
        })
      }
      if (scrollTo >= that.data.demo2Top - 35 && scrollTo <= that.data.demo3Top) {
        that.setData({
          tobIndex: 2
        })
      }
      if (scrollTo >= that.data.demo3Top - 35 && scrollTo <= that.data.demo4Top) {
        that.setData({
          tobIndex: 3
        })
      }
      if (scrollTo >= that.data.demo4Top - 35) {
        that.setData({
          tobIndex: 4
        })
      }

      that.setData({
        isPos: true,
      })
    } else {
      that.setData({
        isPos: false,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    return {
      title: that.data.courseDetail.product_name,
      path: '/pages/hehuorenShare/hehuorenShare?id=' + that.data.product_id + "&isPuySuc=2&shareId=" + userId,
    }
  },

  onShareTimeline: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    return {
      title: that.data.courseDetail.product_name,
      query: '/pages/hehuorenShare/hehuorenShare?id=' + that.data.product_id + "&isPuySuc=2&shareId=" + userId,
    }
  },

})