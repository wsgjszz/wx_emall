// 获取云数据库实例
const db = wx.cloud.database()
const emall = db.collection('emall')
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mall: {
      title: '',
      detail: '',
      parameter: '',
      price: '',
      tab: ''
    },
    filePath: [],
    cloudPath: [],
    fileID: [],
    v_detail: true,
    v_parameter: true,
    setInter: '' //存储计时器
  },
  //事件函数
  putValue_detail() {
    this.data.mall.detail = '无'
  },
  putValue_parameter() {
    this.data.mall.parameter = '无'
  },
  getInput_title(e) {
    this.data.mall.title = e.detail.value;
  },
  getInput_price(e) {
    this.data.mall.price = e.detail.value;
  },
  getInput_tab(e) {
    this.data.mall.tab = e.detail.value;
  },
  getInput_detail(e) {
    this.data.mall.desc = e.detail.value;
    this.data.v_detail = false;
  },
  getInput_parameter(e) {
    this.data.mall.parameter = e.detail.value;
    this.data.v_parameter = false;
  },
  getImage() {
    let that = this;
    wx.chooseImage({
      count: 9,
      success: res => {
        let cloudPaths = []
        let filePaths = []
        console.log(res)
        for (let i in res.tempFilePaths) {
          let filepath = res.tempFilePaths[i]
          let fileTemp = ''
          if (filepath.split('//').length > 1) {
            // 微信上传文件
            fileTemp = filepath.split('//')[1].split('.')
          } else {
            fileTemp = filepath.split('.')
          }
          let cloudpath = "img-" + fileTemp[fileTemp.length - 2]
          filePaths.push(filepath)
          cloudPaths.push(cloudpath)
        }
        that.setData({
          cloudPath: cloudPaths,
          filePath: filePaths
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  submit() {
    const self = this
    if (this.data.v_detail) {
      this.putValue_detail()
    }
    if (this.data.v_parameter) {
      this.putValue_parameter()
    }
    let cloudPath = this.data.cloudPath
    let filePath = this.data.filePath
    let fileIDs = []
    if(cloudPath.length==0){
      emall.where({
        title: _.eq(self.data.mall.title)
      }).update({
        data: {
          price: self.data.mall.price,
          tab: self.data.mall.tab,
          detail: self.data.mall.detail,
          parameter: self.data.mall.parameter
        },
        success: res => {
          // 新增成功
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          // 刷新页面数据
          self.dataRefresh()
        },
        fail: res => {
          console.log('修改失败')
        }
      })
    }
    for (let i in cloudPath) {
      let cloud = cloudPath[i] + ""
      let file = filePath[i] + ""
      wx.cloud.uploadFile({
        cloudPath: cloud,
        filePath: file
        , success: res => {
          fileIDs.push(res.fileID)
          // console.log(res)
          if (i == cloudPath.length - 1) {
            // console.log(fileIDs)
            self.data.setInter = setInterval(
              function () {
                console.log(fileIDs.length)
                if (fileIDs.length - 1 == i) {
                  clearInterval(self.data.setInter)
                  emall.where({
                    title: _.eq(self.data.mall.title)
                  }).update({
                    data: {
                      price: self.data.mall.price,
                      tab: self.data.mall.tab,
                      detail: self.data.mall.detail,
                      parameter: self.data.mall.parameter,
                      image: fileIDs
                    },
                    success: res => {
                      // 新增成功
                      wx.showToast({
                        title: '修改成功',
                        icon: 'success'
                      })
                      // 刷新页面数据
                      self.dataRefresh()
                    },
                    fail: res => {
                      console.log('修改失败')
                    }
                  })
                }
              }
              , 200)

          }
        },
        fail: res => {
          console.log(res)
          // 新增失败
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
          console.log("上传失败")
        }
      })
    } 
  },
  // 刷新页面数据
  dataRefresh() {
    this.setData({
      mall: {
        title: '',
        detail: '',
        parameter: '',
        price: '',
        tab: ''
      },
      filePath: '',
      cloudPath: '',
      fileID: '',
      v_detail: true,
      v_parameter: true
    })
  }
})
