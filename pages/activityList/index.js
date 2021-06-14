// pages/activityList/index.js
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
    activityList: [],
    loadState: "loading",
    index: 0,
    size: 5,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPageScroll(res) {
      wx.lin.setScrollTop(res.scrollTop)
    },
    getActivity(e){
      wx.navigateTo({
        url: '/pages/activityStatistic/index',
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('activityInfo', e.currentTarget.dataset.value)
        }
      })
    },
    onLoad() {
      var that = this;
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading
        });
      });
      wxRequest({
        url: 'api/getActivity',
        data: {
          index: that.data.index,
          size: that.data.size
        },
        method: "GET"
      }).then(res => {
        console.log(res)
        if (res.data.state === 200) {
          if(res.data.data.length>0)
          {
            that.setData({
              index: that.data.index + 1,
              activityList: res.data.data,
              loadState:res.data.data.length==that.data.size?"loading":"end"
            })
          }
          else{
            that.setData({
              loadState: "end"
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
    },
    onReachBottom: function () {
      var that = this
      wxRequest({
        url: 'api/getActivity',
        data: {
          index: that.data.index,
          size: that.data.size
        },
        method: "GET"
      }).then(res => {
        console.log(res)
        if (res.data.state === 200) {
          if (res.data.data.length != 0)
            {
              that.setData({
                activityList: that.data.activityList.concat(res.data.data),
                index:that.data.index+1,
                loadState:res.data.data.length==that.data.size?"loading":"end"
              });
            }
          else {
            that.setData({
              loadState: "end"
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
      wx.lin.flushSticky()
    },

  }
})
