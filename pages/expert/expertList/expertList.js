// pages/expert/expertList/expertList.js
const API = require('../../../utils/api.js');
const util =require('../../../utils/util.js')

const app = getApp();

var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore: true,
    experts: [],
    page: 1,
    reportId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    console.log("options==" + JSON.stringify(options))
    if (options.product) {
      that.setData({
        product: JSON.parse(options.product)
      })
      if (that.data.hasToken) {
        that.getProductDetail(JSON.parse(options.product).id);
      }
    }
    if (options.reportId) {
      that.setData({
        reportId: options.reportId,
      })
    }
    if (options.inType) {
      that.setData({
        inType: options.inType, // inType:1是点申请解读去选专家解读 2:点帮我解读去选报告解读 3:学业提升
        showJG: options.showJG == 1, // 不显示按钮价格
      })
      if (options.inType == 2) {
        that.getTestProduct()
      }
    }
    if (options.titleName) {
      wx.setNavigationBarTitle({
        title: options.titleName,
      })
    }
    that.setData({
      isPuySuc: options.isPuySuc == 1,// 1:购买成功，2:参加
      type: options.type, // 1=解读2=咨询3=学业规划vip服务
      shareId: options.shareId,// 分享用户
      shareType: options.shareType,// 分享类型 1：拼团邀请 2：合伙人邀请 3：商品详情 4：解读详情 5：测评详情 6：群接龙
    })

    this.expertList(1)
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
          url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=4&reportId=' + that.data.reportId,// 报告id
        })
      }, 500)
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
        info: courseDetail.info,// 课程详情
        detailImages: courseDetail.info.detail_images ? courseDetail.info.detail_images.split(',') : '',// 详情图片
      })
    }).catch(() => {

    });
  },

  // 获取测评商品id/价格
  getTestProduct() {

    API.getTestProduct({
      type: 4
    }, app).then(res => {
      // (分)
      // console.log("测评商品id/价格" + JSON.stringify(res))
      that.setData({
        testProduct: res[0],
        detailImages: res[0].detail_images ? res[0].detail_images.split(',') : '',// 详情图片
      })
    }).catch(() => {
    });
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
        url: '/pages/expert/expertDetail/expertDetail?id=' + e.currentTarget.dataset.id + "&inType=" + this.data.inType + "&reportId=" + that.data.reportId + '&showJG=1',// inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读,  showJG 1:不显示按钮价格
      })
    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=4&reportId=' + that.data.reportId,// 报告id
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
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=4&reportId=' + that.data.reportId,// 报告id
      })
    }
  },

  // 待解读列表进来的   帮我解读  学业提升
  toMyUndo(e) {
    let that = this;
    var item = e.currentTarget.dataset.item
    let userId = wx.getStorageSync('userId');

    // 已登录立即参加
    if (that.data.hasToken) {

      var order_type;
      if (that.data.inType == 3) {
        order_type = 3
      } else if (that.data.inType == 1 || that.data.inType == 2) {
        order_type = 1
      }
      API.makeOrder({
        user_id: userId,
        order_buy_type: 1,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
        order_type: order_type, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
        order_price: item.read_special_price,// 解读优惠价
        report_id: that.data.reportId, // 测评id(order_type=1必传)
        expert_id: item.user_id,// 专家id(order_type=1,2,3必传)
      }, app).then(res => {
        if (that.data.inType == 3) {
          console.log("帮我提升学业==" + res)
        } else {
          console.log("申请解读==" + res)
        }
        app.pay(res[0].order_number, (suc) => {
          console.log(("支付成功" + JSON.stringify(suc)))

          wx.redirectTo({
            url: '../../buySucc/buySucc?order_type=' + order_type,// 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
          })

        }).catch((e) => {
          console.log((e))
        })
      }).catch(() => {

      });

    } else {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo?shareId=' + that.data.shareId + '&shareType=4&reportId=' + that.data.reportId,// 报告id
      })
    }
  },
})