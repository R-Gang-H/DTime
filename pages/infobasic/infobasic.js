// pages/infobasic/infobasic.js
const API = require('../../utils/api.js')
const util = require('../../utils/util.js')

var app = getApp();

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'],
    sex: 1,// 1男，2女
    sexIndex: 0,// 0男，1女
    birthday: '',// 生日
    paytype: 0,// 支付方式1=邀请码2=微信支付3=已支付/赠送
    yqCode: '',// 邀请码
    tel: '',// 手机号
    reportId: '',// 测评id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('11111' + options.reportId)
    util.updateMini()
    let authuser = wx.getStorageSync('authUserInfo');
    let jkuser = wx.getStorageSync('jkUserinfo');
    that = this;
    console.log('options==' + JSON.stringify(options)
      + "\n授权信息" + JSON.stringify(authuser)
      + "\n接口信息" + JSON.stringify(jkuser))
    var date = new Date();
    var birthday = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate()
    that.setData({
      topic_types: options.topic_types, // 测试类型1=家长2=孩子
      isPuy: options.isPuy, // 1未支付，未填写个人信息 2邀请已支付，未填写个人信息
      authuser: authuser,
      jkuser: jkuser,
      birthday: birthday,
      tel: jkuser.username,
    })
    if (options.reportId) {
      that.setData({
        reportId: options.reportId,
        paytype: options.isPuy == 2 ? 3 : 0,
      })
    }

    that.getTestProduct()

  },

  // 获取测评商品id/价格
  getTestProduct() {

    API.getTestProduct({
      type: this.data.topic_types
    }, app).then(res => {
      // (分)
      console.log("测评商品id/价格" + JSON.stringify(res))
      that.setData({
        testProduct: res[0]
      })
    }).catch(() => {
    });
  },

  // 获取姓名
  bindName(e) {
    var nickName = e.detail.value
    console.log('手机号', nickName)
    this.setData({
      nickName: nickName
    })
  },
  //性别
  bindSexPicker: function (e) {
    var sex = parseInt(e.detail.value) + 1;
    console.log('性别1男2女值为', sex)
    this.setData({
      sex: sex,
      sexIndex: e.detail.value
    })
  },

  //生日
  bindDateChange: function (e) {
    console.log('生日为', e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },

  // 支付方式
  radioChange(e) {
    var paytype = e.detail.value
    console.log('支付方式：', paytype)

    this.setData({
      paytype: paytype,
    })
  },

  // 获取手机号
  bindTel(e) {
    var telPhone = e.detail.value
    console.log('手机号', telPhone)
    this.setData({
      tel: telPhone
    })
  },

  // 邀请码
  bindCode(e) {
    var yqCode = e.detail.value
    console.log('邀请码：', yqCode)
    this.setData({
      yqCode: yqCode
    })
  },

  conTinue: function (res) {
    if (!that.data.nickName) {
      wx.showToast({
        title: '请输入姓名',
      })
      return;
    }
    if (!that.data.tel) {
      wx.showToast({
        title: '请输入联系方式',
      })
      return;
    }

    this.setData({
      showFkDetail: true,
    })
  },
  cancelFkDetail() {
    this.setData({
      showFkDetail: false,
    })
  },

  // 提交测试基本信息（支付需要下单）
  setTestBaseInfo(e) {

    var paytype = e.currentTarget.dataset.value
    console.log('支付方式：', paytype)

    this.setData({
      paytype: paytype,
    })

    if (!that.data.testProduct) {
      wx.showToast({
        icon: 'error',
        title: '商品信息为空',
      })
      return
    }
    if (!that.data.nickName) {
      wx.showToast({
        icon: 'error',
        title: '请输入姓名',
      })
      return;
    }
    if (!that.data.tel) {
      wx.showToast({
        icon: 'error',
        title: '请输入联系方式',
      })
      return;
    }

    if (that.data.paytype == 1 && that.data.yqCode == '') {
      wx.showToast({
        icon: 'error',
        title: '请输入邀请码',
      })
      return;
    }
    var data = {
      user_id: that.data.jkuser.user_id,
      paytype: that.data.paytype,
      topic_types: that.data.topic_types,
      name: that.data.nickName,
      birthday: that.data.birthday,
      tel: that.data.tel,
      sex: that.data.sex,
      report_id: that.data.reportId,
      code: that.data.yqCode,
      product_id: that.data.testProduct.id,
      order_price: that.data.testProduct.price
      // order_price: 1,// 分
    }
    console.log('基本信息购买', data)

    API.setTestBaseInfo(data, app).then(success => {
      console.log(JSON.stringify(success))
      if (that.data.paytype == 1  // 支付方式1=邀请码2=微信支付3=已支付/赠送
        || that.data.isPuy == 2  // 1未支付，未填写个人信息 2邀请已支付，未填写个人信息
      ) {
        wx.redirectTo({
          url: '../topic/topic?reportId=' + success[0].report_id,
        })
      } else {
        app.pay(success[0].order_number, (suc) => {
          console.log(("支付成功" + JSON.stringify(suc)))
          wx.redirectTo({
            url: '../topic/topic?reportId=' + suc[0].member_answer_id,
          })
        }).catch((e) => {
          console.log((e))
        })
      }
    }).catch((error) => {
      console.log((error))
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})