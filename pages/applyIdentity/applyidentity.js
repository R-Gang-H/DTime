const API = require("../../utils/api.js")
const util = require("../../utils/util.js")
var ossUp = require('../../utils/ossUp.js')
let app = getApp();

//----------------------------------申请成为合伙人/专家 并填写数据---------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    question1Text: '1. 您拥有一个或多个超过200人的群， 是么？',
    question2Text: '2. 请您上传一张或多张群截屏？',
    question3Text: '3. 您是否有额外补充？',
    selectList: [''],//选择的图片
    show: true,//展示选择图标
    inputText: '',//输入内容
    check: true,
  },

  //选项
  check(e) {
    this.setData({
      check: !e.currentTarget.dataset.type
    })
  },

  //提交申请
  submit() {
    if (this.data.type == "2") {//初级合伙人
      if (this.data.selectList[0].length == 0) {
        wx.showToast({
          title: '请上传群截图',
          icon: 'none'
        })
        return
      }
      if (this.data.inputText.length == 0) {
        wx.showToast({
          title: '请输入补充内容',
          icon: 'none'
        })
        return
      }
    }
    let inputText = this.data.inputText
    let type = this.data.type
    let check = ''
    if (this.data.check) {
      check = '1'
    } else {
      check = '2'
    }
    let imgs = ''
    if (this.data.selectList[0].length > 0) {//有图片
      let array = []
      this.data.selectList.forEach(i => {
        if (i.length > 0) {
          array.push(i)
        }
      })
      for (let index = 0; index < array.length; index++) {
        const item = array[index];
        wx.showLoading({
          title: '正在上传中',
        })
        ossUp.upload({
          filePath: item,
          dir: 'images/',
          success(url) {
            wx.hideLoading()
            imgs += url + ","
            if (item == array[array.length - 1]) {
              imgs = imgs.substring(0, imgs.length - 1)
              let data = {
                user_id: wx.getStorageSync('userId'),
                type: type,//申请类型1=初级合伙人2=高级合伙人3=专家
                has_more_fans: check,//1=是2=否
                images: imgs,//群截图（申请初级必填）
                content: inputText//额外补充（申请初级必填）
              }
              API.apply(data, app).then(res => {
                wx.navigateBack({
                  delta: 2,
                })
              })
            }
          }
        })
      }
    }
  },


  //长按删除图片
  delImg(e) {
    if (this.data.selectList[e.currentTarget.dataset.index].length == 0) {
      return
    }
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否删除当前图片',
      success(res) {
        if (res.confirm) {
          let array = that.data.selectList
          array.splice(e.currentTarget.dataset.index, 1)
          array.push('')
          that.setData({
            selectList: array
          })
        }
      }
    })
  },

  //选择图片
  selectImg(e) {
    //最多选取三张图片
    if (this.data.selectList[e.currentTarget.dataset.index].length != 0) {
      wx.previewImage({
        urls: [this.data.selectList[e.currentTarget.dataset.index]],
      })
      return
    }
    let that = this
    if (e.currentTarget.dataset.index == this.data.selectList.length - 1) {//选择图片
      wx.chooseImage({
        count: 1,
        success(res) {
          let url = res.tempFilePaths[0]
          let array = that.data.selectList
          for (let index = 0; index < that.data.selectList.length; index++) {
            console.log(index + '------' + that.data.selectList.length)
            const element = that.data.selectList[index];
            if (element.length == 0 && index < 2) {
              array[index] = url
              array.push('')
              break
            }
            if (index == 2) {
              array[index] = url
            }
          }
          console.log(array.length)
          that.setData({
            selectList: array
          })
        }
      })
    }
  },


  //获取输入框内容
  getFeedback(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  //点击获取焦点
  getFocus(e) {
    this.setData({
      focus: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options))
    util.updateMini()
    this.setData({
      type: options.type
    })
    let text = ''
    switch (this.data.type) {
      case "1"://成为初级合伙人
        text = '申请初级合伙人'
        break;
      case "2"://成为高级合伙人
        text = '申请高级合伙人'
        break
      case "3"://成为专家
        text = '申请专家'
        break;
    }
    wx.setNavigationBarTitle({
      title: text,
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})