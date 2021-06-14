// pages/authInfo/index.js
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
    authInfo: null,
    errorMessage: "",
    submitSuccess: false,
    submitError: false,
    showInput:false,
    inputContent:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleState(e) {
      if (e.currentTarget.dataset.value == "success") {
        wx.navigateBack({
          delta: 1
        })
      } else if (e.currentTarget.dataset.value == "error") {
        this.setData({
          submitError: false
        })
      }
    },
    inputChange(e) {
      this.setData({
        inputContent: e.detail.value
      });
    },
    confirmModal(e) {
      var that=this
      const eventChannel = this.getOpenerEventChannel()
      this.setData({
        showInput: false
      })
      wxRequest({
        url: 'api/notPassAuth',
        data: {
          userID:that.data.authInfo.userID,
          authID:that.data.authInfo.id,
          isPass:0,
          adminID:app.globalData.userInfo.id,
          remark:that.data.inputContent,
          openid: [that.data.authInfo.openid],
            template_id:"b2-_VqGGjeUqYN9PVRWnixEoGVmU75wnbdEN4PhM42M",
            page:"index",
            miniprogram_state:"developer",
            message:{
              phrase1:{
                value:"审核未通过"
              },
              thing3:{
                value:that.data.inputContent
              },
              thing5:{
                value:"身份认证审核"
              }
            }
        },
      }).then(res => {
        console.log(res)
        if (res.data.state === 200) {
          that.setData({
            submitSuccess:true
          })
          eventChannel.emit('finishAuth', {id: that.data.authInfo.id, tag: "已审核"});
        } else {
          that.setData({
            submitError:true
          })
          wx.lin.showMessage({
            type: "error",
            content: res.data.message
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hideModal(e) {
      this.setData({
        showInput: false
      })
    },
    handlePass(e) {
      var that=this
      const eventChannel = this.getOpenerEventChannel()
      if (e.currentTarget.dataset.value == "pass") {
        wxRequest({
          url: 'api/passAuth',
          data: {
            userID:that.data.authInfo.userID,
            authID:that.data.authInfo.id,
            isPass:1,
            adminID:app.globalData.userInfo.id,
            remark:"",
            openid: [that.data.authInfo.openid],
            template_id:"b2-_VqGGjeUqYN9PVRWnixEoGVmU75wnbdEN4PhM42M",
            page:"index",
            miniprogram_state:"developer",
            message:{
              phrase1:{
                value:"审核通过"
              },
              thing3:{
                value:"无"
              },
              thing5:{
                value:"身份认证审核"
              }
            }
          },
        }).then(res => {
          console.log(res)
          if (res.data.state === 200) {
            that.setData({
              submitSuccess:true
            })
            eventChannel.emit('finishAuth', {id: that.data.authInfo.id, tag: "已审核"});
          } else {
            that.setData({
              submitError:true
            })
            wx.lin.showMessage({
              type: "error",
              content: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (e.currentTarget.dataset.value == "notPass") {
        that.setData({
          showInput:true
        })
      }
    },
    onLoad() {
      var that = this
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading
        });
      });
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('authInfo', function (data) {
        that.setData({
          authInfo: data
        })
      })
    }
  }
})