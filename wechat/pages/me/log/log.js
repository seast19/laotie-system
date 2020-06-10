// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logList: [
      {
        version: "v1.3.0",
        date: "2020/01/19",
        logs: [
          "1. 添加题目搜索",   
          '2. 增加删除考试记录功能。长按考试录可删除'              
        ]
      },      
      {
        version: "v1.2.3",
        date: "2019/12/22",
        logs: [
          "1. 修复登录失败无限加载提示信息",                 
        ]
      },
      {
        version: "v1.2.2",
        date: "2019/12/07",
        logs: [
          "1. 添加用户反馈",
          "2. 修复日期显示错误问题",          
        ]
      },
      {
        version: "v1.2.1",
        date: "2019/12/01",
        logs: [
          "1. 优化页面结构",
          "2. 优化操作逻辑。",
          "3. 真题实战支持恢复上次答题。",
        ]
      },
      {
        version: "v1.1.2",
        date: "2019/11/12",
        logs: [          
          "1. 添加更新日志",
          "2. 优化提示信息",
        ]
      }      
    ],


    
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