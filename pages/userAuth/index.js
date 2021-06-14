// pages/userAuth/index.js
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
    imgList: [],
    submitError:false,
    submitSuccess:false,
    errorMessage:""
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
  },
    ChooseImage() {
      wx.chooseImage({
        count: 4, //默认4
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(res.tempFilePaths)
            })
          } else {
            this.setData({   
              imgList: res.tempFilePaths
            })
          }
        }
      });
    },
    ViewImage(e) {
      wx.previewImage({
        urls: this.data.imgList,
        current: e.currentTarget.dataset.url
      });
    },
    DelImg(e) {
      wx.showModal({
        title: '删除图片',
        content: '确定要删除这张图片吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.data.imgList.splice(e.currentTarget.dataset.index, 1);
            this.setData({
              imgList: this.data.imgList
            })
          }
        }
      })
    },
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
    submit(){
      var that=this
      wx.requestSubscribeMessage({
        tmplIds: ['b2-_VqGGjeUqYN9PVRWnixEoGVmU75wnbdEN4PhM42M'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
        success(res) {
          console.log('审核通知', res)
          Promise.allSettled(that.data.imgList.map((item, index) => {
            return new Promise(function (resolve, reject) {
              wx.uploadFile({
                url: app.globalData.baseURL + 'upload', //图片上传处理接口
                filePath: item,
                name: 'file',
                formData: {
                  id: index //设置图片id,需与临时图片id一致，所以初始化赋值时两个均为0即可
                },
                success: function (result) {
                  // that.setData({
                  //   imageid: that.data.imageid + 1 //图片id加1
                  // })
                  console.log(result)
                  resolve(result.data);
                  var data = JSON.parse(result.data)
                  that.data.imgList[data.imageid] = data.imageurl
                },
                fail: function (error) {
                  reject(new Error('failed to upload file'));
                  console.log(error)
                }
              })
            });
          })).then((result) => {
            console.log(that.data)
            that.setData({
              imgList: that.data.imgList
            }, () => {
              wxRequest({
                url: 'api/addUserAuth',
                data: {
                  userID:app.globalData.userInfo.id,
                  name:app.globalData.userInfo.name,
                  university:app.globalData.userInfo.university,
                  images:JSON.stringify(that.data.imgList),
                  openid:wx.getStorageSync('openid')
                },
              }).then(res => {
                console.log(res)
                if (res.data.state === 200) {
                  that.setData({
                    submitSuccess: true
                  })
                } else {
                  that.setData({
                    submitError: true,
                    errorMessage:res.data.message
                  })
                  wx.lin.showMessage({
                    type: "error",
                    content: res.data.message
                  })
                }
              }).catch(err => {
                that.setData({
                  submitError: true
                })
                console.log(err)
              })
            })
          }).catch((err) => {
            console.log(err)
          });
        }
      })
    }
  }
})
