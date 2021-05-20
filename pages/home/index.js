// pages/home/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo:null,
    list:[
      {
        pagePath:"/pages/home/index",
        text:"首页",
        iconPath:"/image/home_unselected.svg",
        selectedIconPath:"/image/home_selected.svg"
      },
      {
          pagePath:"/pages/user/index",
          text:"我的",
          iconPath:"/image/user_unselected.svg",
          selectedIconPath:"/image/user_selected.svg"
      }
  ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad:function(option) {
      var that = this;
      var userInfo = JSON.parse(option.userInfo)
      this.setData({
        userInfo:userInfo
      })
      console.log(this.data.userInfo)
  }
  }
})
