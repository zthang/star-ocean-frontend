// pages/home/index.js
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
    userInfo: null,
    list: [{
        pagePath: "/pages/home/index",
        text: "首页",
        iconPath: "/image/home_unselected.svg",
        selectedIconPath: "/image/home_selected.svg"
      },
      {
        pagePath: "/pages/user/index",
        text: "我的",
        iconPath: "/image/user_unselected.svg",
        selectedIconPath: "/image/user_selected.svg"
      }
    ],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://xzxjlljh.xyz:8787/images/image/big84004.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://xzxjlljh.xyz:8787/images/image/big84006.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://xzxjlljh.xyz:8787/images/image/big39006.jpg'
    }, ],
    activityList: [],
    loadState: "loading",
    index: 0,
    size: 3,
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
        url: '/pages/activityInfo/index',
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
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
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