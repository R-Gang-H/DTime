const API = require('../../utils/api.js');
const util = require('../../utils/util.js')

const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishavereport: false,
    HOMESHAREIMG: API.HOMESHAREIMG,
    xunlianying: {
      price: 1000,
      type: 5,
      product_name: '21天训练营'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log('options==' + JSON.stringify(options))
    util.updateMini()
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
    let isQudao = wx.getStorageSync('isQudao') // 身份权限
    console.log("权限：" + JSON.stringify(isQudao))

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0, //这个数字是当前页面在tabBar中list数组的索引
        isQudao: isQudao == 1,// 是合伙人
      })
    }

    this.getAdList();
    this.getHomeData();

    var authUserInfo = wx.getStorageSync('authUserInfo');
    if (authUserInfo) {
      that.setData({
        hasToken: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  // 获取首页数据
  getHomeData: function () {
    let that = this;
    let userId = wx.getStorageSync('userId');
    API.index({
      user_id: userId
    }, app).then(res => {
      let home = res;
      // console.log("首页数据==", JSON.stringify(res))
      // 状态0=已有基本信息,未做完;1=已生成测评报告2=已购买待解读3=已解读 4=直接购买/赠送的测评
      let ishavereport;
      if (home.hasPayUntest && home.unfinishTest && home.unReadReport && home.hasPayUnreadReport && home.readReport) {
        ishavereport = home.hasPayUntest.length || home.unfinishTest.length || home.unReadReport.length || home.hasPayUnreadReport.length || home.readReport.length;
      }
      that.setData({
        home: home,
        ishavereport: ishavereport
      })
    }).catch(() => {

    });
  },

  // 已解读报告
  showExpert: function () {
    wx.showToast({
      title: '报告已完成',
    })
  },

  ///获取轮播图
  getAdList: function () {
    let that = this;
    API.getAdList({
      position: 1
    }, app).then(res => {
      // console.log("轮播图", JSON.stringify(res))
      that.setData({
        ads: res.list
      })
    }).catch(() => {

    });
  },

  // 轮播图跳转
  toLunbo: function (res) {
    var item = res.currentTarget.dataset.item
    console.log("点击轮播图", item)
    // 类型 1产品 2链接 3图片
    if (item.type == 1) {
      console.log(item.product_id)
      wx.navigateTo({
        url: '/pages/courseDetail/courseDetail?courseId=' + item.product_id + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
      })
    }
    if (item.type == 2) {
      wx.navigateTo({
        url: '/pages/report/reportResult/reportResult?typeUlr=2&linkUrl=' + item.link_url,
      })
    }
    if (item.type == 3) {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: item.image_list ? item.image_list.split(',') : [] // 需要预览的图片http链接列表
      })
    }
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
      url: '../infobasic/infobasic?topic_types=' + topic_types + '&isPuy=' + isPuy + "&reportId=" + reportId,
    })
  },

  // 继续答题
  toQuestion(e) {
    var item = e.currentTarget.dataset.item
    // 状态0=已有基本信息,未做完;1=已生成测评报告2=已购买待解读3=已解读 4=直接购买/赠送的测评
    if (item.status == 0) {
      //  url: '../topic/topic?item=' + encodeURIComponent(item),
      wx.navigateTo({
        url: '../topic/topic?reportId=' + item.report_id,
      })
    }
  },

  // 查看报告
  toReport: function (e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../report/reportResult/reportResult?typeUlr=1&reportId=' + item.report_id,
    })
  },

  // 专家解读报告
  toReport1: function (e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../report/reportResult/reportResult?typeUlr=3&reportId=' + item.report_id,
    })
  },

  // 申请解读
  toUndoExpert: function (e) {
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/expert/expertList/expertList?inType=1&type=1&reportId=' + item.report_id,
    })
  },

  // 天赋解读
  toTfExpert: function () {
    // wx.navigateTo({
    //   url: '/pages/expert/expertList/expertList?inType=2&titleName=DTiME天赋测评1v1专家解读&type=1',
    // })
    wx.navigateTo({
      url: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=DTiME天赋测评1v1专家解读&type=1&testType=4',// type获取专家列表,1=解读  testType获取自营商品信息,4天赋解读
    })
  },

  // 专家列表
  toMoreExpert: function () {
    wx.navigateTo({
      url: '/pages/expert/expertList/expertList?inType=2&showJG=1', // showJG 1:不显示按钮价格
    })
  },

  // 我的报告
  toMoreReport: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/report/myreportList/myreportList',
    })
  },

  // 帮我解读
  toUndoReport: function (res) {
    let that = this;
    let experts = res.currentTarget.dataset.item;// 专家信息
    wx.navigateTo({
      url: '/pages/report/reportList/reportList?experts=' + encodeURIComponent(JSON.stringify(experts)) + "&inType=2",// inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读
    })
  },

  // 去专家详情页面
  toExpertDetail: function (res) {
    let id = res.currentTarget.dataset.id;// 专家信息
    wx.navigateTo({
      url: '/pages/expert/expertDetail/expertDetail?id=' + id + "&inType=2&showJG=1",// inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读  showJG 1:不显示按钮价格
    })
  },

  // 21天训练营
  toXunLY: function (e) {
    let that = this;
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + item.product_name + "&type=" + item.type + '&testType=3',// type获取专家列表,5训练营  testType获取自营商品信息,3训练营
    })
  },

  // 学业提升
  toProduct: function (e) {
    let that = this;
    var item = e.currentTarget.dataset.item

    let inType = 5
    switch (item.type) {// "type":"产品类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选7=导师认证",
      case 1:
        inType = 2
        break;
      case 2:
        inType = 22
        break;
      case 3:
        inType = 3
        break;
      case 5:
        inType = 5
        break;
      case 7:
        inType = 7
        break;
    }
    wx.navigateTo({
      url: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + item.product_name + '&courseId=' + item.id + "&inType=" + inType + "&type=" + item.type,// inType: 2:点帮我解读去选报告解读 22:咨询 3:学业提升
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '天赋教养TOP',
      imageUrl: that.data.HOMESHAREIMG,
      path: '/pages/index/index'
    }
  },


})