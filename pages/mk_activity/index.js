// pages/mk_activity/index.js
const app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js');
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
    isEditing:false,
    loading: false,
    formats: {},
    readOnly: false,
    placeholder: '请输入活动介绍......',
    editorHeight: 300,
    keyboardHeight: 0,
    scrollHeight: 0,
    isIOS: false,
    tempimageid: 0,
    imageid: 0,
    image: [{}],
    date: '2021-06-01',
    locationPicker: [],
    selectedLocation: [],
    goodPicker: [],
    selectedGood: [],
    clubPicker: [],
    selectedClub: [],
    showInput: false,
    inputContent: "",
    scheme: [],
    activityName: "",
    activityLocation: "",
    activityPrice: "",
    delta: null,
    tempImages: [],
    submitSuccess: false,
    submitError: false,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: null,
    endYear: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择日期时间
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr

    });
  },
    handleState(e) {
      if (e.currentTarget.dataset.value == "success") {
        wx.switchTab({
          url: '/pages/user/index',
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
      } else if (e.currentTarget.dataset.value == "error") {
        this.setData({
          submitError: false
        })
      }
    },
    handleInput(e) {
      if (e.currentTarget.dataset.value == "name") {
        this.setData({
          activityName: e.detail.value
        })
      } else if (e.currentTarget.dataset.value == "location") {
        this.setData({
          activityLocation: e.detail.value
        })
      } else if (e.currentTarget.dataset.value == "price") {
        this.setData({
          activityPrice: e.detail.value
        })
      }
    },
    inputChange(e) {
      this.setData({
        inputContent: e.detail.value
      });
    },
    showModal(e) {
      this.setData({
        showInput: true
      })
    },
    confirmModal(e) {
      this.data.scheme.push(this.data.inputContent.replace('＝','=').replace('，',','))
      this.setData({
        scheme: this.data.scheme,
        showInput: false
      })
    },
    hideModal(e) {
      this.setData({
        showInput: false
      })
    },
    locationPickerChange(e) {
      var index = e.detail.value
      if (this.data.selectedLocation.findIndex(item => item.id == this.data.locationPicker[index].id) == -1) {
        this.data.selectedLocation.push(this.data.locationPicker[index])
        this.setData({
          selectedLocation: this.data.selectedLocation
        })
      }
    },
    goodPickerChange(e) {
      var index = e.detail.value
      if (this.data.selectedGood.findIndex(item => item.id == this.data.goodPicker[index].id) == -1) {
        this.data.selectedGood.push(this.data.goodPicker[index])
        this.setData({
          selectedGood: this.data.selectedGood
        })
      }
    },
    clubPickerChange(e) {
      var index = e.detail.value
      if (this.data.selectedClub.findIndex(item => item.id == this.data.clubPicker[index].id) == -1) {
        this.data.selectedClub.push(this.data.clubPicker[index])
        this.setData({
          selectedClub: this.data.selectedClub
        })
      }
    },
    closeLocationTag(e) {
      var removeID = e.currentTarget.dataset.value
      this.data.selectedLocation.splice(this.data.selectedLocation.findIndex(item => item.id == removeID), 1)
      this.setData({
        selectedLocation: this.data.selectedLocation
      })
    },
    closeGoodTag(e) {
      var removeID = e.currentTarget.dataset.value
      this.data.selectedGood.splice(this.data.selectedGood.findIndex(item => item.id == removeID), 1)
      this.setData({
        selectedGood: this.data.selectedGood
      })
    },
    closeClubTag(e) {
      var removeID = e.currentTarget.dataset.value
      this.data.selectedClub.splice(this.data.selectedClub.findIndex(item => item.id == removeID), 1)
      this.setData({
        selectedClub: this.data.selectedClub
      })
    },
    closeSchemeTag(e) {
      var removeValue = e.currentTarget.dataset.value
      this.data.scheme.splice(this.data.scheme.findIndex(item => item == removeValue), 1)
      this.setData({
        scheme: this.data.scheme
      })
    },
    DateChange(e) {
      this.setData({
        date: e.detail.value
      })
    },
    onEditorReady() {
      const that = this
      wx.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
      }).exec()
    },
    getContent() {
      const that = this
      if(this.data.activityName.length==0||this.data.activityLocation.length==0||this.data.activityPrice.length==0)
      {
        wx.lin.showMessage({
          type: "error",
          content: "请将信息填写完整！"
        })
        return
      }
      if(this.data.selectedLocation.length==0)
      {
        wx.lin.showMessage({
          type: "error",
          content: "请至少选择一个上车地点！"
        })
        return
      }
      if(this.data.selectedClub.length==0)
      {
        wx.lin.showMessage({
          type: "error",
          content: "请至少选择一个受众社团！"
        })
        return
      }
      this.replaceImage()
    },
    readOnlyChange() {
      this.setData({
        readOnly: !this.data.readOnly
      })
    },
    replaceImage() {
      const that = this
      //获取编辑器内容
      that.editorCtx.getContents({
        success: function (res) { //获取返回的delta对象     
          var length = res.delta.ops.length;
          var text=""
          for (var i = 0; i < length; i++) {
            if (res.delta.ops[i].attributes && res.delta.ops[i].attributes.hasOwnProperty('data-custom')) { //筛选出里面的图片
              // var id = parseInt(res.delta.ops[i].attributes['data-custom'].trim().slice(3)); //取出临时图片的id
              var tempURL = res.delta.ops[i].insert.image
              var t = {
                index: i,
                tempUrl: tempURL
              }
              that.data.tempImages.push({
                index: i,
                tempUrl: tempURL
              })
              that.setData({
                tempImages: that.data.tempImages
              })
            }
            else
            {
              text+=res.delta.ops[i].insert
            }
          }

          Promise.allSettled(that.data.tempImages.map((item, index) => {
            return new Promise(function (resolve, reject) {
              wx.uploadFile({
                url: app.globalData.baseURL + 'upload', //图片上传处理接口
                filePath: item.tempUrl,
                name: 'file',
                formData: {
                  id: item.index //设置图片id,需与临时图片id一致，所以初始化赋值时两个均为0即可
                },
                success: function (result) {
                  // that.setData({
                  //   imageid: that.data.imageid + 1 //图片id加1
                  // })
                  resolve(result.data);
                  var data = JSON.parse(result.data)
                  res.delta.ops[data.imageid].insert.image = data.imageurl
                  res.delta.ops[data.imageid].attributes["data-local"]=data.imageurl
                },
                fail: function (error) {
                  reject(new Error('failed to upload file'));
                  console.log(error)
                }
              })
            });
          })).then((result) => {
            console.log(result)
            that.setData({
              delta: res.delta
            }, () => {
              console.log(text)
              wxRequest({
                url: 'api/addActivity',
                data: {
                  activityName: that.data.activityName,
                  activityDate: that.data.date,
                  activityDDL:that.data.dateTimeArray1[0][that.data.dateTime1[0]]+'-'+that.data.dateTimeArray1[1][that.data.dateTime1[1]]+'-'+that.data.dateTimeArray1[2][that.data.dateTime1[2]]+' '+
                  that.data.dateTimeArray1[3][that.data.dateTime1[3]]+':'+that.data.dateTimeArray1[4][that.data.dateTime1[4]]+':'+that.data.dateTimeArray1[5][that.data.dateTime1[5]],
                  activityLocation: that.data.activityLocation,
                  activityPrice: parseInt(that.data.activityPrice),
                  selectedLocation: that.data.selectedLocation.map(item => item.id),
                  selectedGood: that.data.selectedGood.map(item => item.id),
                  selectedClub: that.data.selectedClub.map(item => item.id),
                  scheme: that.data.scheme,
                  delta: JSON.stringify(that.data.delta),
                  showImg: result.length > 0 ? JSON.parse(result[0].value).imageurl : null,
                  plainText:text.replace(/[\'\"\\\/\b\f\n\r\t]/g, '')
                },
              }).then(res => {
                console.log(res)
                if (res.data.state === 200) {
                  that.setData({
                    submitSuccess: true
                  })
                } else {
                  that.setData({
                    submitError: true
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
    },
    onPageScroll(e) {
      this.setData({
        scrollHeight: e.scrollTop
      })
    },
    onLoad() {
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading
        });
      });
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      // 精确到分的处理，将数组的秒去掉
      //var lastArray = obj1.dateTimeArray.pop();
      //var lastTime = obj1.dateTime.pop();

      this.setData({
        dateTimeArray1: obj1.dateTimeArray,
        dateTime1: obj1.dateTime
      });
      wxRequest({
        url: 'api/getLocation',
        data: {},
        method: "GET"
      }).then(res => {
        if (res.data.state === 200) {
          this.setData({
            locationPicker: res.data.data
          })
        } else if (res.data.state === -1) {
          wx.lin.showMessage({
            type: "error",
            content: res.data.message
          })
        }
      }).catch(err => {
        console.log(err)
      })
      wxRequest({
        url: 'api/getGood',
        data: {},
        method: "GET"
      }).then(res => {
        if (res.data.state === 200) {
          this.setData({
            goodPicker: res.data.data
          })
        } else if (res.data.state === -1) {
          wx.lin.showMessage({
            type: "error",
            content: res.data.message
          })
        }
      }).catch(err => {
        console.log(err)
      })
      wxRequest({
        url: 'api/getClub',
        data: {},
        method: "GET"
      }).then(res => {
        if (res.data.state === 200) {
          this.setData({
            clubPicker: res.data.data
          })
        } else if (res.data.state === -1) {
          wx.lin.showMessage({
            type: "error",
            content: res.data.message
          })
        }
      }).catch(err => {
        console.log(err)
      })
      const platform = wx.getSystemInfoSync().platform
      const isIOS = platform === 'ios'
      this.setData({
        isIOS
      })
      const that = this
      this.updatePosition(0)
      let keyboardHeight = 0
      wx.onKeyboardHeightChange(res => {
        if (res.height === keyboardHeight) return
        // const duration = res.height > 0 ? res.duration * 1000 : 0
        keyboardHeight = res.height
        that.updatePosition(keyboardHeight)
        that.editorCtx.scrollIntoView()
        // setTimeout(() => {
        //   wx.pageScrollTo({
        //     scrollTop: 0,
        //     success() {
        //       that.updatePosition(keyboardHeight)
        //       that.editorCtx.scrollIntoView()
        //     }
        //   })
        // }, duration)
      })

      //content是从数据库获取的数据里的delta字符串，然后装换为json
      // wxRequest({
      //   url: 'getDelta',
      //   data: {},
      //   method: "GET"
      // }).then(res => {
      //   var content = res.data
      //   console.log(1)
      //   console.log(content)
      //   var query = wx.createSelectorQuery(); //创建节点查询器 
      //   query.in(that).select('#editor').context(function (res) {
      //     res.context.setContents({
      //       delta: content,
      //       success: function (res) {
      //         // console.log(res.data)
      //       },
      //       fail: function (error) {
      //         console.log(error)
      //       }
      //     })
      //   }).exec()
      // }).catch(err => {
      //   console.log(err)
      // })

    },
    updatePosition(keyboardHeight) {
      // const toolbarHeight = 50
      // const {
      //   windowHeight,
      //   platform
      // } = wx.getSystemInfoSync()
      // let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
      // editorHeight = editorHeight / 3
      this.setData({
        // editorHeight,
        keyboardHeight
      })
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync()
      const {
        statusBarHeight,
        platform
      } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    },
    focus(){
      this.setData({
        isEditing:true
      })
    },
    blur() {
      this.setData({
        isEditing:false
      })
    },
    format(e) {
      let {
        name,
        value
      } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({
        formats
      })
    },
    invertAll(e){
      var tempSelectedClub=[]
      for(var i=0;i<this.data.clubPicker.length;i++)
      {
        if (this.data.selectedClub.findIndex(item => item.id == this.data.clubPicker[i].id) == -1) {
          tempSelectedClub.push(this.data.clubPicker[i])
        }
      }
      this.setData({
        selectedClub: tempSelectedClub
      })
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clickLogText(e) {
      that.editorCtx.getContents({
        success: function (res) {
          console.log(res.html)
          wx.setStorageSync("content", res.html); // 缓存本地
          console.log(res.html)
        }
      })
    },
    undo() {
      this.editorCtx.undo();
    },
    redo() {
      this.editorCtx.redo();
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          // console.log("clear success")
        }
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      const that = this
      //选择图片
      wx.chooseImage({
        count: 1,
        success: function (res) {
          //调用EditorContext.insertImage(Object object)方法
          that.editorCtx.insertImage({
            src: res.tempFilePaths[0], //插入图片临时文件地址
            data: {
              id: that.data.tempimageid, //临时图片id
              // role: ''
            },
            height: '80%',
            width: '80%',
            alt: 'img',
            success: function () {
              that.setData({
                tempimageid: that.data.tempimageid + 1 //临时图片id加1
              })
            }
          })
        }
      })
    }
  }
})