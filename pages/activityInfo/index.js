// pages/activityInfo/index.js
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
    activityInfo: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function (option) {
      var that = this
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('activityInfo', function (data) {
        that.setData({
          activityInfo: data
        }, () => {
          that.data.activityInfo.delta = JSON.parse(that.data.activityInfo.delta)
          that.setData({
            activityInfo: that.data.activityInfo
          }, () => {
            var query = wx.createSelectorQuery(); //创建节点查询器 
            query.in(that).select('#editor').context(function (res) {
              res.context.setContents({
                delta: that.data.activityInfo.delta,
                success: function (res) {
                  // console.log(res.data)
                },
                fail: function (error) {
                  console.log(error)
                }
              })
            }).exec()
          })
        })
      })
    },
    enrol() {
      var that = this
      // var isBanned = that.data.activityInfo.selectedUniversity.findIndex(item => item.name == app.globalData.userInfo.university) != -1
      var ddl = new Date(Date.parse(that.data.activityInfo.activityDDL.replace('-', '/')))
      var now = new Date()
      // if (isBanned) {
      //   wx.lin.showMessage({
      //     type: "error",
      //     content: "您所在的学校不在此次活动范围内！"
      //   })
      // } else 
      if (ddl.getTime() < now.getTime()) {
        wx.lin.showMessage({
          type: "error",
          content: "已过活动报名截止日期！"
        })
      } else {
        wxRequest({
          url: 'api/getUserInfo',
          data: {
            userID: wx.getStorageSync("userID"),
          },
          method: "GET"
        }).then(res => {
          if (res.data.state === 200) {
            app.globalData.userInfo = res.data.data
            if (app.globalData.userInfo.isAuth != 1) {
              wx.lin.showMessage({
                type: "error",
                content: "请先进行学生认证！"
              })
            } else {
              wxRequest({
                url: 'api/checkIfEnrolled',
                data: {
                  userID: app.globalData.userInfo.id,
                  activityID: that.data.activityInfo.id,
                },
              }).then(res => {
                console.log(res)
                if (res.data.state === 200) {
                  if (res.data.data == 1) {
                    wx.lin.showMessage({
                      type: "error",
                      content: "您已经报过名了！"
                    })
                  } else {
                    for (var i = 0; i < that.data.activityInfo.selectedGood.length; i++)
                    that.data.activityInfo.selectedGood[i].num = 0;
                    that.setData({
                      selectedGood: that.data.activityInfo.selectedGood
                    }, () => {
                      wx.navigateTo({
                        url: '/pages/activityEnrol/index',
                        success: function (res) {
                          // 通过eventChannel向被打开页面传送数据
                          res.eventChannel.emit('activityInfo', {
                            id: that.data.activityInfo.id,
                            selectedLocation: that.data.activityInfo.selectedLocation,
                            selectedGood: that.data.activityInfo.selectedGood,
                            scheme: that.data.activityInfo.scheme,
                            activityPrice: that.data.activityInfo.activityPrice
                          })
                        }
                      })
                    })
                  }
                } else {
                  wx.lin.showMessage({
                    type: "error",
                    content: res.data.message
                  })
                }
              }).catch(err => {
                console.log(err)
              })
            }
          } else if (res.data.state === -1) {
            wx.lin.showMessage({
              type: "error",
              content: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
})