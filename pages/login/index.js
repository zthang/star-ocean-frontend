// index.js
// 获取应用实例
const app = getApp()
const {
  wxRequest
} = getApp()

Page({
  data: {
    studentRules: [{
        required: true,
        message: "学号不能为空"
      },
      // {
      //   pattern: '^1(3|4|5|7|8)\\d{9}$',
      //   message: '手机号不正确，请重新输入'
      // }
    ],
    universityList: null,
    universityIndex: null,
    studentID: null,
    name: "",
    isStudentValid: false,
    universityValid: false,
    canShowInfo: false,
    canShowErrpr: false,
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
  handleInput(e) {
    if (e.currentTarget.dataset.value == "student_id") {
      this.setData({
        studentID: e.detail.value
      })
    } else if (e.currentTarget.dataset.value == "name") {
      this.setData({
        name: e.detail.value
      })
    }
  },
  handleValidation(e) {
    if (e.currentTarget.dataset.value == "student_id") {
      this.setData({
        isStudentValid: !e.detail.isError
      })
    }
  },
  onLoad() {
    if (wx.getUserProfile) {
      console.log(this.data.hasUserInfo)
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    wxRequest({
      url: 'getUniversity',
      data: {},
      method: "GET"
    }).then(res => {
      if (res.data.state === 200) {
        this.setData({
          universityList: res.data.data
        })
      } else if (res.data.state === -1) {
        wx.lin.showMessage({
          type: "error",
          content: res.data.message
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  showInfo(e) {
    this.setData({
      canShowInfo: true
    })
  },
  PickerChange(e) {
    if (e.currentTarget.dataset.value == "university") {
      this.setData({
        universityIndex: e.detail.value,
        universityValid: true
      })
    }
  },
  isValid() {
    return this.data.name.length > 1 && this.data.isStudentValid && this.data.universityValid
  },
  tempLogin(e) {
    var that = this
    if (!this.isValid()) {
      wx.lin.showMessage({
        type: "error",
        content: "请检查是否填写完整无误"
      })
    } else {
      wxRequest({
        url: 'loginByInfo',
        data: {
          openid: wx.getStorageSync("openid"),
          university: that.data.universityList[that.data.universityIndex].name,
          name: that.data.name,
          studentID: that.data.studentID,
        },
      }).then(res => {
        console.log(res)
        if (res.data.state === 200) {
          wx.setStorageSync('accessToken', res.data.data.token)
          wx.setStorageSync('userID', res.data.data.userID)
          app.globalData.userInfo = res.data.data.userInfo
          wx.switchTab({
            url: '/pages/home/index',
          })
        } else if (res.data.state === -1) {
          wx.lin.showMessage({
            type: "error",
            content: res.data.message
          })
          this.setData({
            canShowError: true
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
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
    var openid = wx.getStorageSync('openid')
    wxRequest({
      url: 'loginByPhone',
      data: {
        openid: openid,
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