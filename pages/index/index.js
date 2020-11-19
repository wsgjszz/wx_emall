// 获取云数据库实例
const db = wx.cloud.database();
const emall = wx.cloud.database().collection("emall");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  // 页面跳转
  ToaddEmall(){
    wx.navigateTo({
      url: '../dep/add/add',
    })
  },
  TodeleteEmall() {
    wx.navigateTo({
      url: '../dep/delete/delete',
    })
  },
  ToupdateEmall() {
    wx.navigateTo({
      url: '../dep/update/update',
    })
  },
  ToaddTabs(){
    wx.navigateTo({
      url: '../dep/addTabs/addTabs',
    })
  },
  TodeleteTabs() {
    wx.navigateTo({
      url: '../dep/deleteTabs/deleteTabs',
    })
  },
  ToNotice() {
    wx.navigateTo({
      url: '../dep/notice/notice',
    })
  },
  ToOrders(){
    wx.navigateTo({
      url: '../dep/orders/orders',
    })
  },
  //事件函数
  addmall(){
    wx.chooseImage({
      count: 1,
      success:res=> {
        console.log(res)
        let filePath = res.tempFilePaths[0]
        let fileTemp = filePath.split('.')
        let cloudPath = "img-" + fileTemp[2]
        wx.cloud.uploadFile({
          cloudPath,
          filePath
        , success:res => {
            this.setData({
              imgSrc: res.fileID
            })
            emall.add({
              data:{
                name:'商品1',
                price:42.6,
                tab:'book',
                image:res.fileID,
                count:0
              },
              success:res=>{
                // 新增成功
                wx.showToast({
                  title: '新增成功',
                  icon: 'success'
                })
              }
            })
          },
          fail: res => {
            // 新增失败
            wx.showToast({
              title: '新增失败',
              icon: 'none'
            })
            console.log("上传失败")
          }
        }) 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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