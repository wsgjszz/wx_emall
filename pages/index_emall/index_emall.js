// 获取数据库实例
const db = wx.cloud.database()
const emall = db.collection('emall')

// pages/index2/index2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    list:[],
    tops:[],
    imgUrls: [
      '/icons/b1.jpg',
      '/icons/b2.jpg',
      '/icons/b3.jpg'
    ]
  },
  //事件函数
  toDetail(e){
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.page=0
    this.getList(true)
    this.getTops()
  },
  // 获取list方法
  getList(isInit){ 
    const PAGE = 10
    wx.showToast({
      title: '加载中',
      icon:'loading'
    })
    emall.skip(this.page * PAGE).limit(PAGE).get({
      success:res=>{

        if(isInit){
          this.setData({
            list:res.data
          })
        }else{
          // 下拉刷新，不能直接覆盖而是累加
          this.setData({
            list:this.data.list.concat(res.data)
          })
          // 停止页面的下拉刷新
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      }
    })
  },
  // 获取轮播图方法
  getTops(){
    emall.orderBy('count','desc').limit(3).get({
      success:res=>{
        this.setData({
          tops:res.data
        })
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
    console.log("监听用户下拉动作")
    this.page=0
    this.getList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面上拉触底事件的处理函数")
    this.page += 1
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})