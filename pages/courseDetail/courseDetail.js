// pages/courseDetail/courseDetail.js
const API = require('../../utils/api.js');
const util = require('../../utils/util.js')

const app = getApp();

var shareModeData = [{ bindTap: 'Menu1', text: "微信分享" }, { bindTap: 'Menu2', text: "保存图片" }];

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SANRENTUAN: API.SANRENTUAN,
    toView: 'demo1',
    tobIndex: '1',
    showFkDetail: false,
    showThreeGroup: false,
    yjAddress: '', // 地址
    addressId: '',// 邮寄地址
    isPos: false,
    isShow: true,
    actionSheetHidden: false, // 控制分享弹窗modal
    actionSheetItems: shareModeData, // 弹窗展示数据
    share_pengyouquan: API.Bucket + '/shareimg/share_pengyouquan.png',
    share_weixin: API.Bucket + '/shareimg/share_weixin.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    let jkuser = wx.getStorageSync('jkUserinfo');
    let qudaoLevel = wx.getStorageSync('qudaoLevel');
    console.log(JSON.stringify(options)
      + "\n接口信息" + JSON.stringify(jkuser))
    this.setData({
      courseId: options.courseId,
      isPuySuc: options.isPuySuc == 1,// 1:购买成功，2:参加
      shareId: options.shareId,// 分享用户
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙
      openType: options.openType,// 1:商品详情 2:推荐朋友、三人团
      jkuser: jkuser,
      qudaoLevel: qudaoLevel,// 合伙人等级1=初级2=高级
    })
    if (options.isShow) {
      that.setData({
        isShow: options.isShow != 1,// false 不显示
      })
    }
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
      that.getProductDetail(options.courseId)
    }, 500)
  },

  //添加浏览记录
  addRecords(id) {
    let data = {
      user_id: wx.getStorageSync('userId'),
      product_id: id
    }
    API.addRecords(data, app)
  },

  // 查询课程详情
  getProductDetail: function (id) {
    let that = this;
    var userId = wx.getStorageSync('userId')
    if (userId) {
      this.addRecords(id)
    }
    API.getProductDetail({
      id: parseInt(id),
      user_id: userId ? userId : that.data.shareId,
    }, app).then(res => {
      // console.log("课程详情" + JSON.stringify(res))
      var courseDetail = res;
      // console.log(courseDetail)
      that.setData({
        courseDetail: courseDetail,
        isCollect: courseDetail.info.isCollect == 1, // 0是没有收藏 1是收藏
        info: courseDetail.info,// 课程详情
        detailImages: courseDetail.info.detail_images ? courseDetail.info.detail_images.split(',') : '',// 详情图片
        commentList: courseDetail.commentList,// 学习反馈
        recommendProduct: courseDetail.recommendProduct,// 推荐课程
      })

      setTimeout(function () {
        if (!that.data.detailImages.length) {
          var query = wx.createSelectorQuery()//创建节点查询器

          //选择id为comment的节点并查询的它布局位置
          query.select('#demo1').boundingClientRect()
          query.select('#demo2').boundingClientRect()
          query.select('#demo3').boundingClientRect()
          if (that.data.isShow) {
            query.select('#demo4').boundingClientRect()
          }
          query.selectViewport().scrollOffset()
          query.exec(function (res) {//执行请求
            console.log("demoRes", res)
            that.setData({
              demo1Top: res[0].top, //滚动到页面节点的上边界坐标
              demo2Top: res[1].top, //滚动到页面节点的上边界坐标
              demo3Top: res[2].top, //滚动到页面节点的上边界坐标
              demo4Top: that.data.isShow ? res[3].top : '', //滚动到页面节点的上边界坐标
            })
          })
        }
      }, 500)

    }).catch(() => {

    });
  },

  showImages(res) {
    let images = res.currentTarget.dataset.images
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: images ? images.split(',') : [] // 需要预览的图片http链接列表
    })
  },

  //更新地址
  changeAddress: function (yjAddress, addressId) {
    console.log(yjAddress + "==" + addressId)
    this.setData({
      yjAddress: yjAddress,
      addressId: addressId,
      showFkDetail: true,
      buyType: that.data.buyType,
    })
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

  // 合伙人发起群接龙
  addJieLong: function (res) {
    let opentype = res.currentTarget.dataset.opentype
    that.setData({
      opentype: opentype,// 1三人团，2接龙
    })
    let userId = wx.getStorageSync('userId');
    if (opentype == 1) {
      that.setData({
        showThreeGroup: true,
      })
      // let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
      // wx.navigateTo({
      //   url: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.info.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
      // })
    }
  },
  // 显示付款详情
  showFkDetail(res) {
    var buyType = res.currentTarget.dataset.buy;// 1:单独购买 2:3人团
    console.log("购买方式==", buyType)
    this.setData({
      showFkDetail: true,
      actionSheetHidden: false,
      buyType: buyType,
    })
  },
  cancelFkDetail() {
    this.setData({
      showFkDetail: false,
      actionSheetHidden: that.data.buyType == 3,
      showThreeGroup: false,
    })
  },

  // 微信支付
  WeiXinBuy() {
    let that = this;
    let userId = wx.getStorageSync('userId');

    // 已登录立即参加
    if (that.data.hasToken) {

      var order_buy_type, order_price;
      if (that.data.buyType == 1) {// 1:单独购买 2:3人团
        order_buy_type = 1;
        order_price = that.data.info.price;
      } else if (that.data.buyType == 2) {
        order_buy_type = 2;
        order_price = that.data.info.group_price;
      }
      // product_form 产品形式1=视频2=书(实物)3=直播课4=音频课
      if (that.data.info.product_form == 2 && !that.data.addressId) {
        that.setData({
          showFkDetail: true,
        })
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
        product_id: that.data.info.id, // 测评id(order_type=6必传)
        share_id: that.data.shareId, // 分享链接所属的合伙人id(登录状态下打开购买链接必传)
        addressId: that.data.addressId,// 实物邮寄地址(严选下的实物类型必传)
      }
      console.log("微信支付", JSON.stringify(data))
      API.makeOrder(data, app).then(res => {
        console.log("购买课程==" + JSON.stringify(res))
        that.setData({
          showFkDetail: false,
        })
        app.pay(res[0].order_number, (suc) => {
          console.log(("支付成功" + JSON.stringify(suc)))

          if (that.data.buyType == 1) {// 1:单独购买 2:3人团
            wx.navigateTo({
              url: '../buySucc/buySucc?order_type=6',// 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
            })
          } else if (that.data.buyType == 2) {
            wx.navigateTo({
              url: '../groupDetail/groupDetail?isPuySuc=1&order_number=' + suc[0].order_number,// 订单编号
            })
          }

        }).catch((e) => {
          console.log((e))
        })
      }).catch(() => {

      });

    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=3&id=' + that.data.info.id,// 商品id
      })
    }
  },

  // 邮寄地址
  youjiDZ: function () {
    wx.navigateTo({
      url: '../address/selAddress/selAddress',
    })
  },

  // 课程详情
  toCourseDetail: function (res) {
    var courseId = res.currentTarget.dataset.id
    console.log(courseId)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + courseId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
    })
  },

  toLogin: function () {
    // 已登录立即参团
    if (!that.data.hasToken) {
      let userId = wx.getStorageSync('userId');
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo',
      })
    }
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
    if (that.data.isShow) {
      query.select('#demo4').boundingClientRect()
    }
    query.selectViewport().scrollOffset()
    query.exec(function (res) {//执行请求
      console.log("demoRes", res)
      that.setData({
        demo1Top: res[0].top, //滚动到页面节点的上边界坐标
        demo2Top: res[1].top, //滚动到页面节点的上边界坐标
        demo3Top: res[2].top, //滚动到页面节点的上边界坐标
        demo4Top: that.data.isShow ? res[3].top : '', //滚动到页面节点的上边界坐标
      })
    })
    // }, 500)
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
          url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=3&id=' + that.data.courseId,// 商品id
        })
      }, 500)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
    // type":"产品类型1=解读；2=咨询；3=学业提升 4=测评；5=21天训练营；6=严选
    console.log("分享：用户Id", userId + "==课程详情" + JSON.stringify(that.data.info) + "打开类型" + that.data.openType + "shareTime" + shareTime)
    if (that.data.info.type == 6 && that.data.openType == 2) {
      if (that.data.opentype == 1 && that.data.showThreeGroup) {// 点击三人团
        that.setData({
          showThreeGroup: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          imageUrl: that.data.SANRENTUAN,
          path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.info.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {
        return {
          title: that.data.courseDetail.product_name,
          path: '/pages/courseDetail/courseDetail?courseId=' + that.data.info.id + "&isPuySuc=2&shareId=" + userId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
        }
      }
    }
  },

  onShareTimeline: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
    // type":"产品类型1=解读；2=咨询；3=学业提升 4=测评；5=21天训练营；6=严选
    console.log("分享：", JSON.stringify(that.data.info + "shareTime" + shareTime))
    if (that.data.info.type == 6 && that.data.openType == 2) {
      if (that.data.opentype == 1 && that.data.showThreeGroup) {// 点击三人团
        that.setData({
          showThreeGroup: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.info.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/courseDetail/courseDetail?courseId=' + that.data.info.id + "&isPuySuc=2&shareId=" + userId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
        }
      }
    }
  },

  // 点击弹出弹窗，选择发给微信好友 或 生成分享图片。
  // 显示分享弹窗。
  showShareModal(e) {
    this.setData({
      actionSheetHidden: true,
    });
  },
  // 改变 action-sheet状态。
  actionSheetChange(e) {
    this.setData({
      actionSheetHidden: false,
    });
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

        let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
        // type":"产品类型1=解读；2=咨询；3=学业提升 4=测评；5=21天训练营；6=严选
        console.log("分享：用户Id", userId + "==课程详情" + JSON.stringify(that.data.info) + "打开类型" + that.data.openType + "shareTime" + shareTime)
        // 三人团
        that.setData({
          path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.info.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&isjwt=1",
        })
        setTimeout(res => {
          wx.navigateTo({
            url: '/pages/shareKc/shareKc?id=' + that.data.info.id + '&path=' + encodeURIComponent(that.data.path),
          })
        }, 500)
      }).catch((res) => {
        console.log("catch2", res)
      });

    });

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

})