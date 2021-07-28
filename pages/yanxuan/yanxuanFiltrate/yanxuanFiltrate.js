// pages/yanxuan/yanxuanFiltrate/yanxuanFiltrate.js
const API = require('../../../utils/api.js');
const util = require('../../../utils/util.js')

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ages: [{
      title: "全选",
      id: 0,
      select: 0
    }, {
      title: "3岁以下",
      id: 3,
      select: 0
    }, {
      title: "4岁",
      id: 4,
      select: 0
    }, {
      title: "5岁",
      id: 5,
      select: 0
    }, {
      title: "6岁",
      id: 6,
      select: 0
    }, {
      title: "7岁",
      id: 7,
      select: 0
    }, {
      title: "8岁",
      id: 8,
      select: 0
    }, {
      title: "9岁",
      id: 9,
      select: 0
    }, {
      title: "10岁以上",
      id: 10,
      select: 0
    }],
    dicengnengli: [],
    xinggetezhi: [],
    tianfu: [],
    xuexifengge: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.updateMini()
    ///获取标签列表
    this.getTagList(1)
    this.getTagList(2)
    this.getTagList(3)
    this.getTagList(4)
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

  },

  ///查询标签列表
  getTagList: function (type) {
    let that = this;
    API.getTagList({
      type: type
    }, app).then(res => {
      console.log("标签列表", JSON.stringify(res))
      ///插入全选
      res.list.splice(0, 0, {
        title: "全选",
        id: "0",
        select: 0
      });

      ///增加属性
      let newArr = res.list.map(v => {
        return {
          ...v,
          select: 0
        }
      });

      if (type == 1) {
        // 底层能力
        that.setData({
          dicengnengli: newArr
        })
      } else if (type == 2) {
        //性格特质
        that.setData({
          xinggetezhi: newArr
        })
      } else if (type == 3) {
        //天赋
        that.setData({
          tianfu: newArr
        })
      } else if (type == 4) {
        //学习风格
        that.setData({
          xuexifengge: newArr
        })
      }
    }).catch(() => {

    });
  },

  ///选中 与 取消选中 逻辑
  select: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    if (type == 0) {
      ///年龄
      that.setData({
        ages: that.sel(that.data.ages, index)
      })
    } else if (type == 1) {
      // 底层能力
      that.setData({
        dicengnengli: that.sel(that.data.dicengnengli, index)
      })
    } else if (type == 2) {
      // 性格特质
      that.setData({
        xinggetezhi: that.sel(that.data.xinggetezhi, index)
      })
    } else if (type == 3) {
      // 天赋
      that.setData({
        tianfu: that.sel(that.data.tianfu, index)
      })
    } else if (type == 4) {
      // 学习风格
      that.setData({
        xuexifengge: that.sel(that.data.xuexifengge, index)
      })
    }
  },

  sel: function (target, index) {
    let that = this;
    let ages = target;
    ///判断点击的是否是全选
    if (index == 0) {
      ///点击的是全选
      let item = ages[index];
      let newArr;
      if (item.select == 0) {
        ///全选
        newArr = ages.map(v => {
          return {
            ...v,
            select: 1
          }
        });
        item.title = "全不选";
        item.select = 1;
        newArr.splice(0, 1, item);

      } else {
        ///全不选
        newArr = ages.map(v => {
          return {
            ...v,
            select: 0
          }
        });
        item.title = "全选";
        item.select = 0; //TODO
        newArr.splice(0, 1, item);
      }

      return newArr;

    } else {
      let item = ages[index];
      item.select = item.select == 0 ? 1 : 0;
      ages.splice(index, 1, item);

      ///判断全选按钮的状态
      let item0 = ages[0];
      let isall = true;
      for (let i = 1; i < ages.length; i++) {
        let item = ages[i];
        if (item.select == 0) {
          ///存在没有选中的
          isall = false;
          break;
        }
      }
      if (isall) {
        item0.select = 1;
        item0.title = "全不选";
      } else {
        item0.select = 0;
        item0.title = "全选";
      }
      ages.splice(0, 1, item0);
      return ages;
    }
  },

  cancel: function () {
    wx.navigateBack({
      delta: 0,
    })
  },

  maketure: function () {
    let that = this;
    let pages = getCurrentPages();
    let lastPage = pages[pages.length - 2];

    let nianling = that.makeParam(that.data.ages);
    let dicengnengli = that.makeParam(that.data.dicengnengli);
    let xinggetezhi = that.makeParam(that.data.xinggetezhi);
    let tianfu = that.makeParam(that.data.tianfu);
    let xuexifengge = that.makeParam(that.data.xuexifengge);

    lastPage.setData({
      age: nianling.map(v => v.id).join(","),
      tag_base: dicengnengli.map(v => v.id).join(","),
      tag_xg: xinggetezhi.map(v => v.id).join(","),
      tag_tf: tianfu.map(v => v.id).join(","),
      tag_xxfg: xuexifengge.map(v => v.id).join(",")
    })

    wx.navigateBack({
      delta: 0,
    })
  },

  makeParam: function (e) {
    let arr = [];
    for (let i = 1; i < e.length; i++) {
      let item = e[i];
      if (item.select == 1) {
        arr.push(item)
      }
    }
    return arr;
  }


})