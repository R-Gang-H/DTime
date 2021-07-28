const API = require("../../utils/api.js")
const util = require("../../utils/util.js")

let app = getApp();

//----------------------------------申请成为合伙人/专家/高级合伙人---------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mType: '',//1成为专家,2成为合伙人,3成为高级合伙人,4成为专家待审核,5成为专家审核通过,6成为合伙人待审核,7成为合伙人审核通过
    applyText: '',
    chujiUrl: 'http://dtime.oss-cn-beijing.aliyuncs.com/uploads/20210521/47bf9347ebbce7defff283c8cf051ee8.jpg',
    gaojiUrl: 'http://dtime.oss-cn-beijing.aliyuncs.com/uploads/20210524/4d471039b4aedf215f2827343b1e3464.png',
    tutorUrl: 'https://dtime.oss-cn-beijing.aliyuncs.com/expert/img/applyteacher.png'
  },

  //申请成为xxx
  apply() {
    if (parseInt(this.data.mType) > 3) {
      return
    }

    if (this.data.type == 3) {
      let data = {
        user_id: wx.getStorageSync('userId'),
        type: this.data.type,//申请类型1=初级合伙人2=高级合伙人3=专家
      }
      API.apply(data, app).then(res => {
        wx.showModal({
          title: '提示',
          content: '您的申请已经提交，请耐心等待审核。',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 2,
              })
            }
          }
        })
      })
    } else {
      wx.navigateTo({
        url: '../applyIdentity/applyidentity?type=' + this.data.type,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options))
    util.updateMini()
    this.setData({
      type: parseInt(options.type),
      mType: parseInt(options.mType),
    })
    let type = this.data.type;
    let text = '';
    let mType = this.data.mType;
    if (mType) {
      switch (mType) {
        case 1:
          wx.setNavigationBarTitle({
            title: '成为专家',
          })
          text = '成为专家'
          break;
        case 2:
          wx.setNavigationBarTitle({
            title: '成为合伙人',
          })
          text = '成为合伙人'
          break;
        case 3:
          wx.setNavigationBarTitle({
            title: '成为高级合伙人',
          })
          text = '成为高级合伙人'
          break;
        case 4:
          wx.setNavigationBarTitle({
            title: '关于专家',
          })
          text = '待审核'
          break;
        case 5:
          wx.setNavigationBarTitle({
            title: '关于专家',
          })
          text = '审核通过'
          break;
        case 6:
          wx.setNavigationBarTitle({
            title: '关于合伙人',
          })
          text = '待审核'
          break;
        case 7:
          wx.setNavigationBarTitle({
            title: '关于合伙人',
          })
          text = '审核通过'
          break;
      }
    } else {
      // 1=初级合伙人2=高级合伙人3=专家
      switch (type) {
        case 1:
          wx.setNavigationBarTitle({
            title: '成为初级合伙人',
          })
          text = '我要申请'
          break;
        case 2:
          wx.setNavigationBarTitle({
            title: '成为高级合伙人',
          })
          text = '我要申请'
          break;
        case 3:
          wx.setNavigationBarTitle({
            title: '成为专家',
          })
          text = '我要申请'
          break;
      }
    }
    this.setData({
      applyText: text
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})