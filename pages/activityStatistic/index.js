// pages/activityStatisic/index.js
const app = getApp()
const {
  wxRequest
} = getApp()
const icon = 'data:image/png;base64,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'

const buttons = [{
    label: '反选',
    icon: "/image/selectedAll.png"
  },
  {
    label: '发送通知',
    icon: "/image/notification.png"
  },
  {
    label: '修改活动信息',
    icon: "/image/edite.png"
  },
  {
    label: '修改报名信息',
    icon: "/image/modify.png"
  }
]
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
    buttons,
    isVisible: false,
    showInput: false,
    inputContent: "",
    activityInfo: {},
    loading: false,
    activityList: null,
    items: [],
    options: [{
        text: '全部',
        type: 'custom',
        index: 0,
        highlight: true,
      },
      {
        text: '上车地点',
        type: 'radio',
        index: 1,
        options: [],
      },
      {
        text: '物资需求',
        type: 'radio',
        index: 2,
        options: [],
      },
      {
        text: '住宿方案',
        type: 'radio',
        index: 3,
        options: [],
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function (option) {
      var that = this
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading
        });
      });
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('activityInfo', function (data) {
        that.setData({
          activityInfo: data
        }, () => {
          that.data.activityInfo.selectedLocation.map((item, index) => {
            item.text = item.name
            item.value = item.id
          })
          that.data.activityInfo.selectedGood.map((item, index) => {
            item.text = item.name
            item.value = item.id
          })
          that.data.options[1].options = that.data.activityInfo.selectedLocation
          that.data.options[2].options = that.data.activityInfo.selectedGood
          that.data.options[3].options = that.data.activityInfo.scheme
          that.setData({
            options: that.data.options,
          })
          wxRequest({
            url: 'api/getActivityUsersInfo',
            data: {
              activityID: that.data.activityInfo.id,
            },
            method: "GET"
          }).then(res => {
            console.log(res)
            if (res.data.state === 200) {
              res.data.data.allInfo.map(item => {
                item.tempText = ""
                item.selected = false
              })
              for (var key in res.data.data.locationInfo) {
                res.data.data.locationInfo[key].map(item => {
                  item.tempText = ""
                  item.selected = false
                })
              }
              for (var key in res.data.data.goodInfo) {
                res.data.data.goodInfo[key].map(item => {
                  item.tempText = "个数:" + item.num
                  item.selected = false
                })
              }
              for (var key in res.data.data.schemeInfo) {
                res.data.data.schemeInfo[key].map(item => {
                  item.tempText = ""
                  item.selected = false
                })
              }
              that.setData({
                activityList: res.data.data,
                items: res.data.data.allInfo
              })
            } else {
              wx.lin.showMessage({
                type: "error",
                content: res.data.message
              })
            }
          }).catch(err => {
            console.log(err)
          })
        })
      })
    },
    handleChange(e) {
      if (e.detail.index == 0) {
        this.setData({
          items: this.data.activityList.allInfo
        })
      } else if (e.detail.index == 1) {
        this.setData({
          items: this.data.activityList.locationInfo[e.detail.item.id] != undefined ? this.data.activityList.locationInfo[e.detail.item.id] : []
        })
      } else if (e.detail.index == 2) {
        this.setData({
          items: this.data.activityList.goodInfo[e.detail.item.id] != undefined ? this.data.activityList.goodInfo[e.detail.item.id] : []
        })
      } else if (e.detail.index == 3) {
        var text = e.detail.item.text.replace('=', ',')
        this.setData({
          items: this.data.activityList.schemeInfo[text] != undefined ? this.data.activityList.schemeInfo[text] : []
        })
      }
    },
    hideModal(e) {
      this.setData({
        showInput: false
      })
    },
    inputChange(e) {
      this.setData({
        inputContent: e.detail.value
      });
    },
    confirmModal(e) {
      var that = this
      var openidList = []
      this.data.items.map(item => {
        if (item.selected)
          openidList.push(item.openid)
      })
      if (openidList.length > 0) {
        wxRequest({
          url: 'api/sendMessage',
          data: {
            openid: openidList,
            template_id: "vg-olnxdBPAlF895O-T4sREYjj7zzF0f7CDQVaDLwFE",
            page: "index",
            miniprogram_state: "developer",
            message: {
              thing2: {
                value: that.data.activityInfo.activityName
              },
              thing1: {
                value: that.data.inputContent
              }
            }
          },
        }).then(res => {
          console.log(res)
          if (res.data.state === 200) {
            wx.lin.showMessage({
              type: "success",
              content: "通知发布成功"
            })
          } else {
            wx.lin.showMessage({
              type: "error",
              content: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
        })
        this.setData({
          showInput: false
        })
      } else {
        wx.lin.showMessage({
          type: "error",
          content: "请至少选择一个人"
        })
      }
    },
    checkboxChange(e) {
      this.data.items[e.currentTarget.dataset.value]["selected"] = (this.data.items[e.currentTarget.dataset.value]["selected"] == undefined || this.data.items[e.currentTarget.dataset.value]["selected"] == false) ? true : false
    },
    onClick(e) {
      var that = this
      if (e.detail.index === 0) {
        this.data.items.map(item => {
          item.selected = !item.selected
        })
        this.setData({
          items: this.data.items
        })
      } else if (e.detail.index == 1) {
        var openidList = []
        this.data.items.map(item => {
          if (item.selected)
            openidList.push(item.openid)
        })
        if (openidList.length > 0) {
          that.setData({
            showInput: true
          })
        } else {
          wx.lin.showMessage({
            type: "error",
            content: "请至少选择一个人"
          })
        }
      } else if (e.detail.index == 2) {
        wx.navigateTo({
          url: '/pages/ud_activity/index',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('activityInfo', that.data.activityInfo)
          }
        })
      } else if (e.detail.index == 3) {
        var itemList = []
        this.data.items.map(item => {
          if (item.selected)
            itemList.push(item)
        })
        if (itemList.length != 1) {
          wx.lin.showMessage({
            type: "error",
            content: "必须且只能选择一个人"
          })
        } else {
          wx.navigateTo({
            url: '/pages/ud_enrol/index',
            success: function (res) {
              var aInfo = {}
              var defaultMap = {}
              itemList[0].goods.map(item => {
                defaultMap[item.good] = item.num
              })
              that.data.activityInfo.selectedGood.map(item => {
                item.defaultNum = defaultMap[item.id] != undefined ? defaultMap[item.id] : 0
                item.num = item.defaultNum
              })
              aInfo["id"] = that.data.activityInfo.id
              aInfo["activityPrice"] = that.data.activityInfo.activityPrice
              aInfo["selectedLocation"] = that.data.activityInfo.selectedLocation
              aInfo["selectedGood"] = that.data.activityInfo.selectedGood
              aInfo["scheme"] = that.data.activityInfo.scheme
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit('activityEnrolInfo', {
                activityInfo: aInfo,
                enrolInfo: itemList[0],
              })
            }
          })
        }
      }
    },
    onChange(e) {
      this.setData({
        isVisible: !this.data.isVisible
      })
    },
  }
})