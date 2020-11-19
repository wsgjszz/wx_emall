// 获取云数据库实例
const db = wx.cloud.database()
// 获取app实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:'',
    userInfo:'',
    hasUserInfo:false,
    orders: [],
    hasAddress: false,
    address: {},
    isAdmin:false,
    openId:'',
    isHide:false
  },
  // 前往编辑中心或关于下单
  toSwitch(res) {
    if (this.data.isHide){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }else{
      wx.navigateTo({
        url: '/pages/about/about',
      })
    }
  }, 
  switchTap(){
    let flag = !this.data.isHide
    this.setData({
      isHide: flag
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      thumb: e.detail.userInfo.avatarUrl,
      nickname: e.detail.userInfo.nickName
    })
    this.cloud_getOpenid()
    wx.setStorageSync('UserInfo', e.detail.userInfo)
  },
  cloud_getOpenid() {
    const self = this
    wx.cloud.callFunction({
      name: "login",
      success(res) {
        self.setData({
          openId: res.result.openid
        })
        wx.setStorageSync('OpenId', res.result.openid)
        app.globalData.user_OpenId = res.result.openid
        self.askId()
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  askId(){
    const self = this
    // console.log(self.data.openId)
    db.collection('admin').get({
      success: res => {  
        console.log(res)
        for(let i in res.data){
          if (res.data[i].openId == self.data.openId) {
            console.log('认证成功')
            self.setData({
              isAdmin: true
            })
            wx.setStorageSync('IsAdmin', true)
            app.globalData.isAdmin = true
            break
          }
        }
      }
    })
  },
  // 退出事件
  quit(){
    wx.removeStorageSync('UserInfo')
    wx.removeStorageSync('IsAdmin')
    wx.removeStorageSync('OpenId')
    this.setData({
      userInfo: '',
      hasUserInfo: false,
      orders: [],
      hasAddress: false,
      address: {},
      isAdmin: false,
      openId: '',
      isHide: false
    })
    app.globalData.isAdmin = false
    app.globalData.userInfo = null
    app.globalData.user_OpenId=''

  },
  onShow() {
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
    wx.getStorage({
      key: 'UserInfo',
      success: function(res) {
        self.setData({
          userInfo: res.data
        })
      },
    }),
      wx.getStorage({
        key: 'IsAdmin',
        success: function (res) {
          self.setData({
            isAdmin: res.data
          })
        },
      }),
      wx.getStorage({
        key: 'OpenId',
        success: function (res) {
          self.setData({
            openId: res.data
          })
        },
      })
    this.setStorageData()
  },
  setStorageData(){
    this.setData({
      userInfo: wx.getStorageSync('UserInfo'),
      isAdmin: wx.getStorageSync('IsAdmin'),
      openId: wx.getStorageSync('OpenId')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setStorageData()
    if(this.data.userInfo){
      console.log('获取到UserInfo')
      this.setData({
        hasUserInfo:true
      })
      console.log(this.data.userInfo)
      console.log(this.data.isAdmin)
      console.log(this.data.openId)
    }else{
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
        })
      } else {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      }
    }
  }
})