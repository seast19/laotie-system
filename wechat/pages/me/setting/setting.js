// pages/mysetting/mysetting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSize:'',//当前缓存占用内存
  },



  //删除缓存
  handleDelStroage() {
    let _this=this
    wx.showModal({
      title: '提示',
      content: '是否删除所有缓存',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync()
          _this.getStroageSize()
          wx.showToast({
            title: '删除缓存成功',
            icon: 'none'
          })
        }
      }
    })
  },

  // 转换kb，mb
  convertSize(size){
    console.log(size)
    if(size<1024){
      return size+"KB"
    }
    return Math.floor(size/1024)+'MB'
  },

  // 获取去当前占用缓存大小
  getStroageSize(){
    let _this = this
    wx.getStorageInfo({
      success (res) {
        _this.setData({
          currentSize:_this.convertSize(res.currentSize)
        })
      }
    })
  },

  //处理点击更新
  handleUpdate(){
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if(!res.hasUpdate){
        wx.showToast({
          title: '当前为最新版本',
          icon:'none'
        })
      }
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      wx.showToast({
        title: '新版本下载失败',
        icon:'none'
      })
      // console.log("新版本下载失败")
      // 新版本下载失败
    })
  },







  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getStroageSize()
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