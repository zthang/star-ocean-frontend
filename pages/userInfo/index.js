// pages/userInfo/index.js
const app = getApp()
const {
  wxRequest
} = getApp()
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
    userInfo:app.globalData.userInfo
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad(){
      wx.lin.initValidateForm(this)
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }
  }
})
