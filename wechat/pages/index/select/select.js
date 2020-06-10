// pages/select/select.js

var util = require("../../../common/util.js")
import Notify from '@vant/weapp/notify/notify';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryId: '', //跳转到本页的cid
    categoryInfo: {}, //请求取得的分类信息详情
    currentGrade: '', //当前选择等级

    isLoaded: false, //是否加载结束
  },

  // 切换选项事件
  handleOptionChange(e) {
    this.setData({
      currentGrade: e.detail
    });
  },
  handOptionClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      currentGrade: name
    });
  },


  // 确认选择事件，切换至练习tab
  handleSelect() {
    // 非法操作提示
    if (this.data.currentGrade==='') {
      wx.showToast({
        title: '请选择等级',
        icon: 'none',
      })
      return
    }

    // 长期保存用户选择的分类，等级
    wx.setStorageSync("userSelectCategoryId", this.data.categoryId, )
    wx.setStorageSync("userSelectCategory", this.data.categoryInfo.category, )
    wx.setStorageSync("userSelectGrade", this.data.currentGrade, )

    Notify({
      type: 'success',
      message: '已选择 ' + this.data.currentGrade
    });

    setTimeout(function() {
      wx.switchTab({
        url: '/pages/practise/practise',
      })
    }, 500)
  },

  // 获取某个分类详细信息
  getCategoryInfo() {
    let _this = this

    util.request({
      url: "/api/open/category",
      data: {
        cid: _this.data.categoryId
      },
      funcSucc: function(res) {
        _this.setData({
          categoryInfo: res.data || {},
          isLoaded: true
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取跳转到本页面的cid
    this.setData({
      categoryId: options.c
    })
    // 获取该cid的详细信息
    this.getCategoryInfo()

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