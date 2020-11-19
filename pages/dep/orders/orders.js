// 获取云数据库实例
const db = wx.cloud.database()
const order = db.collection('order')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    status:false, //处理状态
    aclass:"left_list on",
    bclass:"left_list"
  },
  // 切换类
  switchTapa(){
    if (this.data.aclass == "left_list on"){
      this.setData({
        aclass:"letf_list",
        bclass:"letf_list on",
        status:true
      })
    } else{
      this.setData({
        aclass: "letf_list on",
        bclass: "letf_list",
        status:false
      })
    }
    this.getOrders()
  },
  switchTapb() {
    if (this.data.bclass == "left_list on") {
      this.setData({
        aclass: "letf_list on",
        bclass: "letf_list",
        status:false
      })
    } else {
      this.setData({
        aclass: "letf_list",
        bclass: "letf_list on",
        status:true
      })
    }
    this.getOrders()
  },
  // 获取订单
  getOrders(status){
    const self = this
    order.where({
      status:_.eq(self.data.status)
    }).orderBy('time','desc').get({
      success:res=>{
        console.log(res)
        self.setData({
          orders:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders(this.data.status)
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