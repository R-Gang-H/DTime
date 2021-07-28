// pages/report/reportList/reportList.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasmore: true,
    current: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    util.updateMini()
    if (options.experts && options.experts != "undefined") {
      let experts = JSON.parse(decodeURIComponent(options.experts));
      console.log(experts)
      this.setData({
        experts: experts,// 专家信息
      })
    }
    if (options.inType) {
      this.setData({
        inType: options.inType, // inType:1是点申请解读去选专家解读 2:点帮我解读去选报告解读
      })
    }

  },


  onShow: function () {
    this.getUnreadReport();
  },

  // 待解读报告
  getUnreadReport() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');
    var current = that.data.current;
    if (current == 1) {
      that.setData({
        newUnReadReport: []
      })
    }
    API.getUnreadReport({
      user_id: userId,
      page: current,
      pageSize: 15,
    }, app).then(res => {
      // 关闭下来刷新
      wx.stopPullDownRefresh()
      console.log(JSON.stringify(res.list))

      res.list.forEach(item => {
        that.data.newUnReadReport.push(item)
      })

      that.setData({
        unReadReport: that.data.newUnReadReport,
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
      })

      if (that.data.unReadReport.length < 15 || that.data.pages <= that.data.current) {
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

  // 查看报告
  toReport: function (e) {
    var item = e.currentTarget.dataset.item
    wx.redirectTo({
      url: '../../report/reportResult/reportResult?typeUlr=1&reportId=' + item.report_id,
    })
  },

  // 申请解读
  toMoreExpert: function (e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/expert/expertList/expertList?reportId=' + item.report_id + "&inType=1",// inType:1是点申请解读去选专家解读
    })
  },

  // 专家列表进来的   申请解读
  toMyUndo(e) {
    let that = this;
    var item = e.currentTarget.dataset.item
    let userId = wx.getStorageSync('userId');
    API.makeOrder({
      user_id: userId,
      order_buy_type: 1,// 购买方式1=单独购买2=团购3=接龙4合伙人团购
      order_type: 1, // 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
      order_price: that.data.experts.read_special_price,// 解读优惠价
      report_id: item.report_id, // 测评id(order_type=1必传)
      expert_id: that.data.experts.user_id,// 专家id(order_type=1,2,3必传)
    }, app).then(res => {
      console.log("申请解读==" + JSON.stringify(res))
      app.pay(res[0].order_number, (suc) => {
        console.log(("支付成功" + JSON.stringify(suc)))

        wx.redirectTo({
          url: '../../buySucc/buySucc?order_type=1',// 订单类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选
        })

      }).catch((e) => {
        console.log((e))
      })

    }).catch(() => {

    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      current: 1
    })
    this.getUnreadReport()

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
      that.getUnreadReport()
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

})