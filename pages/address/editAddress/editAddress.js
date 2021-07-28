// pages/address/editAddress/editAddress.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js');

const app = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['省', '市', '区'],
    customItem: '全部',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    util.updateMini()
    that = this;
    var addType = options.addType;
    console.log(addType)
    that.setData({
      addType: addType,// 1是新增，2是编辑
    })

    if (addType == 2) {
      var addInfo = JSON.parse(options.addInfo);
      that.setData({
        addInfo: addInfo,// 1是新增，2是编辑
        name: addInfo.name,
        tel: addInfo.mobile,
        addressDet: addInfo.address,
      })
    }

  },

  bindName(e) {
    var name = e.detail.value
    console.log('收货人', name)
    this.setData({
      name: name
    })
  },

  bindTel(e) {
    var telPhone = e.detail.value
    console.log('手机号', telPhone)
    this.setData({
      tel: telPhone
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
    })

    if (that.data.addType == 2) {
      let editInfo = that.data.addInfo;
      editInfo.province = that.data.region[0];
      editInfo.city = that.data.region[1];
      editInfo.area = that.data.region[2];
      that.setData({
        addInfo: editInfo,// 1是新增，2是编辑
      })
    }
  },

  bindAddress(e) {
    var address = e.detail.value
    console.log('地址', address)
    this.setData({
      addressDet: address
    })
  },


  // 提交
  submitAddress: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');
    if (that.data.addType == 1) {// 1是新增，2是编辑
      // 添加我的收货地址
      API.addUserAddress({
        user_id: userId,
        name: that.data.name,
        mobile: that.data.tel,
        province: that.data.region[0],
        city: that.data.region[1],
        area: that.data.region[2],
        address: that.data.addressDet,
      }, app).then(res => {
        console.log("添加地址成功", JSON.stringify(res))
        wx.navigateBack({
          delta: 0,
        })
        wx.hideLoading();
      }).catch(() => {

      });
    }

    if (that.data.addType == 2) {// 1是新增，2是编辑
      // 编辑我的收货地址
      API.updateUserAddress({
        id: that.data.addInfo.id,
        name: that.data.name,
        mobile: that.data.tel,
        province: that.data.region[0],
        city: that.data.region[1],
        area: that.data.region[2],
        address: that.data.addressDet,
      }, app).then(res => {
        console.log("编辑地址成功", JSON.stringify(res))
        wx.navigateBack({
          delta: 0,
        })
        wx.hideLoading();
      }).catch(() => {

      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})