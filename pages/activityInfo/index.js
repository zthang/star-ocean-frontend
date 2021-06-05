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
          for (var i = 0; i < that.data.activityInfo.scheme.length; i++) {
            var arr = that.data.activityInfo.scheme[i].split('=')
            that.data.activityInfo.scheme[i] = that.data.activityInfo.scheme[i].replace('=', ',') + "元/人"
            that.data.activityInfo.scheme[i] = {
              "text": that.data.activityInfo.scheme[i],
              "price": arr[1]
            }
          }
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
      // wxRequest({
      //   url: '',
      //   data: {
      //   },
      // }).then(res => {
      //   console.log(res)
      //   if (res.data.state === 200) {

      //   }
      //   else
      //   {
      //     wx.lin.showMessage({
      //       type:"error",
      //       content:res.data.message
      //     })
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
      for (var i = 0; i < this.data.activityInfo.selectedGood.length; i++)
        this.data.activityInfo.selectedGood[i].num = 0;
      this.setData({
        selectedGood: this.data.activityInfo.selectedGood
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
  }
})