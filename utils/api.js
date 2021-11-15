// let API_BASE_URL = 'https://dtimemini.1bu2bu.com';// 测试服
let API_BASE_URL = 'https://dtimeapi.tianfumao.com';// 正式服

let bucket = 'https://dtime.oss-cn-beijing.aliyuncs.com';

let GZH_EWM = bucket + '/ewm/gzh_ewm.jpg';// 公众号图片
let KEFU_EWM = bucket + '/ewm/kefu_ewm.png';// 客服图片
let YAOQINTESTBG = bucket + '/iamges/dtime1.png';// 分享邀请测图
let YAOQINTEST = bucket + '/iamges/dtime2.jpg';// 领取分享邀请测图
let SANRENTUAN = bucket + '/images/tuijian.png';// 三人团分享封面
let HOMESHAREIMG = bucket + '/shareimg/home_share_img.jpg'

let request = function request(url, method, data, app, isFormData = 0) {
  let fullUrl = API_BASE_URL + url;
  return new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    let Token = wx.getStorageSync('Authorization');
    wx.request({
      url: fullUrl,
      method: method,
      data: data,
      header: {
        'Content-Type': isFormData ? 'application/x-www-form-urlencoded' : "application/json",
        'Authorization': Token
      },
      success: function success(response) {
        wx.hideLoading();
        let res = response.data;
        // console.log(url + "===code" + res.code)
        if (res.code == 200) {
          if (response.header.hasOwnProperty("Authorization")) {
            wx.setStorageSync('Authorization', response.header.Authorization);
          }
          resolve(res.data);
        } else if (res.code == 401) {
          if (res.msg)
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
          reject(res)
        } else if (res.code == 500) {
          if (res.msg)
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
          reject(res)
        } else if (res.code == 1001) {
          // || res.msg.indexOf("token验证错误") >= 0
          wx.removeStorage({
            key: "Authorization"
          });
          if (app) {
            app.globalData.authUserInfo = ''
            app.globalData.jkUserInfo = ''
            app.globalData.userId = ''
            app.globalData.phoneNumber = ''
          }
          wx.setStorageSync('authUserInfo', '')
          wx.setStorageSync('jkUserInfo', '');
          wx.setStorageSync('userId', '')
          wx.setStorageSync('phoneNumber', '');
          wx.setStorageSync('code', '')

          // token失效
          wx.showToast({
            title: '登录已过期，请重新授权登录...',
            icon: 'error',
            success: function (e) {
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/auth/authUserInfo/authUserInfo',
                })
              }, 2000)
            }
          })
          reject(res)
        } else {
          if (res.msg)
            wx.showToast({
              title: res.msg,
              icon: "none"
            })
          reject(res)
        }
      },
      fail: function fail(error) {
        wx.hideLoading()
      },
      complete: function complete(comp) {

      }
    });
  });
};

module.exports = {
  baseUrl: API_BASE_URL,
  Bucket: bucket,
  gzhImg: GZH_EWM,
  kefuImg: KEFU_EWM,
  YAOQINTESTBG: YAOQINTESTBG,
  YAOQINTEST: YAOQINTEST,
  SANRENTUAN: SANRENTUAN,
  HOMESHAREIMG: HOMESHAREIMG,

  // 小程序授权登录
  loginByWxMini: (data, app) => {
    return request('/api/loginByWxMini', 'post', data, app);
  },
  //小程序授权手机号
  getWxminiPhonenumber: (data, app) => {
    return request('/api/getWxminiPhonenumber', 'post', data, app);
  },
  //设置微信小程序用户信息
  setWxminiUserInfo: (data, app) => {
    return request('/api/setWxminiUserInfo', 'post', data, app);
  },
  // 用户id转jwt-token
  cryptToken: (data, app) => {
    return request('/api/cryptToken', 'post', data, app);
  },
  // 解密jwt-token
  decryptToken: (data, app) => {
    return request('/api/decryptToken', 'post', data, app);
  },
  //测评主页
  index: (data, app) => {
    return request('/api/index', 'post', data, app);
  },
  //获取主页更多报告
  getAllTest: (data, app) => {
    return request('/api/getAllTest', 'post', data, app);
  },
  // 待解读报告列表
  getUnreadReport: (data, app) => {
    return request('/api/getUnreadReport', 'post', data, app);
  },
  //获取专家详情
  expertDetail: (data, app) => {
    return request('/api/expertDetail', 'post', data, app);
  },
  //获取专家列表
  expertList: (data, app) => {
    return request('/api/expertList', 'post', data, app);
  },
  // 下单(下单后再调用获取支付参数接口)
  makeOrder: (data, app) => {
    return request('/api/makeOrder', 'post', data, app);
  },
  //轮播图列表
  getAdList: (data, app) => {
    return request('/api/getAdList', 'post', data, app);
  },
  //获取我的测评人列表
  getMyTestUser: (data, app) => {
    return request('/api/getMyTestUser', 'post', data, app);
  },
  // 获取测评商品id/价格
  getTestProduct: (data, app) => {
    return request('/api/getTestProduct', 'post', data, app);
  },
  // 查询用户的推荐课程 
  getRecommendProductList: (data, app) => {
    return request('/api/getRecommendProductList', 'post', data, app);
  },
  // 查询课程列表|严选好课
  getProductList: (data, app) => {
    return request('/api/getProductList', 'post', data, app);
  },
  // 查询课程详情
  getProductDetail: (data, app) => {
    return request('/api/getProductDetail', 'post', data, app);
  },
  // 查询开团详情
  getGroupBuyInfo: (data, app) => {
    return request('/api/getGroupBuyInfo', 'post', data, app);
  },
  // 打开分享团购链接-拼团详情
  getShareGroupBuyInfo: (data, app) => {
    return request('/api/getShareGroupBuyInfo', 'post', data, app);
  },
  // 查询标签列表
  getTagList: (data, app) => {
    return request('/api/getTagList', 'post', data, app);
  },
  // 提交测试基本信息（支付需要下单）
  setTestBaseInfo: (data, app) => {
    return request('/api/setTestBaseInfo', 'post', data, app);
  },
  // 获取小程序调起支付的必要参数(调用微信统一下单接口)
  pay: (data, app) => {
    return request('/api/pay', 'post', data, app);
  },
  // 检查支付状态
  checkPayStatus: (data, app) => {
    return request('/api/checkPayStatus', 'post', data, app);
  },
  // 获取测试题目
  getTestQuestion: (data, app) => {
    return request('/api/getTestQuestion', 'post', data, app);
  },
  // 提交测试
  submitTest: (data, app) => {
    return request('/api/submitTest', 'post', data, app);
  },
  // 我的合伙人
  getMyPartnerList: (data, app) => {
    return request('/api/getMyPartnerList', 'post', data, app);
  },
  // 我的合伙人详情
  getMyPartnerDetail: (data, app) => {
    return request('/api/getMyPartnerDetail', 'post', data, app);
  },
  //我的粉丝
  getMyFansList: (data, app) => {
    return request('/api/getMyFansList', 'post', data, app)
  },
  //我的收益
  getMyBalance: (data, app) => {
    return request('/api/balance', 'post', data, app)
  },
  //收益明细
  getBalanceRecordByPage: (data, app) => {
    return request('/api/getBalanceRecordByPage', 'post', data, app)
  },
  //邀请合伙人
  getInvite: (data, app) => {
    return request('/api/getInvitCourse', 'post', data, app)
  },
  //D-time专属
  getBelong: (data, app) => {
    return request('/api/getTianfuProduct', 'post', data, app)
  },
  //我的-解读列表
  getHasBuyReadList: (data, app) => {
    return request('/api/getHasBuyReadList', 'post', data, app)
  },
  //我的-查看测评报告和相关报告列表
  getReportList: (data, app) => {
    return request('/api/getReportList', 'post', data, app)
  },
  //完成解读
  finishRead: (data, app) => {
    return request('/api/finishRead', 'post', data, app)
  },
  //获取我的收货地址
  getUserAddress: (data, app) => {
    return request('/api/getUserAddress', 'post', data, app)
  },
  //添加我的收货地址
  addUserAddress: (data, app) => {
    return request('/api/addUserAddress', 'post', data, app)
  },
  //编辑我的收货地址
  updateUserAddress: (data, app) => {
    return request('/api/updateUserAddress', 'post', data, app)
  },
  //获取我的课程
  getUserCourse: (data, app) => {
    return request('/api/getUserCourse', 'post', data, app)
  },
  //获取我的-顶部数据
  getUserHeadData: (data, app) => {
    return request('/api/getUserHeadData', 'post', data, app)
  },
  //我的-订单
  getUserOrderList: (data, app) => {
    return request('/api/getUserOrderList', 'post', data, app)
  },
  //删除订单
  delOrder: (data, app) => {
    return request('/api/delOrder', 'post', data, app)
  },
  //我的消息列表
  myMessageList: (data, app) => {
    return request('/api/myMessageList', 'post', data, app)
  },
  //系统消息列表
  sysMessageList: (data, app) => {
    return request('/api/sysMessageList', 'post', data, app)
  },
  //收藏产品
  collectProduct: (data, app) => {
    return request('/api/collectProduct', 'post', data, app)
  },
  //取消收藏
  delCollectProducts: (data, app) => {
    return request('/api/delCollectProducts', 'post', data, app)
  },
  //我的-收藏列表
  getUserCollectList: (data, app) => {
    return request('/api/getUserCollectList', 'post', data, app)
  },
  //课程评价
  commentCourse: (data, app) => {
    return request('/api/commentCourse', 'post', data, app)
  },
  //是否有新消息
  hasNewMessage: (data, app) => {
    return request('/api/hasNewMessage', 'post', data, app)
  },
  //我的-查询我的订单数量
  getUserOrderCount: (data, app) => {
    return request('/api/getUserOrderCount', 'post', data, app)
  },
  //反馈提问
  feedback: (data, app) => {
    return request('/api/feedback', 'post', data, app)
  },
  //获取我的反馈提问
  getUserFeedbackList: (data, app) => {
    return request('/api/getUserFeedbackList', 'post', data, app)
  },
  //浏览记录
  getScanList: (data, app) => {
    return request('/api/getScanList', 'post', data, app)
  },
  //删除浏览记录
  delRecords: (data, app) => {
    return request('/api/delScanProducts', 'post', data, app)
  },
  //添加浏览记录
  addRecords: (data, app) => {
    return request('/api/scanProduct', 'post', data, app)
  },
  //申请成为合伙人/专家
  apply: (data, app) => {
    return request('/api/apply ', 'post', data, app, app)
  },
  //申请状态查询
  applyStatus: (data, app) => {
    return request('/api/getApplyInfo', 'post', data, app)
  },
  //合伙人发起接龙
  addJieLong: (data, app) => {
    return request('/api/addJieLong', 'post', data, app)
  },
  //提交提现申请
  cashoutApply: (data, app) => {
    return request('/api/cashoutApply', 'post', data, app)
  },

  //邀请免费测-发起分享
  sendInviteInfo: (data) => {
    return request('/api/shareAnswer', 'post', data)
  },

  //邀请免费测-发起分享
  getShareAnswerDetail: (data) => {
    return request('/api/shareAnswerDetail', 'post', data)
  },

  //邀请免费测-发起分享
  getReceiveShareAnswer: (data) => {
    return request('/api/receiveShareAnswer', 'post', data)
  },
  //生成小程序二维码
  getWxaCode: (data) => {
    return request('/api/getWxacode', 'post', data)
  },

}