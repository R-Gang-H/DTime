// pages/assessDetail/assessDetail.js
const API = require('../../utils/api.js');
const util = require('../../utils/util.js');

const app = getApp();

var shareModeData = [{ bindTap: 'Menu1', text: "微信分享" }, { bindTap: 'Menu2', text: "保存图片" }];

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SANRENTUAN: API.SANRENTUAN,
    buyType: 0,// 1:单独购买 2:3人团 3:群接龙
    addressId: '',
    showFkDetail: false,
    actionSheetHidden: false, // 控制分享弹窗modal
    actionSheetItems: shareModeData, // 弹窗展示数据
    share_pengyouquan: API.Bucket + '/shareimg/share_pengyouquan.png',
    share_weixin: API.Bucket + '/shareimg/share_weixin.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    let authuser = wx.getStorageSync('authUserInfo');
    let jkuser = wx.getStorageSync('jkUserinfo');
    let qudaoLevel = wx.getStorageSync('qudaoLevel');
    console.log('options==' + JSON.stringify(options)
      + "\n接口信息" + JSON.stringify(authuser)
      + "\n接口信息" + JSON.stringify(jkuser))
    var detail = JSON.parse(options.detail);
    console.log("上页详情", detail)
    that.setData({
      detail: detail, // 详情
      jkuser: JSON.parse(JSON.stringify(jkuser)),
      authuser: JSON.parse(JSON.stringify(authuser)),// 用户信息
      qudaoLevel: qudaoLevel,// 合伙人等级1=初级2=高级
    })
    that.getProductDetail(detail.id)
    that.expertList(1)
  },

  //添加浏览记录
  addRecords(id) {
    let data = {
      user_id: wx.getStorageSync('userId'),
      product_id: id
    }
    API.addRecords(data, app)
  },

  // 查询课程详情
  getProductDetail: function (id) {
    let that = this;
    var userId = wx.getStorageSync('userId')
    if (userId) {
      that.addRecords(id)
    }
    API.getProductDetail({
      id: parseInt(id),
      user_id: userId,
    }, app).then(res => {
      console.log("课程详情" + JSON.stringify(res))
      var courseDetail = res;
      // console.log(courseDetail)
      that.setData({
        courseDetail: courseDetail.info,
        isCollect: courseDetail.info.isCollect == 1, // 0是没有收藏 1是收藏
        info: courseDetail.info,// 课程详情
        detailImages: courseDetail.info.detail_images ? courseDetail.info.detail_images.split(',') : '',// 详情图片
        commentList: courseDetail.commentList,// 学习反馈
        recommendProduct: courseDetail.recommendProduct,// 推荐课程
      })

      that.setdemoTop();

    }).catch(() => {

    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
      * 图片加载完成方法
      */
  _imgLoadEvent: function (event) {
    // setTimeout(function () {
    var query = wx.createSelectorQuery()//创建节点查询器

    //选择id为comment的节点并查询的它布局位置
    query.select('#demo1').boundingClientRect()
    query.select('#demo2').boundingClientRect()
    query.select('#demo3').boundingClientRect()
    query.select('#demo4').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {//执行请求
      console.log("demoRes", res)
      that.setData({
        demo1Top: res[0].top, //滚动到页面节点的上边界坐标
        demo2Top: res[1].top, //滚动到页面节点的上边界坐标
        demo3Top: res[2].top, //滚动到页面节点的上边界坐标
        demo4Top: res[3].top, //滚动到页面节点的上边界坐标
      })
    })
    // }, 500)
  },

  setdemoTop: function () {
    setTimeout(function () {
      if (!that.data.detailImages.length) {
        var query = wx.createSelectorQuery()//创建节点查询器

        //选择id为comment的节点并查询的它布局位置
        query.select('#demo1').boundingClientRect()
        query.select('#demo2').boundingClientRect()
        query.select('#demo3').boundingClientRect()
        query.select('#demo4').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {//执行请求
          console.log("demoRes", res)
          that.setData({
            demo1Top: res[0].top, //滚动到页面节点的上边界坐标
            demo2Top: res[1].top, //滚动到页面节点的上边界坐标
            demo3Top: res[2].top, //滚动到页面节点的上边界坐标
            demo4Top: res[3].top, //滚动到页面节点的上边界坐标
          })
        })
      }
    }, 500)
  },

  // 收藏
  collectPro: function () {
    var userId = wx.getStorageSync('userId')
    API.collectProduct({
      user_id: userId,
      product_id: that.data.info.id, // 产品id
    }, app).then(res => {
      console.log("收藏成功==" + JSON.stringify(res))
      that.setData({
        isCollect: true, // 0是没有收藏 1是收藏
      })
    }).catch(() => {

    });
  },

  // 取消收藏
  delCollectPro: function () {
    var userId = wx.getStorageSync('userId')
    API.delCollectProducts({
      user_id: userId,
      product_ids: that.data.info.id, // 产品id
    }, app).then(res => {
      console.log("取消收藏成功==" + JSON.stringify(res))
      that.setData({
        isCollect: false, // 0是没有收藏 1是收藏
      })
    }).catch(() => {

    });
  },

  tobTo(e) {
    var tobIndex = e.currentTarget.dataset.index;
    var toView = e.currentTarget.dataset.toview;
    console.log(toView)
    this.setData({
      tobIndex: tobIndex,
      toView: toView,
    })

    var resTop = that.data.demo1Top
    switch (tobIndex) {
      case '1':
        resTop = that.data.demo1Top
        break;
      case '2':
        resTop = that.data.demo2Top
        break;
      case '3':
        resTop = that.data.demo3Top
        break;
      case '4':
        resTop = that.data.demo4Top
        break;
    }

    wx.pageScrollTo({
      scrollTop: resTop,//滚动到页面节点的上边界坐标
      duration: 300   // 滚动动画的时长
    });

  },

  showImages(res) {
    let images = res.currentTarget.dataset.images
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: images ? images.split(',') : [] // 需要预览的图片http链接列表
    })
  },


  // 合伙人发起群接龙
  addJieLong: function (res) {
    let opentype = res.currentTarget.dataset.opentype
    that.setData({
      opentype: opentype,// 1三人团，2接龙，3单独购
    })
    let userId = wx.getStorageSync('userId');
    if (opentype == 1) {
      that.setData({
        showFkDetail: true,
      })
      // let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
      // wx.navigateTo({
      //   url: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,//+ "&isjwt=1", //1080
      // })
    } else if (opentype == 2) {
      API.addJieLong({
        user_id: userId,
        product_id: that.data.detail.id, // 产品id
      }, app).then(res => {
        console.log("发起接龙==" + JSON.stringify(res))
        that.setData({
          showFkDetail: true,
          jielongId: res.jielong_id,//接龙Id
        })
        // let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
        // wx.navigateTo({
        //   url: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime+ "&jielongId=" + that.data.jielongId,
        // })
      }).catch(() => {

      });
    } else if (opentype == 3) {// 合伙人单独购分享
      that.setData({
        showFkDetail: true,
      })
    }
  },
  cancelFkDetail() {
    that.setData({
      showFkDetail: false,
    })
  },

  // 去专家详情页面
  toExpertDetail: function (e) {
    let that = this;
    wx.navigateTo({
      url: '/pages/expert/expertDetail/expertDetail?id=' + e.currentTarget.dataset.id + "&inType=" + that.data.inType + '&showJG=1', // inType:1是点申请解读去选专家解读,2是帮我解读去选报告解读,3:学业提升,22:咨询 showJG 1:不显示按钮价格
    })
  },

  // 获取专家列表
  expertList: function (page) {
    let that = this;
    API.expertList({
      page: page,
      pageSize: 10,
      type: that.data.detail.type,
    }, app).then(res => {
      // console.log(JSON.stringify(res))
      wx.stopPullDownRefresh({})
      let experts = that.data.experts || [];

      let newExperts = experts.concat(res.list)

      that.setData({
        current: res.page, // 当前页
        pages: res.pagecount, // 总页数
        experts: newExperts,
      })

      if (that.data.experts.length < 15 || that.data.pages <= that.data.current) {
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      experts: [],
      page: 1
    })
    that.expertList(1)
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
      that.expertList(curpage)
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
    // type":"产品类型1=解读；2=咨询；3=学业提升 4=测评；5=21天训练营；6=严选；7导师
    console.log("分享：用户Id", userId + "==课程详情" + JSON.stringify(that.data.courseDetail) + "==用户信息:" + that.data.authuser.nickName + "==时间戳：" + shareTime)
    if (that.data.courseDetail.type == 1
      || that.data.courseDetail.type == 2
      || that.data.courseDetail.type == 3
      || that.data.courseDetail.type == 7) {
      if (that.data.opentype == 1 && that.data.showFkDetail) {// 点击三人团
        that.setData({
          showFkDetail: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          imageUrl: that.data.SANRENTUAN,
          path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {
        that.setData({
          showFkDetail: false,
        })
        let inType = 3
        switch (that.data.courseDetail.type) {
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
        return {
          title: that.data.courseDetail.product_name,
          path: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + that.data.courseDetail.product_name + '&courseId=' + that.data.courseDetail.id + '&inType=' + inType + "&isPuySuc=2&shareId=" + userId + "&type=" + that.data.courseDetail.type,
        }// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询

        // if (that.data.courseDetail.type == 1) {
        //   return {
        //     title: that.data.courseDetail.product_name,
        //     path: '/pages/expert/expertList/expertList?inType=2&reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
        //   }
        // } else {
        //   return {
        //     title: that.data.courseDetail.product_name,
        //     path: '/pages/expert/expertList/expertList?inType=1&reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
        //   }
        // }
      }
    } else if (that.data.courseDetail.type == 4) {
      if (that.data.opentype == 2 && that.data.courseDetail.iscan_jielong == 1 && that.data.showFkDetail) {// 1三人团，2接龙  iscan_jielong:1是2否  点击群接龙
        that.setData({
          showFkDetail: false,
        })
        // 只有测评和21天训练营有群接龙
        return {
          title: that.data.courseDetail.product_name,
          path: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&jielongId=" + that.data.jielongId,
        }
      } else if (that.data.opentype == 1 && that.data.showFkDetail) {// 1三人团2接龙 点击三人团
        that.setData({
          showFkDetail: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          imageUrl: that.data.SANRENTUAN,
          path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {
        that.setData({
          showFkDetail: false,
        })
        let inType = 3
        switch (that.data.courseDetail.type) {
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
        return {
          title: that.data.courseDetail.product_name,
          path: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + that.data.courseDetail.product_name + '&courseId=' + that.data.courseDetail.id + '&inType=' + inType + "&isPuySuc=2&shareId=" + userId + "&type=" + that.data.courseDetail.type,
        }// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询

        // return {
        //   title: that.data.courseDetail.product_name,
        //   path: '/pages/report/reportShare/reportShare?reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
        // }
      }
    } else if (that.data.courseDetail.type == 5) {
      if (that.data.opentype == 2 && that.data.courseDetail.iscan_jielong == 1 && that.data.showFkDetail) {// iscan_jielong:1是2否  点击群接龙
        that.setData({
          showFkDetail: false,
        })
        // 只有测评和21天训练营有群接龙
        return {
          title: that.data.courseDetail.product_name,
          path: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&jielongId=" + that.data.jielongId,
        }
      } else if (that.data.opentype == 1 && that.data.showFkDetail) {// 点击三人团
        that.setData({
          showFkDetail: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          imageUrl: that.data.SANRENTUAN,
          path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {
        that.setData({
          showFkDetail: false,
        })
        return {
          title: that.data.courseDetail.product_name,
          path: '/pages/hehuorenShare/hehuorenShare?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&nickname=" + that.data.authuser.nickName,
        }
      }
    } else if (that.data.courseDetail.type == 6) {
      return {
        title: that.data.courseDetail.product_name,
        path: '/pages/courseDetail/courseDetail?courseId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&openType=" + 2,// 1:商品详情 2:推荐朋友、三人团,
      }
    }
  },

  onShareTimeline: function () {
    var that = this;
    let userId = wx.getStorageSync('userId');
    let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
    // type":"产品类型1=解读；2=咨询；3=学业提升 4=测评；5=21天训练营；6=严选；7导师
    console.log("分享：", JSON.stringify(that.data.courseDetail) + "==" + that.data.authuser.nickName + "==时间戳：" + shareTime)
    if (that.data.courseDetail.type == 1
      || that.data.courseDetail.type == 2
      || that.data.courseDetail.type == 3
      || that.data.courseDetail.type == 7) {
      if (that.data.opentype == 1 && that.data.showFkDetail) {// 点击三人团
        that.setData({
          showFkDetail: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {

        let inType = 3
        switch (that.data.courseDetail.type) {
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
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + that.data.courseDetail.product_name + '&courseId=' + that.data.courseDetail.id + '&inType=' + inType + "&isPuySuc=2&shareId=" + userId,
        }// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询

        // if (that.data.courseDetail.type == 1) {
        //   return {
        //     title: that.data.courseDetail.product_name,
        //     query: '/pages/expert/expertList/expertList?inType=2&reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
        //   }
        // } else {
        //   return {
        //     title: that.data.courseDetail.product_name,
        //     query: '/pages/expert/expertList/expertList?inType=1&reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
        //   }
        // }
      }
    } else if (that.data.courseDetail.type == 4) {
      if (that.data.opentype == 2 && that.data.courseDetail.iscan_jielong == 1 && that.data.showFkDetail) {// 1三人团，2接龙  iscan_jielong:1是2否  点击群接龙
        that.setData({
          showFkDetail: false,
        })
        // 只有测评和21天训练营有群接龙
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&jielongId=" + that.data.jielongId,
        }
      } else if (that.data.opentype == 1 && that.data.showFkDetail) {// 1三人团2接龙 点击三人团
        that.setData({
          showFkDetail: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {

        let inType = 3
        switch (that.data.courseDetail.type) {
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
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/expert/xlianyinDetail/xlianyinDetail?titleName=' + that.data.courseDetail.product_name + '&courseId=' + that.data.courseDetail.id + '&inType=' + inType + "&isPuySuc=2&shareId=" + userId,
        }// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询

        // return {
        //   title: that.data.courseDetail.product_name,
        //   query: '/pages/report/reportShare/reportShare?reportId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId,
        // }
      }
    } else if (that.data.courseDetail.type == 5) {
      if (that.data.opentype == 2 && that.data.courseDetail.iscan_jielong == 1 && that.data.showFkDetail) {// iscan_jielong:1是2否  点击群接龙
        that.setData({
          showFkDetail: false,
        })
        // 只有测评和21天训练营有群接龙
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&jielongId=" + that.data.jielongId,
        }
      } else if (that.data.opentype == 1 && that.data.showFkDetail) {// 点击三人团
        that.setData({
          showFkDetail: false,
        })
        // 三人团
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime,
        }
      } else {
        return {
          title: that.data.courseDetail.product_name,
          query: '/pages/hehuorenShare/hehuorenShare?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&nickname=" + that.data.authuser.nickName,
        }
      }
    } else if (that.data.courseDetail.type == 6) {
      return {
        title: that.data.courseDetail.product_name,
        query: '/pages/courseDetail/courseDetail?courseId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&openType=" + 2,// 1:商品详情 2:推荐朋友、三人团,
      }
    }
  },

  // 点击弹出弹窗，选择发给微信好友 或 生成分享图片。
  // 显示分享弹窗。
  showShareModal(e) {
    this.setData({
      actionSheetHidden: true,
    });
  },
  // 改变 action-sheet状态。
  actionSheetChange(e) {
    this.setData({
      actionSheetHidden: false,
    });
  },
  // 跳转到图片分享
  shareKc() {
    app.actionSheetMenu(() => {

      var that = this;
      let userId = wx.getStorageSync('userId');

      API.decryptToken({
        token: userId
      }, app).then(res2 => {
        console.log("decryptToken3==" + JSON.stringify(res2) + res2[0].user_id)
        let userId = res2[0].user_id
        let shareTime = parseInt(new Date().getTime() / 1000) // 时间戳传秒
        // type":"产品类型1=解读；2=咨询；3=学业提升 4=测评；5=21天训练营；6=严选；7导师
        console.log("分享：用户Id", userId + "==课程详情" + JSON.stringify(that.data.courseDetail) + "==用户信息:" + that.data.authuser.nickName + "==时间戳：" + shareTime)
        if (that.data.courseDetail.type == 1
          || that.data.courseDetail.type == 2
          || that.data.courseDetail.type == 3
          || that.data.courseDetail.type == 7) {
          if (that.data.opentype == 1 && that.data.showFkDetail) {// 点击三人团
            // 三人团
            that.setData({
              path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&isjwt=1",
            })
          } else {
            let inType = 3
            switch (that.data.courseDetail.type) {
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
            // titleName=' + that.data.courseDetail.product_name + '&
            that.setData({
              path: '/pages/expert/xlianyinDetail/xlianyinDetail?courseId=' + that.data.courseDetail.id + '&inType=' + inType + "&shareId=" + userId + "&type=" + that.data.courseDetail.type + "&isjwt=1",
            })// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询
          }
        } else if (that.data.courseDetail.type == 4) {
          if (that.data.opentype == 2 && that.data.courseDetail.iscan_jielong == 1 && that.data.showFkDetail) {// 1三人团，2接龙  iscan_jielong:1是2否  点击群接龙
            // 只有测评和21天训练营有群接龙
            that.setData({
              path: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&jielongId=" + that.data.jielongId + "&isjwt=1",
            })
          } else if (that.data.opentype == 1 && that.data.showFkDetail) {// 1三人团2接龙 点击三人团
            // 三人团
            that.setData({
              path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&isjwt=1",
            })
          } else {
            let inType = 3
            switch (that.data.courseDetail.type) {
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
            // titleName=' + that.data.courseDetail.product_name + '
            that.setData({
              path: '/pages/expert/xlianyinDetail/xlianyinDetail?courseId=' + that.data.courseDetail.id + '&inType=' + inType + "&shareId=" + userId + "&type=" + that.data.courseDetail.type + "&isjwt=1",
            })// inType: 2:点帮我解读去选报告解读 3:学业提升 22:咨询
          }
        } else if (that.data.courseDetail.type == 5) {
          if (that.data.opentype == 2 && that.data.courseDetail.iscan_jielong == 1 && that.data.showFkDetail) {// iscan_jielong:1是2否  点击群接龙
            // 只有测评和21天训练营有群接龙
            that.setData({
              path: '/pages/hehuoGroupDetail/hehuoGroupDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&jielongId=" + that.data.jielongId + "&isjwt=1",
            })
          } else if (that.data.opentype == 1 && that.data.showFkDetail) {// 点击三人团
            // 三人团
            that.setData({
              path: '/pages/groupThreeDetail/groupThreeDetail?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&share_time=" + shareTime + "&isjwt=1",
            })
          } else {
            that.setData({
              path: '/pages/hehuorenShare/hehuorenShare?id=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&nickname=" + that.data.authuser.nickName + "&isjwt=1",
            })
          }
        } else if (that.data.courseDetail.type == 6) {
          that.setData({
            path: '/pages/courseDetail/courseDetail?courseId=' + that.data.courseDetail.id + "&isPuySuc=2&shareId=" + userId + "&openType=2&isjwt=1",// 1:商品详情 2:推荐朋友、三人团,
          })
        }
        setTimeout(res => {
          wx.navigateTo({
            url: '/pages/shareKc/shareKc?id=' + that.data.courseDetail.id + '&path=' + encodeURIComponent(that.data.path) + '&opentype=' + that.data.opentype,
          })
        }, 500)
      }).catch((res) => {
        console.log("catch2", res)
      });

    });
  },

  onPageScroll: function (res) {
    let scrollTo = res.scrollTop;
    // console.log(scrollTo)

    if (scrollTo > 380) {
      if (scrollTo > 380 && scrollTo < that.data.demo2Top) {
        that.setData({
          tobIndex: 1
        })
      }
      if (scrollTo >= that.data.demo2Top - 35 && scrollTo <= that.data.demo3Top) {
        that.setData({
          tobIndex: 2
        })
      }
      if (scrollTo >= that.data.demo3Top - 35 && scrollTo <= that.data.demo4Top) {
        that.setData({
          tobIndex: 3
        })
      }
      if (scrollTo >= that.data.demo4Top - 35) {
        that.setData({
          tobIndex: 4
        })
      }

      that.setData({
        isPos: true,
      })
    } else {
      that.setData({
        isPos: false,
      })
    }
  },


})