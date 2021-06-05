// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.initObserve();
    //登录
    this.myLogin()
  },
  // 监听globalData中属性变化
initObserve() {
  const obj = this.globalData;
  const keys = ['loading'];
  keys.forEach(key => {
      let value = obj[key];
      obj[`${key}SubscriberList`] = [];
      Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          set(newValue) {
              obj[`${key}SubscriberList`].forEach(watch => {
                  watch(newValue);
              });
              value = newValue;
          },
          get() {
              return value;
          }
      });
  });
},

// 订阅globalData中某个属性变化
subscribe(key, watch) {
watch(this.globalData[key]);
  this.globalData[`${key}SubscriberList`].push(watch);
},

  myLogin(){
    var _this = this
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          _this.wxRequest({
            url:'login',
            data:{
              code:res.code,
            },
          }).then(res => {
            if (res.data.state === 200) {
              console.log(res)
              let openid = res.data.data.openid
              wx.setStorageSync('openid',openid)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseURL:'http://localhost:8787/',
    // baseURL:'http://192.168.1.12:8787/',
    loading:null,
  },
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
  wxRequest(params){
    return new Promise((resolve, reject)=>{
      const accessToken = wx.getStorageSync('accessToken')
      console.log(this.globalData.baseURL + params.url)
      this.globalData.loading=true
      var _this=this
      wx.request({
        url: this.globalData.baseURL + params.url,
        data:params.data,
        header:{
          Authorization: accessToken,
        },
        method: params.method||'POST',
        dataType:params.dataType||'json',
        success(res){
          _this.globalData.loading=false
          resolve(res)
        },
        fail(err){
          _this.globalData.loading=false
          reject(err)
          wx.lin.showMessage({
            type:'error',
            content:err.errMsg
        })
        }
      })
    })
  },
})
