// pages/collect/collect.js
const API = require('../../utils/api.js');
const util = require('../../utils/util.js')

const app = getApp();

var that;

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
    that.getUserCollectList(that.data.cterm)
  },

  editTap() {
    var isCheck = that.data.isCheck
    that.setData({
      isCheck: !isCheck
    })
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

  //切换顶部的筛选条件
  switchTerm: function (e) {
    let id = e.currentTarget.dataset.id;
    let brl = e.currentTarget.dataset.brl;
    let that = this;
    that.setData({
      cterm: parseInt(id),
      brl: parseInt(brl)
    })
    this.setData({
      current: 1,
      product_ids: '',
      allChecked: false,// 全选
    })
    that.getUserCollectList(id)
  },

  // 我的-收藏列表
  getUserCollectList: function (type) {
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
      type: type,// 类型：1=自研2=严选
      page: current,
      pageSize: 15,
    }
    API.getUserCollectList(data, app).then(res => {
      console.log("我的-收藏列表", JSON.stringify(res.list))
      // 关闭下来刷新
      wx.stopPullDownRefresh()

      res.list.forEach(item => {
        that.data.newCollect.push(item)
      })

      that.setData({
        collectList: that.data.newCollect,
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

  // 取消收藏
  delCollectPro: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var userId = wx.getStorageSync('userId')
    var productIds = that.data.product_ids;
    var ids = ''
    productIds.forEach((item, index) => {
      if (index > 0) {
        ids += ',';
      }
      ids += item;
    });
    console.log("取消收藏ids", ids)
    API.delCollectProducts({
      user_id: userId,
      product_ids: ids, // 产品id
    }, app).then(res => {
      console.log("取消收藏成功==" + JSON.stringify(res))
      this.setData({
        current: 1
      })
      wx.hideLoading();
      that.getUserCollectList(that.data.cterm)
    }).catch(() => {

    });
  },

  // 课程详情
  toCourseDetail: function (e) {
    var item = e.currentTarget.dataset.item

    if (that.data.cterm == 1) {

      if (item.type == 5) {// "type":"产品类型1=解读2=咨询3=学业提升4=测评5=21天训练营6=严选7=导师认证",
        wx.navigateTo({
          url: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + item.product_name,
        })
      } else {
        let inType = 3
        switch (item.type) {
          case 1:
            inType = 2
            break;
          case 2:
            inType = 22
            break;
          case 3:
            inType = 3
            break;
        }
        wx.navigateTo({
          url: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + item.product_name + '&courseId=' + item.id + "&inType=" + inType + "&type=" + item.type,// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询
        })
      }

    } else {

      var courseId = item.id
      console.log(courseId)
      wx.navigateTo({
        url: '/pages/courseDetail/courseDetail?courseId=' + courseId + "&openType=1&isShow=" + that.data.cterm,// 1:商品详情 2:推荐朋友、三人团,
      })

    }

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