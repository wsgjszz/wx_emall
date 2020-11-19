//app.js
App({
  onLaunch: function () {
    //云开发环境初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'emall-d859x',//环境配置
        traceUser: true,
        })
    }
    // 将信息存入缓存
    var Carts = wx.getStorageSync('Carts') || []
    wx.setStorageSync('Carts', Carts)
  },
  globalData: {
    userInfo: null,
    addId:'',
    addNum:0,
    carts:[],
    user_OpenId:'',
    isAdmin: false,
    orders:[],
    totalPrice:0
  }
})