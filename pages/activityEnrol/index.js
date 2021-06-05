// pages/activityEnrol/index.js
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
    locationIndex: null,
    schemeIndex: null,
    name: "",
    phone: "",
    urgentPhone: "",
    idCard: "",
    remark: "",
    submitSuccess: false,
    submitError: false,
    activityInfo: {
    },
    phoneRules: [{
        required: true,
        message: "手机号不能为空"
      },
      {
        pattern: '^1(3|4|5|7|8)\\d{9}$',
        message: '手机号不正确，请重新输入'
      }
    ],
    idCardRules: [{
        required: true,
        message: "身份证号不能为空"
      },
      {
        pattern: '(^\\d{15}$)|(^\\d{17}([0-9]|X|x)$)',
        message: '身份证不正确，请重新输入'
      }
    ],
    canShowInfo: false,
    isPhoneValid: false,
    isUrgentPhoneValid: false,
    isIdCardValid: false,
    schemeValid: false,
    locationValid: false,
    isAgree: false,
    haveRead:false,
    canCountDown:false,
    errorMessage:"",
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
    submit() {
      var that=this
      if (!this.isValid()) {
        wx.lin.showMessage({
          type: 'error',
          content: "请检测是否填写完整！"
        })
      } else {
        var goodsPrice=0
        for(var i=0;i<this.data.activityInfo.selectedGood.length;i++)
          goodsPrice+=this.data.activityInfo.selectedGood[i].price*this.data.activityInfo.selectedGood[i].num
        var shouldPay=this.data.activityInfo.activityPrice+parseInt(this.data.activityInfo.scheme[this.data.schemeIndex].price)+goodsPrice
        wxRequest({
          url: 'api/activityEnrol',
          data: {
            activityID:this.data.activityInfo.id,
            userID:app.globalData.userInfo=null?app.globalData.userInfo.id:-1,
            name:this.data.name,
            phone:this.data.phone,
            urgentPhone:this.data.urgentPhone,
            idCard:this.data.idCard,
            location:this.data.activityInfo.selectedLocation[this.data.locationIndex].id,
            scheme:this.data.activityInfo.scheme[this.data.schemeIndex],
            goods:this.data.activityInfo.selectedGood,
            remark:this.data.remark,
            shouldPay:shouldPay
          },
        }).then(res => {
          console.log(res)
          if (res.data.state === 200) {
            that.setData({
              submitSuccess:true
            })
          } else {
            that.setData({
              submitError:true,
              errorMessage:res.data.message
            })
            wx.lin.showMessage({
              type: "error",
              content: res.data.message
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    onLoad: function (option) {
      var that = this
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading
        });
      });
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('activityInfo', function (data) {
        that.setData({
          activityInfo:data
        })
        console.log(that.data.activityInfo.selectedLocation)
      })
    },
    tapAgree(e) {
      this.setData({
        isAgree: e.detail.checked
      })
    },
    handleCount(e) {
      var id = e.currentTarget.dataset.value
      this.data.activityInfo.selectedGood.map((item) => {
        if (item.id == id) {
          item.num = e.detail.count
          this.setData({
            activityInfo: this.data.activityInfo
          })
        }
      })
    },
    PickerChange(e) {
      if (e.currentTarget.dataset.value == "location") {
        this.setData({
          locationIndex: e.detail.value,
          locationValid: true
        })
      } else {
        this.setData({
          schemeIndex: e.detail.value,
          schemeValid: true
        })
      }
    },
    handleInput(e) {
      if (e.currentTarget.dataset.value == "name") {
        this.setData({
          name: e.detail.value
        })
      } else if (e.currentTarget.dataset.value == "phone") {
        this.setData({
          phone: e.detail.value
        })
      } else if (e.currentTarget.dataset.value == "urgentPhone") {
        this.setData({
          urgentPhone: e.detail.value
        })
      } else if (e.currentTarget.dataset.value == "idCard") {
        this.setData({
          idCard: e.detail.value
        })
      }else if (e.currentTarget.dataset.value == "remark") {
        this.setData({
          remark: e.detail.value
        })
      }
    },
    handleValidation(e) {
      if (e.currentTarget.dataset.value == "phone") {
        this.setData({
          isPhoneValid: !e.detail.isError
        })
      } else if (e.currentTarget.dataset.value == "urgentPhone") {
        this.setData({
          isUrgentPhoneValid: !e.detail.isError
        })
      } else if (e.currentTarget.dataset.value == "idCard") {
        this.setData({
          isIdCardValid: !e.detail.isError
        })
      }
    },
    isValid() {
      return this.data.isPhoneValid && this.data.isUrgentPhoneValid && this.data.isIdCardValid && this.data.locationValid && this.data.schemeValid && this.data.isAgree
    },
    showInfo(e) {
      this.setData({
        canShowInfo: true,
        canCountDown:true
      })
    },
    canArgee(e){
      this.setData({
        haveRead:true
      })
    },
    confirmAgree(e){
      this.setData({
        canCountDown:false
      })
    }
  },
})