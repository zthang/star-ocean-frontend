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
  data:{
    loading:app.globalData.loading,
    userInfo:app.globalData.userInfo,
    list:[
      {
        pagePath:"/pages/home/index",
        text:"首页",
        iconPath:"/image/home_unselected.svg",
        selectedIconPath:"/image/home_selected.svg"
      },
      {
          pagePath:"/pages/user/index",
          text:"我的",
          iconPath:"/image/user_unselected.svg",
          selectedIconPath:"/image/user_selected.svg"
      }
    ],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: '/image/pic1.jpg'
    }, {
      id: 1,
        type: 'image',
        url: '/image/pic2.jpg',
    }, {
      id: 2,
      type: 'image',
      url: '/image/pic1.jpg'
    }],
    grids2:[
      {
        index:0,
        image:"profile",
        text:"个人信息"
      },
      {
        index:1,
        image:"vip",
        text:"会员权益"
      },
      {
        index:2,
        image:"point",
        text:"积分兑换"
      }
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
    onLoad(){
      app.subscribe('loading', (loading) => {
        this.setData({
            loading:loading
        });
    });
      wxRequest({
        url: 'api/getUserInfo',
        data: {
          // userID:wx.getStorageSync("userID"),
          userID:1
        },
        method:"GET"
      }).then(res => {
        if (res.data.state === 200) {
          app.globalData.userInfo=res.data.data
          this.setData({
            userInfo:res.data.data
          })
          console.log(res.data.data)
        }
        else if(res.data.state === -1)
        {
          wx.lin.showMessage({
            type:"error",
            content:res.data.message
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          var jsonstr = JSON.stringify(this.data.userInfo)
          console.log(this.data.userInfo)
        }
      })
    },
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    gridTap(e){
      console.log(e)
      if(e.currentTarget.dataset.index==0)
      {
        wx.navigateTo({
          url: '/pages/userInfo/index',
        })
      }
      else if(e.currentTarget.dataset.index==1)
      {
        wx.navigateTo({
          url: '/pages/vip/index',
        })
      }
    },
    getVipCode(e){
      
    }
  }
})
