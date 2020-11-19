// 获取云数据库实例
const db = wx.cloud.database()
const order = db.collection('order')
const _ = db.command
// 获取app实例
const app = getApp()

Page({

      /**
       * 页面的初始数据
       */
      data: {
        order: [],
        orders: [],
        oid: '',
        isAdmin: false
      },
      // 取消订单
      cancel() {
        const self = this
        wx.showModal({
          title: '取消订单',
          content: '该操作无法撤回',
          text: 'center',
          success(res) {
            if (res.confirm) {
              console.log('确认取消订单')
              order.doc(self.data.oid).remove({
                success: res => {
                  // 成功
                  wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    success: res => {
                      wx.switchTab({
                        url: '/pages/user/user',
                      })
                    }
                  })
                },
                fail: res => {
                  // 失败
                  wx.showToast({
                    title: '取消失败，请稍后重试',
                    icon: 'success',
                    success: res => {
                      success: res => {
                        wx.switchTab({
                          url: '/pages/user/user',
                        })
                      }
                    }
                  })
                }
              })
            } else if (res.cancel) {
              console.log('取消操作')
            }
          }
        })
      },
      // 改变处理状态
      active() {
        const self = this
        wx.showModal({
            title: '确认处理',
            content: '确认改变处理状态',
            text: 'center',
            success(res) {
              if (res.confirm) {
                console.log('确认处理')
                order.doc(self.data.oid).update({
                  data:{
                    status:true
                  },
                  success: res => {
                    // 成功
                    wx.showToast({
                      title: '处理成功',
                      icon: 'success',
                      success: res => {
                        wx.redirectTo({
                          url: '/pages/dep/orders/orders',
                        })
                      }
                    })
                  },
                  fail: res => {
                    // 失败
                    wx.showToast({
                      title: '处理失败，请稍后重试',
                      icon: 'success',
                      success: res => {
                        success: res => {
                          wx.redirectTo({
                            url: '/pages/dep/orders/orders',
                          })
                        }
                      }
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('取消操作')
              }
            }
          })
      },
          /**
           * 生命周期函数--监听页面加载
           */
          onLoad: function(options) {
            if (options.isAdmin == 'true') {
              this.setData({
                isAdmin: true
              })
            }
            console.log(this.data.isAdmin)
            const self = this
            this.setData({
              oid: options.id
            })
            const oid = options.id
            order.doc(oid).get({
              success: res => {
                self.setData({
                  order: res.data,
                  orders: res.data.emalls
                })
                console.log(self.data.order)
              }
            })
          },

          /**
           * 生命周期函数--监听页面初次渲染完成
           */
          onReady: function() {

          },

          /**
           * 生命周期函数--监听页面显示
           */
          onShow: function() {

          },

          /**
           * 生命周期函数--监听页面隐藏
           */
          onHide: function() {

          },

          /**
           * 生命周期函数--监听页面卸载
           */
          onUnload: function() {

          },

          /**
           * 页面相关事件处理函数--监听用户下拉动作
           */
          onPullDownRefresh: function() {

          },

          /**
           * 页面上拉触底事件的处理函数
           */
          onReachBottom: function() {

          },

          /**
           * 用户点击右上角分享
           */
          onShareAppMessage: function() {

          }
        })