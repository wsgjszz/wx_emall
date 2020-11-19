// 获取云数据库实例
const db = wx.cloud.database()
const emall = db.collection('emall')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    i_name: ''
  },
  // 事件函数
  getInput_name(e) {
    this.data.i_name = e.detail.value
  },
  submit() {
    let v_name = this.data.i_name
    emall.where({
      title: _.eq(v_name)
    }).remove({
      success: res => {
        console.log(res)
        // 新增成功
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        // 刷新页面数据
        this.dataRefresh()
      },
      fail: res => {
        console.log(res)
        // 新增失败
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    })
  },
  // 刷新页面数据
  dataRefresh() {
    this.setData({
      i_name: ''
    })
  }
})