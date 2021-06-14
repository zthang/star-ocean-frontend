// pages/user/index.js
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
    loading: app.globalData.loading,
    userInfo: app.globalData.userInfo,
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
    cardCur: 0,
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
    }],
    grids1: [{
      index: 11,
      image: "activity",
      text: "发布活动"
    },
    {
      index: 12,
      image: "auth",
      text: "审核身份"
    },
    {
      index: 13,
      image: "activityInfo",
      text: "活动详情"
    },
  ],
    grids2: [{
        index: 0,
        image: "profile",
        text: "个人信息"
      },
      {
        index: 1,
        image: "vip",
        text: "会员权益"
      },
      {
        index: 2,
        image: "authentication",
        text: "身份认证"
      }
      // {
      //   index:2,
      //   image:"point",
      //   text:"积分兑换"
      // }
      // {
      //   index:3,
      //   image:"profile",
      //   text:"个人信息"
      // },
      // {
      //   index:4,
      //   image:"vip",
      //   text:"会员权益"
      // },
      // {
      //   index:5,
      //   image:"point",
      //   text:"积分兑换"
      // }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad() {
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading,
          userInfo:app.globalData.userInfo
        });
      });
    },
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      // wx.getUserProfile({
      //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      //   success: (res) => {
      //     console.log(res)
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //     var jsonstr = JSON.stringify(this.data.userInfo)
      //     console.log(this.data.userInfo)
      //   }
      // })
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    gridTap(e) {
      console.log(e)
      if (e.currentTarget.dataset.index == 0) {
        wx.navigateTo({
          url: '/pages/userInfo/index',
        })
      } else if (e.currentTarget.dataset.index == 1) {
        console.log(this.data)
        wx.navigateTo({
          url: '/pages/vip/index',
        })
      } else if (e.currentTarget.dataset.index == 2) {
        wxRequest({
          url: 'api/getUserInfo',
          data: {
            userID:wx.getStorageSync("userID"),
          },
          method: "GET"
        }).then(res => {
          if (res.data.state === 200) {
            app.globalData.userInfo = res.data.data
            this.setData({
              userInfo: res.data.data
            })
            if (app.globalData.userInfo.isAuth == 0) {
              wx.lin.showMessage({
                type: "error",
                content: "信息已提交，请等待管理员审核"
              })
            } else if (app.globalData.userInfo.isAuth == 1) {
              wx.lin.showMessage({
                type: "error",
                content: "您的信息已审核通过，无需再次审核"
              })
            } else {
              wx.navigateTo({
                url: '/pages/userAuth/index',
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
      } else if (e.currentTarget.dataset.index == 11) {
        wx.navigateTo({
          url: '/pages/mk_activity/index',
        })
      } else if (e.currentTarget.dataset.index == 12) {
        wx.navigateTo({
          url: '/pages/authUser/index',
        })
      } else if (e.currentTarget.dataset.index == 13) {
        wx.navigateTo({
          url: '/pages/activityList/index',
        })
      }
    },
    getVipCode(e) {

    }
  }
})