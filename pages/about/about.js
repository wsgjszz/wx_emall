// 获取app实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:'',
    isHide:true,
    total:0
  },
  switchTap(){
    let flag = !this.data.isHide
    this.setData({
      isHide:flag
    })
  },
  toUser(){
    app.globalData.totalPrice = 0
    console.log('toUser')
    wx.switchTab({
      url: '/pages/user/user',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      total: app.globalData.totalPrice
    })
    wx.cloud.database().collection('notice').get({
      success: res => {
        let length = res.data.length
        this.setData({
          notice: res.data[length - 1].name
        })
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      data: app.globalData.totalPrice
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})