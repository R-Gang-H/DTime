const API = require("../../utils/api.js")
const util = require('../../utils/util.js')

var ossUp = require('../../utils/ossUp.js')

let app = getApp();

var that;
//---------------------------学习反馈-----------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star1: '../../images/icon_star1.png',
    star2: '../../images/icon_star2.png',
    loveStar: [],
    matchStar: [],
    focus: false,
    selectList: [''],//选择的图片
    inputText: '',//输入内容
    show: true,//展示选择图标
    star1Count: 0,//喜爱度星星数
    star2Count: 0,//匹配度星星数
    photos: '',// 上传图片
    isTo: true,//防连点
  },


  uploadImage: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId');

    let data = {
      user_id: userId,
      product_id: that.data.courseInfo.id,
      order_id: that.data.courseInfo.order_id,
      score1: that.data.star1Count,
      score2: that.data.star2Count,
      content: that.data.inputText,
      images: that.data.photos,
    }
    API.commentCourse(data, app).then(res => {

      console.log("课程评价", JSON.stringify(res))

      wx.hideLoading();

      that.setData({
        isTo: true,
      })
      wx.showLoading({
        title: '反馈已提交',
      })

      setTimeout(function () {
        wx.navigateBack({
          delta: 0,
        })
      }, 3000)

    })
  },

  //提交
  submit(e) {
    if (that.data.isTo) {
      that.setData({
        isTo: false
      })

      let photoTsr = "";
      if (that.data.selectList.length >= 2) {
        /*有图片需要上传*/
        var i = 0;
        that.data.selectList.forEach((filePath) => {

          if (filePath) {

            //filePath为要上传的本地文件的路径
            //images/为oss目录
            ossUp.upload({
              filePath: filePath,
              dir: "images/",
              success: function (url) {
                console.log("上传成功")
                //todo 做任何你想做的事
                wx.showLoading({
                  title: '正在上传中',
                })
                if (url === false) {
                  wx.showToast({
                    title: '上传出错',
                  })
                }
                /**每回调一次检查是否传完 */
                var num = 0
                if (that.data.selectList[2]) {
                  num = 1
                } else {
                  num = 2
                }
                if (i == that.data.selectList.length - parseInt(num)) {
                  if (i > 0) {
                    photoTsr += ",";
                  }
                  photoTsr += url;
                  that.setData({
                    photos: photoTsr
                  })
                  console.log(photoTsr);
                  that.uploadImage();
                } else {
                  if (i > 0) {
                    photoTsr += ",";
                  }
                  photoTsr += url;
                }
                i += 1;
              },
              fail: function (res) {
                console.log("上传失败")
                //todo 做任何你想做的事
              }
            })
          }

        })
      } else {
        /**没有图片需要上传，直接调用保存接口 */
        that.setData({
          photos: photoTsr
        })
        console.log(photoTsr);
        that.uploadImage();
      }


      setTimeout(function () {
        that.setData({
          isTo: true
        })
      }, 5000)
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

  //评分点击
  starTap(e) {
    //点击的星星位置
    let mIndex = e.currentTarget.dataset.index
    //点击的评分类型 1喜爱度 2匹配度
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      let array = this.data.loveStar
      for (let index = 0; index < array.length; index++) {
        if (index <= mIndex) {
          array[index] = this.data.star1
        } else {
          array[index] = this.data.star2
        }
      }
      this.setData({
        loveStar: array,
        star1Count: mIndex + 1
      })
    } else {
      let array = this.data.matchStar
      for (let index = 0; index < array.length; index++) {
        if (index <= mIndex) {
          array[index] = this.data.star1
        } else {
          array[index] = this.data.star2
        }
      }
      this.setData({
        matchStar: array,
        star2Count: mIndex + 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    util.updateMini()
    this.setData({
      courseInfo: JSON.parse(options.item),
      loveStar: [this.data.star2, this.data.star2, this.data.star2, this.data.star2, this.data.star2],
      matchStar: [this.data.star2, this.data.star2, this.data.star2, this.data.star2, this.data.star2],
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})