// pages/editSomething/index.js
const app = getApp()
const {
  wxRequest
} = getApp()

const buttons = [{
    label: '新增',
    icon: "/image/add.png"
  },
  {
    label: '提交',
    icon: "/image/commit.png"
  }
]
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
    loading: false,
    errorMessage: "",
    submitSuccess: false,
    submitError: false,
    showInput: false,
    inputContent: "",
    priceInput: "",
    searchContent: "",
    studentID: "",
    name: "",
    phone: "",
    idCard: "",
    club: [],
    role:0,
    TabCur: 0,
    items: [],
    clubPicker: [],
    universityPicker: [],
    universityIndex: null,
    currentItem: null,
    mode: 0,
    buttons,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchChange(e){
      if(this.data.mode==1)
      {
        this.setData({
          role:this.data.role==0?1:0
        })
      }
      else if(this.data.mode==2)
      {
        this.data.items[e.currentTarget.dataset.itemindex].role=this.data.items[e.currentTarget.dataset.itemindex].role==0?1:0
        this.data.items[e.currentTarget.dataset.itemindex].state=2 // 注意
        this.setData({
          items:this.data.items
        })
      }
    },
    handleInput(e) {
      if (this.data.mode == 2) {
        this.data.items[e.currentTarget.dataset.itemindex].state = 2
        if (e.currentTarget.dataset.value == "studentID") {
          this.data.items[e.currentTarget.dataset.itemindex].studentID = e.detail.value
        } else if (e.currentTarget.dataset.value == "name") {
          this.data.items[e.currentTarget.dataset.itemindex].name = e.detail.value
        } else if (e.currentTarget.dataset.value == "phone") {
          this.data.items[e.currentTarget.dataset.itemindex].phone = e.detail.value
        } else if (e.currentTarget.dataset.value == "idCard") {
          this.data.items[e.currentTarget.dataset.itemindex].idCard = e.detail.value
        }
      } else if (this.data.mode == 1) {
        if (e.currentTarget.dataset.value == "studentID") {
          this.data.studentID = e.detail.value
        } else if (e.currentTarget.dataset.value == "name") {
          this.data.name = e.detail.value
        } else if (e.currentTarget.dataset.value == "phone") {
          this.data.phone = e.detail.value
        } else if (e.currentTarget.dataset.value == "idCard") {
          this.data.idCard = e.detail.value
        }
      }
    },
    PickerChange(e) {
      if (e.currentTarget.dataset.value == "club" && this.data.mode == 2 && this.data.items[e.currentTarget.dataset.itemindex].club.findIndex(item => item.name == this.data.clubPicker[e.detail.value].name && item.state != 3) == -1) {
        this.data.items[e.currentTarget.dataset.itemindex].club.push({
          name: this.data.clubPicker[e.detail.value].name,
          clubID: this.data.clubPicker[e.detail.value].id,
          userID: this.data.items[e.currentTarget.dataset.itemindex].id,
          state: 1
        })
        this.data.items[e.currentTarget.dataset.itemindex].state=2
        this.setData({
          items: this.data.items
        })
      } else if (e.currentTarget.dataset.value == "club" && this.data.mode == 1 && this.data.club.findIndex(item => item.name == this.data.clubPicker[e.detail.value].name) == -1) {
        this.data.club.push({
          name: this.data.clubPicker[e.detail.value].name,
          clubID: this.data.clubPicker[e.detail.value].id,
        })
        this.setData({
          club: this.data.club
        })
      } else if (e.currentTarget.dataset.value == "university"&&this.data.mode==1) {
        this.setData({
          universityIndex: e.detail.value
        })
      } else if (e.currentTarget.dataset.value == "university"&&this.data.mode==2) {
        this.data.items[e.currentTarget.dataset.index].universityIndex=e.detail.value
        this.data.items[e.currentTarget.dataset.index].university=this.data.universityPicker[e.detail.value].name
        this.data.items[e.currentTarget.dataset.index].state=2
        this.setData({
          items: this.data.items
        })
      }
    },
    closeClubTag(e) {
      if (this.data.mode == 2) {
        this.data.items[e.currentTarget.dataset.itemindex].state=2
        if (this.data.items[e.currentTarget.dataset.itemindex].club[e.currentTarget.dataset.clubindex].id != undefined) {
          this.data.items[e.currentTarget.dataset.itemindex].club[e.currentTarget.dataset.clubindex].state = 3
        } else {
          this.data.items[e.currentTarget.dataset.itemindex].club.splice(e.currentTarget.dataset.clubindex, 1)
        }
        this.setData({
          items: this.data.items
        })
      } else if (this.data.mode == 1) {
        this.data.club.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          club: this.data.club
        })
      }
    },
    searchName(e) {
      wxRequest({
        url: 'api/getUsersByName',
        data: {
          name: this.data.searchContent
        },
        method: "GET"
      }).then(res => {
        if (res.data.state === 200) {
          res.data.data.map(item=>{
            item.universityIndex=this.data.universityPicker.findIndex((u)=>u.name==item.university)
          })
          this.setData({
            items: res.data.data,
            mode: 2,
            showInput: false
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
    },
    onClick(e) {
      var that = this
      if (e.detail.index === 0) {
        this.setData({
          showInput: true,
          mode: 1,
          club: [],
          universityIndex: null
        })
        if (this.data.TabCur == 2) {
          this.setData({
            items: [],
          })
        }
      } else if (e.detail.index === 1) {
        if (this.data.TabCur == 0) {
          wxRequest({
            url: 'api/updateLocation',
            data: {
              items: this.data.items
            },
          }).then(res => {
            if (res.data.state === 200) {
              wx.lin.showMessage({
                type: "success",
                duration:3000,
                content: "修改成功！"
              })
              that.tabSelect({currentTarget:{dataset:{id:0}}})
            } else if (res.data.state === -1) {
              wx.lin.showMessage({
                type: "error",
                duration:3000,
                content: res.data.message
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (this.data.TabCur == 1) {
          wxRequest({
            url: 'api/updateGood',
            data: {
              items: this.data.items
            },
          }).then(res => {
            if (res.data.state === 200) {
              wx.lin.showMessage({
                type: "success",
                duration:3000,
                content: "修改成功！"
              })
              that.tabSelect({currentTarget:{dataset:{id:1}}})
            } else if (res.data.state === -1) {
              wx.lin.showMessage({
                type: "error",
                duration:3000,
                content: res.data.message
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else if (this.data.TabCur == 2) {
          this.setData({
            items: this.data.items
          }, () => {
            if(that.data.mode==1)
            {
              wxRequest({
                url: 'api/addUserInfo',
                data: {
                  university:that.data.universityPicker[that.data.universityIndex].name,
                  studentID:that.data.studentID,
                  name:that.data.name,
                  phone:that.data.phone,
                  idCard:that.data.idCard,
                  club:that.data.club,
                  role:that.data.role
                },
              }).then(res => {
                if (res.data.state === 200) {
                  wx.lin.showMessage({
                    type: "success",
                    duration:3000,
                    content: "新增用户成功！"
                  })
                } else if (res.data.state === -1) {
                  wx.lin.showMessage({
                    type: "error",
                    duration:3000,
                    content: res.data.message
                  })
                }
              }).catch(err => {
                console.log(err)
              })
            }
            else if(that.data.mode==2)
            {
              wxRequest({
                url: 'api/updateUserInfo',
                data: {
                  items:that.data.items
                },
              }).then(res => {
                if (res.data.state === 200) {
                  wx.lin.showMessage({
                    type: "success",
                    duration:3000,
                    content: "修改用户信息成功！"
                  })
                  that.searchName()
                } else if (res.data.state === -1) {
                  wx.lin.showMessage({
                    type: "error",
                    duration:3000,
                    content: res.data.message
                  })
                }
              }).catch(err => {
                console.log(err)
              })
            }
          })
        }
      }
    },
    inputChange(e) {
      if (e.currentTarget.dataset.value != "search") {
        this.setData({
          inputContent: e.detail.value
        });
      } else {
        this.setData({
          searchContent: e.detail.value
        });
      }
    },
    priceInputChange(e) {
      this.setData({
        priceInput: e.detail.value
      })
    },
    confirmModal(e) {
      if (this.data.mode == 1 && this.data.TabCur == 0) {
        if (this.data.items.findIndex(item => item.name == this.data.inputContent&&item.state!=3) == -1) {
          this.data.items.push({
            name: this.data.inputContent,
            state: 1
          })
          this.setData({
            items: this.data.items
          })
        } else {
          wx.lin.showMessage({
            type: "error",
            content: "该项已存在！"
          })
        }
      } else if (this.data.mode == 2 && this.data.TabCur == 0) {
        if (this.data.items.findIndex(item => item.name == this.data.inputContent&&item.state!=3) == -1) {
          this.data.items[this.data.currentItem].state = 2
          this.data.items[this.data.currentItem].name = this.data.inputContent
          this.setData({
            items: this.data.items,
          })
        } else {
          wx.lin.showMessage({
            type: "error",
            content: "该项已存在！"
          })
        }
      } else if (this.data.mode == 1 && this.data.TabCur == 1) {
        if (this.data.items.findIndex(item => item.name == this.data.inputContent&&item.state!=3) == -1) {
          this.data.items.push({
            name: this.data.inputContent,
            price: parseInt(this.data.priceInput),
            state: 1
          })
          this.setData({
            items: this.data.items
          })
        } else {
          wx.lin.showMessage({
            type: "error",
            content: "该项已存在！"
          })
        }
      } else if (this.data.mode == 2 && this.data.TabCur == 1) {
        if (this.data.items.findIndex(item => item.name == this.data.inputContent&&item.state!=3) == -1) {
          this.data.items[this.data.currentItem].state = 2
          this.data.items[this.data.currentItem].name = this.data.inputContent
          this.data.items[this.data.currentItem].price = parseInt(this.data.priceInput)
          this.setData({
            items: this.data.items,
          })
        } else {
          wx.lin.showMessage({
            type: "error",
            content: "该项已存在！"
          })
        }
      }
      this.setData({
        showInput: false
      })
    },
    hideModal(e) {
      this.setData({
        showInput: false
      })
    },
    deleteItem(e) {
      if(this.data.items[e.currentTarget.dataset.index].id!=undefined)
      {
        this.data.items[e.currentTarget.dataset.index].state = 3
      }
      else
      {
        this.data.items.splice(e.currentTarget.dataset.index,1)
      }
      this.setData({
        items: this.data.items,
        modalName: null
      })
    },
    editItem(e) {
      this.setData({
        showInput: true,
        currentItem: e.currentTarget.dataset.index,
        modalName: null,
        mode: 2
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
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        items: [],
        showInput: false
      })
      if (e.currentTarget.dataset.id == 0) {
        wxRequest({
          url: 'api/getLocation',
          data: {},
          method: "GET"
        }).then(res => {
          if (res.data.state === 200) {
            this.setData({
              items: res.data.data
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
      } else if (e.currentTarget.dataset.id == 1) {
        wxRequest({
          url: 'api/getGood',
          data: {},
          method: "GET"
        }).then(res => {
          if (res.data.state === 200) {
            this.setData({
              items: res.data.data
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
      } else if (e.currentTarget.dataset.id == 2) {
        if (this.data.clubPicker.length == 0)
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
        if (this.data.universityPicker.length == 0)
            wxRequest({
              url: 'getUniversity',
              data: {},
              method: "GET"
            }).then(res => {
              if (res.data.state === 200) {
                this.setData({
                  universityPicker: res.data.data
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
      }
    },
    onLoad: function (option) {
      var that = this
      app.subscribe('loading', (loading) => {
        this.setData({
          loading: loading
        });
      });
      if (this.data.TabCur == 0)
        wxRequest({
          url: 'api/getLocation',
          data: {},
          method: "GET"
        }).then(res => {
          if (res.data.state === 200) {
            this.setData({
              items: res.data.data
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
    },
    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      var ListTouchDirection = e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      if (ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {

    },
  }
})