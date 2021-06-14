// pages/authUser/index.js
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
    authList: [],
    loadState: "loading",
    index: 0,
    size: 6,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPageScroll(res) {
      wx.lin.setScrollTop(res.scrollTop)
    },
    getAuth(e) {
      var that=this
      wx.navigateTo({
        url: '/pages/authInfo/index',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          finishAuth: function(data) {
            console.log(data)
            that.data.authList.map(item=>{
              if(item.id==data.id)
              {
                item.tag=data.tag
              }
            })
            that.setData({
              authList:that.data.authList
            })
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('authInfo', e.currentTarget.dataset.value)
        }
      })
    },
    onLoad() {
      var that = this;
      wxRequest({
        url: 'api/getUserAuthInfo',
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
            res.data.data.map(item=>{
              item.tag="未审核"
              item.images=JSON.parse(item.images)
            })
            that.setData({
              index: that.data.index + 1,
              authList: res.data.data,
              loadState:res.data.data.length==that.data.size?"loading":"end"
            })
          }
          else{
            that.setData({
              loadState:"end"
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
        url: 'api/getUserAuthInfo',
        data: {
          index: that.data.index,
          size: that.data.size
        },
        method: "GET"
      }).then(res => {
        console.log(res)
        if (res.data.state === 200) {
          if (res.data.data.length != 0) {
            res.data.data.map(item=>{
              item.tag="未审核"
              item.images=JSON.parse(item.images)
            })
            that.setData({
              authList: that.data.authList.concat(res.data.data),
              index: that.data.index + 1,
              loadState:res.data.data.length==that.data.size?"loading":"end"
            });
          } else {
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