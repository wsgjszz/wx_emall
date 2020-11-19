// 初始化云数据库
const db = wx.cloud.database();
const emall = db.collection('emall');
// 获取app实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    info:{},
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  // 事件函数
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  setCart(){
    let addId = this.data.id
    let addNum = this.data.totalNum
    let flag = true
    let carts = app.globalData.carts
    for (let i in carts) {
      if (carts[i].id === addId) {
        carts[i].num += addNum
        flag = false
      }
    }
    if (flag) {
      let cart = { id: addId, num: addNum }
      carts.push(cart)
    }
    wx.setStorageSync('Carts', carts)
  },
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },
  // 添加到购物车
  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout(function () {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
      }, 200)
    }, 300)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
    const ins = emall.doc(options.id)
    ins.update({
      data:{
        // count自增
        count:db.command.inc(1)
      }
    }),
    ins.get({
      success:res=>{
        this.setData({
          info:res.data
        })
        console.log(res)
      }
    })
  }
})