// pages/shareKc/shareKc.js
const API = require('../../utils/api.js');
const util = require('../../utils/util.js')

const app = getApp();

let that;
var indexImg = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareBg: API.Bucket + '/shareimg/share_bg.jpg',
    shareTopIcon: API.Bucket + '/shareimg/share_top_icon.jpg',
    shareXianShi: API.Bucket + '/shareimg/share_xianshi.jpg',
    xiaochengxuQRcode: API.Bucket + '/shareimg/xiaochengxu_qrcode.jpg',
    dAvater: '/images/laopo.jpg',
    shareLoad: true,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    util.updateMini()
    let authuser = wx.getStorageSync('authUserInfo');
    that = this;
    console.log('options==' + JSON.stringify(options)
      + "\n授权信息" + JSON.stringify(authuser))
    let path1 = decodeURIComponent(options.path)
    console.log('path', path1)
    that.setData({
      courseId: options.id,//15
      authuser: authuser,
      path: path1,
    })
    that.getToken();
  },

  getToken: function () {
    let that = this;
    API.getWxaCode({
      // path: '/pages/groupThreeDetail/groupThreeDetail?id=15&isPuySuc=2&share_time=1625295986000',
      path: that.data.path,
    }, app).then(res => {
      console.log("小程序getWxaCode 成功", res)
      let wxaCode = res.wxacode;

      util.base64src(wxaCode, res => {
        let QRCode = res
        console.log('QRCode', QRCode)// 返回图片地址，直接赋值到image标签即可
        that.setData({
          wxaCode: QRCode,
        })
        that.getProductDetail(that.data.courseId);
      })

    }).catch((res) => {
      console.log("小程序getWxaCode 失败", res)
    });

  },

  // 查询课程详情
  getProductDetail: function (id) {
    let that = this;
    var userId = wx.getStorageSync('userId')
    API.getProductDetail({
      id: parseInt(id),
      user_id: userId,
    }, app).then(res => {
      // console.log("课程详情" + JSON.stringify(res))
      var courseDetail = res;
      // console.log(courseDetail)
      that.setData({
        info: courseDetail.info,// 课程详情
      })

      that.getImageUrl();

    }).catch(() => {

    });
  },

  getImageUrl: function () {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    indexImg = 0;
    // avatar
    if (that.data.authuser.avatarUrl) {
      wx.getImageInfo({
        src: that.data.authuser.avatarUrl,
        success(res) {
          // res.width;//图片宽
          // res.height;//图片高
          that.setData({
            avatarImg: res.path,
          })
          indexImg += 1;
          that.createNewImg();
        }
      })
    } else {
      that.setData({
        avatarImg: that.data.dAvater,
      })
      indexImg += 1;
      that.createNewImg();
    }
    // shareBg
    wx.getImageInfo({
      src: that.data.shareBg,
      success(res) {
        // res.width;//图片宽
        // res.height;//图片高
        that.setData({
          img00: res.path,
        })
        indexImg += 1;
        that.createNewImg();
      }
    })
    // shareTopIcon
    wx.getImageInfo({
      src: that.data.shareTopIcon,
      success(res) {
        // res.width;//图片宽
        // res.height;//图片高
        that.setData({
          img11: res.path,
        })
        indexImg += 1;
        that.createNewImg();
      }
    })
    // 封面图
    wx.getImageInfo({
      src: that.data.info.image.split(",")[0],
      success(res) {
        // res.width;//图片宽
        // res.height;//图片高
        that.setData({
          img22: res.path,
        })
        indexImg += 1;
        that.createNewImg();
      }
    })
    // shareXianShi
    wx.getImageInfo({
      src: that.data.shareXianShi,
      success(res) {
        // res.width;//图片宽
        // res.height;//图片高
        that.setData({
          img33: res.path,
        })
        indexImg += 1;
        that.createNewImg();
      }
    })
    // QRCode
    // wx.getImageInfo({
    //   // src: that.data.xiaochengxuQRcode,
    //   src: that.data.wxaCode,
    //   success(res) {
    //     // console.log("QRCodeQRCode==",res.path)
    //     // res.width;//图片宽
    //     // res.height;//图片高
    //     that.setData({
    //       img44: res.path,
    //     })
    //     indexImg += 1;
    //     that.createNewImg();
    //   }
    // })
    console.log('indexImg', indexImg)
  },
  _shareLoadEvent: function (event) {
    that.setData({
      shareLoad: false
    })
  },
  //适配不同屏幕大小的canvas 生成的分享图宽高分别是 750 和 940，动态设置画布大小
  setCanvasSize: function () {
    var size = {};
    try {
      // var res = wx.getSystemInfoSync();
      // var scale = 750;//画布宽度
      // var scaleH = 940 / 750;//生成图片的宽高比例  * scaleH
      // var width = res.windowWidth;//画布宽度
      // var height = res.windowHeight - this.data.navH - 6;//画布的高度
      var width = 375;
      var height = 812;
      size.w = width;
      size.h = height;
      size.hh = height + 200;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  //将头像绘制到canvas的固定
  setimgAva: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    var avatarT = that.data.avatarImg;
    var avatarurl_width = size.w * 0.18;    //绘制的头像宽度
    var avatarurl_heigth = size.w * 0.18;   //绘制的头像高度
    var avatarurl_x = size.w / 25;   //绘制的头像在画布上的位置
    var avatarurl_y = size.h / 12;   //绘制的头像在画布上的位置
    context.save();
    context.beginPath(); //开始绘制
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    context.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    context.drawImage(avatarT, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
    context.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
  },
  //将昵称绘制到canvas的固定
  setnickNameSec: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    // var nickName = "Diana@天赋教养你很重要的是什么样";
    var nickName = that.data.authuser.nickName;
    context.setFontSize(16);
    context.setTextAlign("left");
    context.setFillStyle("#1E1E1E");
    context.fillText(nickName, size.w / 4 + 5, size.h / 8);
    context.stroke();
  },
  //将发布时间绘制到canvas的固定
  setTimeCon: function (context) {
    var time = new Date();
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = time.getDate()
    let that = this;
    var size = that.setCanvasSize();
    var textSec = year + '.' + month + '.' + date + '\t发布';
    context.setFontSize(14);
    context.setTextAlign("center");
    context.setFillStyle("#8E8D8D");
    context.fillText(textSec, size.w / 3 + 20, size.h / 6);
    context.stroke();
  },
  //将课程名称绘制到canvas的固定
  setCourseNameCon: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    // var textSec = "《探秘中科院·研学之旅》线下活动";
    var textSec = that.data.info.product_name;
    context.setFontSize(20);
    context.setTextAlign("left");
    context.setFillStyle("#1E1E1E");
    context.fillText(textSec, size.w * 0.03, size.h / 4.8);
    context.stroke();
  },
  //将课程描述绘制到canvas的固定
  setCourseDesCon: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    var textSec = that.data.info.one_words;
    // var textSec = "《探秘中科院·研学之旅》线下活动";
    context.setFontSize(15);
    context.setTextAlign("left");
    context.setFillStyle("#8E8D8D");
    context.fillText(textSec, size.w * 0.04, size.h / 3.8);
    context.stroke();
  },
  //将价格绘制到canvas的固定
  setCoursePriceCon: function (context) {
    let that = this;
    var size = that.setCanvasSize();
    var textSec = (parseInt(that.data.info.group_price) / 100).toFixed(2) + '元'
    context.setFontSize(24);
    context.setTextAlign("left");
    context.setFillStyle("#FA283B");
    context.fillText(textSec, size.w / 3.6, size.h / 1.595);
    context.stroke();

    context.setFontSize(18);
    context.setTextAlign("left");
    context.setFillStyle("#63B9BB");
    context.fillText('仅限3天', size.w * 0.38, size.h / 1.45);
    context.stroke();

    context.setFontSize(18);
    context.setTextAlign("left");
    context.setFillStyle("#1E1E1E");
    context.fillText('精选优质课程', size.w * 0.05, size.h / 1.45);
    context.fillText('长按识别二维码', size.w * 0.05, size.h / 1.36);
    context.fillText('了解详情', size.w * 0.41, size.h / 1.36);
    context.stroke();
  },
  //将1绘制到canvas的固定
  // setimgQRcode: function (context) {
  //   let that = this;
  //   var size = that.setCanvasSize();
  //   var qrCodeR = that.data.img44;
  //   var avatarurl_width = size.w * 0.3;    //绘制的二维码宽度
  //   var avatarurl_heigth = size.w * 0.3;   //绘制的二维码高度
  //   var avatarurl_x = size.w * 0.65;   //绘制的二维码在画布上的位置
  //   var avatarurl_y = size.h * 0.58;   //绘制的二维码在画布上的位置
  //   context.save();
  //   context.beginPath(); //开始绘制
  //   context.drawImage(qrCodeR, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
  //   context.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
  // },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    if (indexImg < 5) {
      return
    }
    var that = this;
    var size = that.setCanvasSize();
    var context = wx.createCanvasContext('myCanvas');
    var img00 = that.data.img00;
    var img11 = that.data.img11;
    var img22 = that.data.img22;
    var img33 = that.data.img33;
    var img44 = that.data.wxaCode;
    console.log("canvas", img44)
    context.drawImage(img00, 0, 0, size.w, size.h);
    context.drawImage(img11, size.w / 1.60, 0, size.w * 0.34, size.h / 10.5);
    context.drawImage(img22, size.w * 0.03, size.h * 0.306, size.w * 0.94, size.h * 0.26);
    context.drawImage(img33, size.w * 0.03, size.h * 0.596, size.w * 0.6, size.h * 0.040);
    context.drawImage(img44, size.w * 0.65, size.h * 0.58, size.w * 0.3, size.w * 0.3);

    that.setnickNameSec(context);
    that.setTimeCon(context);
    that.setCourseNameCon(context);
    that.setCourseDesCon(context);
    that.setCoursePriceCon(context);
    // that.setimgQRcode(context);
    that.setimgAva(context);
    console.log('屏幕尺寸:' + size.w, size.h)// 414 666
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          if (tempFilePath) {
            that.setData({
              imagePath: tempFilePath,
            });
            that.saveImageToPhotosAlbum();
          }
        },
        fail: function (res) {
          console.log(res + 'canvas fail');
        }
      });
    }, 2000);
  },
  saveImageToPhotosAlbum: function () {
    //将生成的图片放入到《image》标签里 90     
    var img = that.data.imagePath;
    wx.saveImageToPhotosAlbum({
      filePath: img,
      success(res) {
        console.log(res + "save photo is success")
        wx.showToast({
          title: '已保存至相册',
          icon: 'success',
          success() {
            setTimeout(function () {
              that.setData({
                loading: false,
                canvasHidden: true,
              });
              wx.hideLoading()
              // wx.navigateBack({
              //   delta: 0,
              // })
            }, 1000);
          }
        })
      },
      fail: function (err) {
        console.log(err + "save photo is fail")
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("用户一开始拒绝了，我们想再次发起授权")
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting['scope.writePhotosAlbum']) {
                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                this.saveImageToPhotosAlbum()
              } else {
                console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              }
            }
          })
        } else {
          wx.hideLoading()
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})