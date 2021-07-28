const API = require('../../utils/api.js');
const util = require('../../utils/util.js')

const app = getApp();

var that;

//-----------------------------------浏览记录-----------------------------------------

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cterm: 1,
    brl: 120,
    isCheck: false,
    hasmore: true,
    current: 1,
    collectList: [],
    allChecked: false,// 全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    that.getUserCollectList(1)
  },

  // 全选
  allChecked() {
    const items = that.data.collectList
    const values = []
    for (let i = 0; i < items.length; i++) {
      items[i].checked = !that.data.allChecked
      values.push(items[i].id)
    }
    console.log('checkbox发生全选', values)
    that.setData({
      collectList: items,
      product_ids: values,
    })
    if (!that.data.allChecked) {
      that.setData({
        allChecked: values.length >= items.length,// 全选
      })
    } else {
      that.setData({
        allChecked: false,// 取消全选
      })
    }
  },

  // 单选
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    const items = that.data.collectList
    const values = e.detail.value
    for (let i = 0; i < items.length; i++) {
      items[i].checked = false
      for (let j = 0; j < values.length; j++) {
        if (items[i].id == values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    that.setData({
      collectList: items,
      product_ids: values,
      allChecked: values.length >= items.length,// 全选
    })
  },

  //编辑
  editTap() {
    var isCheck = that.data.isCheck
    that.setData({
      isCheck: !isCheck
    })
  },

  //删除选中
  delCollectPro() {
    let delList = []
    if (this.data.collectList.length > 0) {
      this.data.collectList.forEach(item => {
        if (item.checked) {
          delList.push(item)
        }
      })
      if (delList.length == 0) {
        wx.showToast({
          title: '请选择删除选项',
          icon: 'none'
        })
        return
      }
      let ids = []
      delList.forEach(item => {
        ids.push(item.id)
      })
      let data = {
        user_id: wx.getStorageSync('userId'),
        product_ids: ids
      }
      API.delRecords(data, app).then(res => {
        wx.showToast({
          title: '删除成功',
        })
        this.getUserCollectList()
      })
    }
  },

  // 我的-收藏列表
  getUserCollectList: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');
    var current = that.data.current;
    if (current == 1) {
      that.setData({
        newCollect: []
      })
    }
    let data = {
      user_id: userId,
      page: current,
      pageSize: 15,
    }
    API.getScanList(data, app).then(res => {
      // 关闭下来刷新
      wx.stopPullDownRefresh()

      res.list.forEach(item => {
        that.data.newCollect.push(item)
      })

      that.setData({
        collectList: that.data.newCollect,
        // collectList: [{},{}],
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
      })

      if (that.data.collectList.length < 15 || that.data.pages <= that.data.current) {
        that.setData({
          hasmore: false,
        })
      }
      wx.hideLoading();
      // 无数据时显示空页面
      if (that.data.collectList.length <= 0) {
        that.setData({
          hasmore: false,
        })
      }
    })
  },

  // 课程详情
  toCourseDetail: function (res) {
    var courseId = res.currentTarget.dataset.id
    console.log(courseId)
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + courseId + "&openType=" + 1,// 1:商品详情 2:推荐朋友、三人团,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.setData({
      current: 1
    })
    that.getUserCollectList(that.data.cterm)

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
      that.getUserCollectList(that.data.cterm)
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

})