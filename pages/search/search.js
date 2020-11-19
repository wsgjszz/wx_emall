// 获取云数据库实例
const db = wx.cloud.database()

let timeId = null;
Page({
  data: {
    page: 0,
    list: [],
    result: [],
    value: '',
    showKeywords:false,
    isShow:false,
    isResult:true
  },
  searchInput(e) {
    let i_value = e.detail.value
    if (!e.detail.value) {
      // 输入为空
      this.setData({
        showKeywords: false
      })
    } else {
      if (!this.data.showKeywords) {
        timeId && clearTimeout(timeId);
        timeId = setTimeout(() => {
          this.setData({
            showKeywords: true,
            value: i_value
          })
          this.search(true)
          this.setData({
            showKeywords: false
          })
        }, 1500)
      }
    }
  },
  search(isInit){
    this.page = 0
    let keyword = this.data.value
    const PAGE = 8
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    db.collection('emall').where({
      //使用正则查询，实现对搜索的模糊查询
      title: db.RegExp({
        regexp: keyword,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).skip(this.page * PAGE).limit(PAGE).get({
      success: res => {
        console.log(res)
        if (isInit) {
          this.setData({
            result: res.data,
            isShow:true
          })
          if(!res.data.length>0){
            this.setData({
              isResult:false
            })
          }
        } else {
          // 下拉刷新，不能直接覆盖而是累加
          this.setData({
            result: this.data.result.concat(res.data)
          })
          // 停止页面的下拉刷新
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      },
      fail:res=>{
        this.setData({
          isResult:true
        })
      }
    })
  },
  toDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  // 生命周期函数
  onLoad() {
    this.page = 0
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log("监听用户下拉动作")
    this.page = 0
    this.search(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面上拉触底事件的处理函数")
    this.page += 1
    this.search()
  }
})