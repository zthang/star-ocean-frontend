// index.js
// 获取应用实例
const app = getApp()
const {
  wxRequest
} = getApp()

Page({
  data: {
    canShowInfo: false,
    canShowErrpr:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      console.log(this.data.hasUserInfo)
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  showInfo(e) {
    this.setData({
      canShowInfo: true
    })
  },
  tempLogin(e) {
    wxRequest({
      url: 'loginByPhone',
      data: {
        openid:wx.getStorageSync("openid"),
        phone: "18817221868",
      },
    }).then(res => {
      console.log(res)
      if (res.data.state === 200) {
        wx.setStorageSync('accessToken', res.data.data.token)
        wx.setStorageSync('userID', res.data.data.userID)
        wx.switchTab({
          url: '/pages/user/index',
        })
      }
      else if(res.data.state === -1)
      {
        wx.lin.showMessage({
          type:"error",
          content:res.data.message
        })
        this.setData({
          canShowError:true
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  getphonenumberMethod(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var this_ = this
    this_.setData({
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    })

    // 用手机号登陆
    var openId_ = wx.getStorageSync('openId')
    wxRequest({
      url: 'loginByPhone',
      data: {
        openId: openId_,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      },
    }).then(res => {
      console.log(res.data)
      if (res.data.state === 200) {
        wx.setStorageSync('accessToken', res.data.data.accessToken)
        this_.setData({
          show: false
        })
      } else {
        this_.setData({
          show: false,
          notInnerUser: true
        })
      }
    })
  },
})