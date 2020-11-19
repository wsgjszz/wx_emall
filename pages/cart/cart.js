// 获取云数据库实例
const db = wx.cloud.database()
const emall = db.collection('emall')
// 获取app实例
const app = getApp()
Page({
  data: {
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认全选
    addId: '',
    addNum: 0,
    SelectIndex:[]
  },
  onShow() {
    this.setData({
      selectAllStatus:false,
      totalPrice:0
    })
    this.getEmall()
  },
  /**
   * 获取商品详情
   */
  getEmall() {
    const self = this
    app.globalData.carts = wx.getStorageSync('Carts')
    let Carts = app.globalData.carts
    let flag = false
    if (Carts.length > 0) {
      flag = true
    }
    // 增加num字段，重新构造emall
    let new_carts = []
    for (let i in Carts) {
      let carts_Num = Carts[i].num
      let new_cart = {}
      emall.doc(Carts[i].id).get({
        success: res => {
          for (let key in res.data) {
            new_cart[key] = res.data[key]
          }
          new_cart['num'] = carts_Num
          new_carts.push(new_cart)
          self.setData({
            hasList: flag,
            carts: new_carts
          })
        }
      })
    }
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    let s_Index = this.data.SelectIndex
    s_Index.push(e.currentTarget.dataset.index)
    this.setData({
      SelectIndex: s_Index
    })
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
    this.updateCarts(carts)
  },
  // 修改缓存中的购物车列表
  updateCarts(data) {
    let new_data = []
    for (let i in data) {
      let n_data = {}
      n_data['id'] = data[i]._id
      n_data['num'] = data[i].num
      new_data.push(n_data)
    }
    wx.setStorageSync('Carts', new_data)
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    this.updateCarts(carts)
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    this.updateCarts(carts)
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].num * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  /**
   * 记录订单
   */
  addOrders() {
    const self = this
    let Ordes = []
    let deleteIndex = []
    let Carts = this.data.carts
    for (let i in Carts){
      if (Carts[i].selected){
        deleteIndex.push(i)
        Ordes.push(Carts[i])
      }
    }
    if(deleteIndex.length==Carts.length){
      self.deleteAll()
    }else{
      for(let i in deleteIndex){
        Carts.splice(deleteIndex[i],1)
      }
    }
    self.setData({
      carts:Carts
    })
    app.globalData.orders = Ordes
    this.getTotalPrice()
    this.updateCarts(Carts)
  },
  /**
   * 删除全部商品
   */
  deleteAll(){
    let carts = this.data.carts
    carts.splice(0, this.data.carts.length);
    this.setData({
      carts: []
    });
    this.setData({
      hasList: false
    });
    this.getTotalPrice()
    this.updateCarts(carts)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    app.globalData.carts = wx.getStorageSync('Carts')
    this.setData({
      carts: app.globalData.carts
    })
  }

})