// 获取云数据库实例
const db = wx.cloud.database()
const tabs = db.collection('tabs')
const emall = db.collection('emall')

Page({
  data: {
    category: [],
    detail: [],
    curIndex: 0,
    isScroll: false,
    isResult:false
  },
  toDetail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  getTabs(){
    tabs.get({
      success: res => {
        this.setData({
          category: res.data
        })
        // 由于发送查询请求是异步的，所以不能将getTabsMall()在onload中执行
        this.getTabsMall(true)
      }
    })
  },
  getTabsMall(isInit, index){
    const self = this
    this.page = 0
    let keyword = ''
    if(isInit){
      keyword = this.data.category[0].name
    } else{
      keyword = this.data.category[index].name
    }
    const PAGE = 8
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    db.collection('emall').where({
      //使用正则查询，实现对搜索的模糊查询
      tab: db.RegExp({
        regexp: keyword,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).skip(this.page * PAGE).limit(PAGE).get({
      success: res => {
        if (isInit) {
          console.log(res.data.length)
          this.setData({
            detail: res.data
          })
          if (res.data.length > 0) {
            self.setData({
              isResult: true
            })
          } else {
            self.setData({
              isResult: false
            })
          }
        } else {
          self.setData({
            detail: res.data
          })
          if (res.data.length > 0) {
            self.setData({
              isResult: true
            })
          } else {
            self.setData({
              isResult: false
            })
          }
          // 停止页面的下拉刷新
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      },
      fail: res => {
        this.setData({
          isResult: true
        })
      }
    })
  },
  switchTab(e) {
    const self = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function () {
      self.setData({
        curIndex: e.target.dataset.index
      })
      self.getTabsMall(false, e.target.dataset.index)
    }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)

  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getTabs(true)
  }
})