// 获取云数据库实例
const db = wx.cloud.database()
const order = db.collection('order')
// 获取app实例
const app = getApp()
// 获取util
var util = require('../../utils/util.js')

Page({
  data: {
    address: {},
    hasAddress: false,
    total: 0,
    orders: []
  },

  onReady() {
    this.getTotalPrice();
  },

  onShow: function () {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
    this.setData({
      orders: app.globalData.orders
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    const self = this
    if (this.data.hasAddress){
      wx.showModal({
        title: '确认下单',
        content: '请前往支付',
        text: 'center',
        success(res) {
          if (res.confirm) {
            console.log('提交订单')
            order.add({
              data:{
                emalls: self.data.orders,
                total: self.data.total,
                status:false,
                time: util.formatTime(new Date()),
                user:self.data.address
              },
              success:res=>{
                // 成功
                wx.showToast({
                  title: '提交成功',
                  icon: 'success'
                })
                console.log('添加成功')
                app.globalData.totalPrice = self.data.total
                wx.navigateTo({
                  url: '/pages/about/about',
                })
              },
              fail:res=>{
                // 失败
                wx.showToast({
                  title: '提交失败，请稍后重试',
                  icon: 'success'
                })
              }
            })
          } else if (res.cancel) {
            console.log('取消操作')
          }   
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请先添加收货地址',
        text: 'center'
      })
    }
  }
})