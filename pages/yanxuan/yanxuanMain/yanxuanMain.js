// pages/yanxuan/yanxuanMain/yanxuanMain.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

let app = getApp();

let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifies: [
      {
        "iconImages": "/images/quanbu.png",
        "name": "全部"
      },
      {
        "iconImages": "/images/biaoyanxing.png",
        "name": "表演型"
      },
      {
        "iconImages": "/images/sikaoxing.png",
        "name": "思考型"
      },
      {
        "iconImages": "/images/famingxing.png",
        "name": "发明型"
      },
      {
        "iconImages": "/images/shengchanxing.png",
        "name": "生产型"
      },
      {
        "iconImages": "/images/guanxixing.png",
        "name": "关系型"
      },
    ],
    ///当前推荐人
    ctuijianren: {},
    hotCourses: [],
    haveMore: true,
    page: 1,
    HOMESHAREIMG:API.HOMESHAREIMG,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log('options==' + JSON.stringify(options))
    util.updateMini()
    let rect = wx.getMenuButtonBoundingClientRect()
    this.setData({
      topbarHeigth: rect.top + rect.height,
      menuButtonHeight: rect.height,
      menuButtonTop: rect.top,
    })

    this.getAdList();
    this.getTagList();
    this.getProductList(1);
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
        selected: 1, //这个数字是当前页面在tabBar中list数组的索引
        isQudao: isQudao == 1,// 是合伙人
      })
    }

    var authUserInfo = wx.getStorageSync('authUserInfo');
    if (authUserInfo) {
      that.setData({
        hasToken: true,
      })
      // 获取我的测评人列表
      this.getMyTestUser();
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      hotCourses: [],
      haveMore: true,
      page: 1
    })
    that.getProductList(1)
    let ctuijianren = that.data.ctuijianren;
    if (JSON.stringify(ctuijianren) != '{}') {
      that.getRecommendProductList(ctuijianren.id);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (that.data.haveMore == true) {
      that.getProductList(that.data.page)
    }
  },

  // 获取我的测评人列表
  getMyTestUser: function (e) {
    let that = this;
    let user_id = wx.getStorageSync('userId');
    API.getMyTestUser({
      user_id: user_id
    }, app).then(res => {
      let ctuijianren = that.data.ctuijianren;
      if (JSON.stringify(ctuijianren) == '{}' && res.length) {
        ctuijianren = res[0]
        that.getRecommendProductList(ctuijianren.id);
      }
      that.setData({
        testers: res,
        ctuijianren: ctuijianren
      })
    }).catch(() => {

    });
  },

  ///查询用户的推荐课程
  getRecommendProductList: function (id) {
    let that = this;
    API.getRecommendProductList({
      answer_id: id
      // answer_id: 12
    }, app).then(res => {
      that.setData({
        recommends: res.list
      })
    }).catch(() => {

    });
  },

  ///切换推荐人
  bindPickerChange: function (e) {
    console.log(e);
    let that = this;
    let ctuijianren = that.data.testers[e.detail.value]
    that.setData({
      ctuijianren: ctuijianren
    })
    that.getRecommendProductList(ctuijianren.id);
  },

  // 获取轮播图
  getAdList: function () {
    let that = this;
    API.getAdList({
      position: 2
    }, app).then(res => {
      console.log("轮播图", JSON.stringify(res))
      that.setData({
        ads: res.list
      })
    }).catch(() => {

    });
  },

  // 查询标签列表
  getTagList: function () {
    let that = this;
    API.getTagList({
      type: 2
    }, app).then(res => {
      console.log("标签列表", JSON.stringify(res))
      that.setData({
        tagList: res.list
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

  ///获取热门课程
  getProductList: function (page) {
    let that = this;
    API.getProductList({
      page: page,
      pageCount: 10,
      orderBy: 2
    }, app).then(res => {
      console.log("课程列表==>" + JSON.stringify(res))
      wx.stopPullDownRefresh()
      let haveMore = true;
      let hotCourses = that.data.hotCourses || [];
      let page = that.data.page;
      if (res.list.length >= 10) {
        ///说明有可能还有下一页数据
        haveMore = true;
        page += 1;
      } else {
        ///已经加载全部数据
        haveMore = false;
      }
      let newhotCourses = hotCourses.concat(res.list)

      that.setData({
        haveMore: haveMore,
        hotCourses: newhotCourses,
        page: page
      })
    }).catch(() => {

    });
  },

  ///点击课程分类
  selectClassfiy: function (e) {
    let item = e.currentTarget.dataset.item;
    let tagXg, title;
    if (item) {
      tagXg = item.id;
      title = item.title;
    } else {
      tagXg = 0;
      title = "全部课程";
    }
    wx.navigateTo({
      url: '/pages/yanxuan/yanxuanAll/yanxuanAll?tag_xg=' + tagXg + '&titleName=' + title,
    })
  },

  ///点击搜索条
  tosearch: function () {
    wx.navigateTo({
      url: '/pages/yanxuan/yanxuanSearch/yanxuanSearch',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '天赋教养TOP',
      imageUrl:that.data.HOMESHAREIMG,
      path: '/pages/yanxuan/yanxuanMain/yanxuanMain'
    }
  },

})