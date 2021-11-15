// pages/expert/xlianyinDetail/xlianyinDetail.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

const app = getApp();

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'demo1',
    tobIndex: '1',
    showFkDetail: false,
    showThreeGroup: false,
    yjAddress: '', // 地址
    addressId: '',// 邮寄地址
    isPos: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.titleName,
    })
    that.setData({
      titleName: options.titleName,
      type: options.type,
      testType: options.testType, // 3训练营，4天赋解读
      shareId: options.shareId,// 分享用户
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
    }else{
      that.setData({
        inType: options.inType, // inType:1是点申请解读去选专家解读 2:点帮我解读去选报告解读 22:咨询 3:学业提升
        courseId: options.courseId,
      })
    }
    setTimeout(res => {
      if (options.inType && options.inType != 'undefined') {
        
        that.getProductDetail(options.courseId)
        that.expertList(1)
      } else {
        if (options.testType == 4) {
          that.expertList(1)
        }
        that.getTestProduct(options.testType);
      }
    }, 500)

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
    query.select('#demo4').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {//执行请求
      console.log("demoRes", res)
      that.setData({
        demo1Top: res[0].top, //滚动到页面节点的上边界坐标
        demo2Top: res[1].top, //滚动到页面节点的上边界坐标
        demo3Top: res[2].top, //滚动到页面节点的上边界坐标
        demo4Top: res[3].top, //滚动到页面节点的上边界坐标
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
          url: '/pages/auth/authUserInfo/authUserInfo?nickname=' + that.data.info.product_name + '&shareId=' + that.data.shareId + '&shareType=4&id=' + that.data.courseId + '&inType=' + that.data.inType
        })
      }, 1000)
    }
  },

  // 获取测评商品id/价格
  getTestProduct(type) {

    API.getTestProduct({
      type: type,
    }, app).then(res => {
      // (分)
      // console.log("测评商品id/价格" + JSON.stringify(res))
      var courseDetail = res[0];
      // console.log(courseDetail)
      that.setData({
        courseDetail: courseDetail,
        isCollect: courseDetail.isCollect == 1, // 0是没有收藏 1是收藏
        info: courseDetail,// 课程详情
        detailImages: courseDetail.detail_images ? courseDetail.detail_images.split(',') : '',// 详情图片
        commentList: courseDetail.commentList,// 学习反馈
      })

      wx.setNavigationBarTitle({
        title: courseDetail.product_name,
      })

      that.setdemoTop();

    }).catch(() => {
    });
  },

  // 查询课程详情
  getProductDetail: function (id) {
    let that = this;
    var userId = wx.getStorageSync('userId')
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
      })

      that.setdemoTop();

    }).catch(() => {

    });
  },

  setdemoTop: function () {
    setTimeout(function () {
      if (!that.data.detailImages.length) {
        var query = wx.createSelectorQuery()//创建节点查询器

        //选择id为comment的节点并查询的它布局位置
        query.select('#demo1').boundingClientRect()
        query.select('#demo2').boundingClientRect()
        query.select('#demo3').boundingClientRect()
        query.select('#demo4').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {//执行请求
          console.log("demoRes", res)
          that.setData({
            demo1Top: res[0].top, //滚动到页面节点的上边界坐标
            demo2Top: res[1].top, //滚动到页面节点的上边界坐标
            demo3Top: res[2].top, //滚动到页面节点的上边界坐标
            demo4Top: res[3].top, //滚动到页面节点的上边界坐标
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
  showFkDetail(res) {
    var buyType = res.currentTarget.dataset.buy;// 1:单独购买 2:3人团
    console.log("购买方式==", buyType)
    this.setData({
      showFkDetail: true,
      buyType: buyType,
    })
  },
  cancelFkDetail() {
    this.setData({
      showFkDetail: false,
      showThreeGroup: false,
    })
  },


  // 待解读列表进来的   帮我解读  学业提升
  // 微信支付
  WeiXinBuy(e) {
    let that = this;
    let userId = wx.getStorageSync('userId');
    var item;
    // 已登录立即参加
    if (that.data.hasToken) {

      var order_buy_type, order_price, order_type;
      let buyType = e.currentTarget.dataset.buytype;

      if (buyType == 0) {// 1:单独购买 2:3人团
        if (that.data.buyType == 1) {
          order_buy_type = 1;
          order_price = that.data.info.price;
        } else if (that.data.buyType == 2) {
          order_buy_type = 2;
          order_price = that.data.info.group_price;
        }
      } else {// 专家
        order_buy_type = 1;
        item = e.currentTarget.dataset.item;
        order_price = (that.data.inType == 3 ? item.guihua_special_price :
          that.data.inType == 22 ? item.zixun_special_price : item.read_special_price)
      }

      if (e.currentTarget.dataset.item) {
        item = e.currentTarget.dataset.item
      } else {
        // // inType:1是点申请解读去选专家解读 2:点帮我解读去选报告解读 3:学业提升 22:咨询
        // if (that.data.inType) {
        //   order_type = 6;
        // } else {
        //   order_type = 5;
        // }
      }
      order_type = that.data.info.type

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
      let data = item ? {
        user_id: userId,
        order_buy_type: order_buy_type,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
        order_type: order_type, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
        order_price: order_price,// 课程优惠价
        // order_price: 1,// 分
        expert_id: item.user_id,// 专家id(order_type=1,2,3必传)
        share_id: that.data.shareId, // 分享链接所属的合伙人id(登录状态下打开购买链接必传)
        addressId: that.data.addressId,// 实物邮寄地址(严选下的实物类型必传)
      } : {
          user_id: userId,
          order_buy_type: order_buy_type,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
          order_type: order_type, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
          order_price: order_price,// 课程优惠价
          // order_price: 1,// 分
          product_id: that.data.info.id,
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

          if (that.data.buyType == 1 || buyType == 1) {// 1:单独购买 2:3人团
            if (order_type == 4) {
              if (that.data.shareId) {
                wx.redirectTo({
                  url: '/pages/report/myreportList/myreportList'
                })
              } else {
                wx.navigateTo({
                  url: '/pages/report/myreportList/myreportList'
                })
              }
            } else {
              wx.navigateTo({
                url: '/pages/buySucc/buySucc?order_type=' + order_type,// 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
              })
            }
          } else if (that.data.buyType == 2) {
            if (order_type == 4) {
              if (that.data.shareId) {
                wx.redirectTo({
                  url: '/pages/report/myreportList/myreportList'
                })
              } else {
                wx.navigateTo({
                  url: '/pages/report/myreportList/myreportList'
                })
              }
            } else {
              wx.navigateTo({
                url: '/pages/groupDetail/groupDetail?isPuySuc=1&order_number=' + suc[0].order_number,// 订单编号
              })
            }
          }

        }).catch((e) => {
          console.log((e))
        })
      }).catch(() => {

      });

    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?nickname=' + that.data.info.product_name + '&shareId=' + that.data.shareId + '&shareType=4&id=' + that.data.courseId + '&inType=' + that.data.inType
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      experts: [],
      page: 1
    })
    that.expertList(1)
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
      that.expertList(curpage)
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

  // 获取专家列表
  expertList: function (page) {
    let that = this;
    API.expertList({
      page: page,
      pageSize: 10,
      type: that.data.type,
    }, app).then(res => {
      // console.log(JSON.stringify(res))
      wx.stopPullDownRefresh({})
      let experts = that.data.experts || [];

      let newExperts = experts.concat(res.list)

      that.setData({
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
        experts: newExperts,
      })

      if (that.data.experts.length < 15 || that.data.pages <= that.data.current) {
        that.setData({
          hasmore: false,
        })
      }
      wx.hideLoading();
      // 无数据时显示空页面
      if (unReadReport.length <= 0) {
        that.setData({
          hasmore: false,
        })
      }

    }).catch(() => {

    });
  },

  // 去专家详情页面
  toExpertDetail: function (e) {
    let that = this;
    // 已登录立即参加
    if (that.data.hasToken) {
      wx.navigateTo({
        url: '/pages/expert/expertDetail/expertDetail?id=' + e.currentTarget.dataset.id + "&inType=" + that.data.inType,// inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读,3:学业提升,22:咨询
      })
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?nickname=' + that.data.info.product_name + '&shareId=' + that.data.shareId + '&shareType=4&id=' + that.data.courseId + '&inType=' + that.data.inType
      })
    }
  },

  // 帮我解读
  toUndoReport: function (res) {
    let that = this;
    // 已登录立即参加
    if (that.data.hasToken) {
      let experts = res.currentTarget.dataset.item;// 专家信息
      wx.navigateTo({
        url: '/pages/report/reportList/reportList?experts=' + encodeURIComponent(JSON.stringify(experts)) + "&inType=2",// inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读
      })
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?nickname=' + that.data.info.product_name + '&shareId=' + that.data.shareId + '&shareType=4&id=' + that.data.courseId + '&inType=' + that.data.inType
      })
    }
  },

  toLogin: function () {
    // 已登录立即参团
    if (!that.data.hasToken) {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?nickname=' + that.data.info.product_name + '&shareId=' + that.data.shareId + '&shareType=4&id=' + that.data.courseId + '&inType=' + that.data.inType
      })
    }
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
    return {
      title: '天赋教养TOP',
      path: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + that.data.titleName + '&testType=' + that.data.testType + '&inType=' + that.data.inType + '&courseId=' + that.data.courseId + '&shareId=' + that.data.shareId
    }
  },

})