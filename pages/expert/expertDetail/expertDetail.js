// pages/expert/expertDetail/expertDetail.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportId: '',
    loading: true,      //地图背景未加载完，显示loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    console.log(options)
    if (options.id) {
      this.setData({
        id: options.id,// 专家id
      })
      this.expertDetail(options.id)
    }
    if (options.inType) {
      this.setData({
        inType: options.inType, // inType:1是点申请解读去选专家解读 2:点帮我解读去选报告解读 3:学业提升 22:咨询
        showJG: options.showJG == 1, // 不显示按钮价格
      })
    }
    if (options.reportId) {
      this.setData({
        reportId: options.reportId,
      })
    }
  },

  /**
    * 图片加载完成方法
    */
  _imgLoadEvent: function (event) {
    this.setData({
      loading: false
    })
  },

  toLogin: function () {
    // 已登录立即参团
    if (!that.data.hasToken) {
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo',// 
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
      // 跳转登录页面
      wx.redirectTo({
        url: '/pages/auth/authUserInfo/authUserInfo',// 
      })
    }
  },

  ///获取专家详情
  expertDetail: function (user_id) {
    let that = this;
    API.expertDetail({
      expert_id: user_id
    }, app).then(res => {
      // console.log(res)
      that.setData({
        expert: res,
        loading: res.expert_img,
      })
    }).catch(() => {

    });
  },

  // 帮我解读
  toUndoReport: function (res) {
    let that = this;
    let experts = that.data.expert;// 专家信息
    wx.navigateTo({
      url: '/pages/report/reportList/reportList?experts=' + encodeURIComponent(JSON.stringify(experts)) + "&inType=" + that.data.inType,// inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读
    })
  },


  // 待解读列表进来的   帮我解读  学业提升
  toMyUndo(e) {
    let that = this;
    var item = that.data.expert
    let userId = wx.getStorageSync('userId');
    var order_type, order_price;
    if (that.data.inType == 3) {
      order_type = 3
      order_price = item.guihua_special_price
    } else if (that.data.inType == 22) {
      order_type = 2
      order_price = item.zixun_special_price
    } else if (that.data.inType == 1 || that.data.inType == 2) {
      order_type = 1
      order_price = item.read_special_price
    }

    API.makeOrder({
      user_id: userId,
      order_buy_type: 1,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
      order_type: order_type, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
      order_price: order_price,// 优惠价
      report_id: that.data.reportId, // 测评id(order_type=1必传)
      expert_id: item.expert_id // 专家id(order_type=1,2,3必传)
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
  },
})