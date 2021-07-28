Component({
  data: {
    selected: 0,
    isQudao:false,
    color: "#7F8389",
    selectedColor: "#54D7EF",
    list: [
      {
        "pagePath": "/pages/index/index",
        "text": "测评",
        "iconPath": "/images/tabbar_btn_ceping_nor@2x.png",
        "selectedIconPath": "/images/tabbar_btn_ceping_press@2x.png"
      },
      {
        "pagePath": "/pages/yanxuan/yanxuanMain/yanxuanMain",
        "text": "严选",
        "iconPath": "/images/tabbar_btn_jingxuan_nor@2x.png",
        "selectedIconPath": "/images/tabbar_btn_jingxuan_press@2x.png"
      },
      {
        "pagePath": "/pages/partner/partner",
        "text": "合伙人",
        "iconPath": "/images/tabbar_btn_ceping_nor@2x.png",
        "selectedIconPath": "/images/tabbar_btn_ceping_press@2x.png"
      },
      {
        "pagePath": "/pages/mine/mine",
        "text": "我的",
        "iconPath": "/images/tabbar_btn_me_nor@2x.png",
        "selectedIconPath": "/images/tabbar_btn_me_press@2x.png"
      }
    ]
  },
  attached() { },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
    },
  
  }
})