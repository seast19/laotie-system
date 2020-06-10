// pages/index/index.js

var util = require("../../common/util.js")
import Notify from '@vant/weapp/notify/notify';

Page({
  // 页面的初始数据   
  data: {
    categoryList: [], //分类信息列表
    info: "欢迎使用老铁题库", //通告栏信息

   
  },


  // 获取分类信息
  getCategorys() {
    let _this = this
    // 发送请求获取数据
    util.request({
      url: "/api/open/categorys",
      funcSucc: function(res) {
        if (res.status === "ok") {
          _this.setData({
            categoryList: res.data||[]
          })
        }
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCategorys()
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
    wx.reLaunch({
      url: '/pages/index/index',
    })
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