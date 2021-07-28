// pages/report/myreportList/myreportList.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js');

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
    if (options.experts) {
      let experts = JSON.parse(options.experts);
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
    this.getAllTest();
  },

  // 我的报告列表
  getAllTest() {
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
    API.getAllTest({
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

      console.log('getAllTest = ', that.data.newUnReadReport)


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
      if (that.data.unReadReport.length <= 0) {
        that.setData({
          hasmore: false,
        })
      }

    }).catch(() => {

    });
  },

  //测评
  toAssess(e) {
    var topic_types = e.currentTarget.dataset.types
    var item = e.currentTarget.dataset.item
    var reportId;
    if (item && item.report_id) {
      reportId = item.report_id
    }
    var isPuy = e.currentTarget.dataset.ispuy  // 1未支付，未填写个人信息 2邀请已支付，未填写个人信息
    wx.navigateTo({
      url: '../../infobasic/infobasic?topic_types=' + topic_types + '&isPuy=' + isPuy + "&reportId=" + reportId,
    })
  },

  // 继续答题
  toQuestion(e) {
    var item = e.currentTarget.dataset.item
    // 状态0=已有基本信息,未做完;1=已生成测评报告2=已购买待解读3=已解读 4=直接购买/赠送的测评
    if (item.status == 0) {
      //  url: '../topic/topic?item=' + encodeURIComponent(item),
      wx.navigateTo({
        url: '../../topic/topic?reportId=' + item.report_id,
      })
    }
  },

  // 查看报告
  toReport: function (e) {
    var item = e.currentTarget.dataset.item
    wx.redirectTo({
      url: '../../report/reportResult/reportResult?typeUlr=1&reportId=' + item.report_id,
    })
  },

  // 专家解读报告
  toReport1: function (e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../../report/reportResult/reportResult?typeUlr=3&reportId=' + item.report_id,
    })
  },

  // 申请解读
  toMoreExpert: function (e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/expert/expertList/expertList?reportId=' + item.report_id + "&inType=1&type=1",// inType:1是点申请解读去选专家解读
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      current: 1
    })
    this.getAllTest()

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
      that.getAllTest()
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

})