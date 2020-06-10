// pages/practise/practise.js

var util = require("../../common/util.js")
import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSelectCategoryId: '', //用户选择分类id
    category: '未选择分类',
    userSelectGrade: '未选择等级',

    countCt: '', //错题题数
  },

  // 获取本地存储的用户已选择的分类信息
  getCurrentInfo() {
    let cid = wx.getStorageSync('userSelectCategoryId') || ""
    let category = wx.getStorageSync('userSelectCategory') || ""
    let grade = wx.getStorageSync('userSelectGrade') || ""

    if (cid === '' || category === '' || grade === '') {
      Notify({ type: 'warning', message: '请在首页选择试卷' });
      category = "未选择分类"
      grade = "未选择等级"
    }
    this.setData({
      userSelectCategoryId: cid,
      category: category,
      userSelectGrade: grade
    })
  },

  // 获取错题数目
  getErrorCount() {
    let errorQuestions = wx.getStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`) || '[]'
    this.setData({
      countCt: JSON.parse(errorQuestions).length > 0 ? JSON.parse(errorQuestions).length : ''
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCurrentInfo()
    this.getErrorCount()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})