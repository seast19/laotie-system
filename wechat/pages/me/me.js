// pages/me/me.js

var util = require("../../common/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus: false, //登录状态
    userImg: '', //用户头像
    userNickName: '', //用户昵称    
  },


  // 获取code参数
  wxGetCode(cloudid) {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            resolve(res.code)
          }
        },
        fail(reson) {
          reject('#1')
        }
      })
    })
  },

  // 服务器登录
  serverLogin(code) {
    return new Promise((resolve, reject) => {
      util.requestBg({
        url: "/api/open/login",
        data: {
          code: code,
          userimg: this.userimg,
          usernickname: this.usernickname,
        },
        funcSucc: function(res) {
          resolve(res)
        },
        funcErr: function(res) {
          reject('#2')
        },
        funcFail: function(res) {
          reject("#3")
        },
      })
    })
  },

  // 设置登录成功数据
  setLoginParams(res) {
    this.setData({
      userImg: this.userimg,
      userNickName: this.usernickname,
      loginStatus: true
    })

    wx.setStorageSync('loginStatus', true) //设置登录状态
    wx.setStorageSync('jwt', res.jwt) //服务器自定义jwt                

    wx.showToast({
      title: '登录成功',
      icon: 'success'
    })
  },

  // 点击登录
  handleClickLogin(e) {
    //检验授权情况
    if (e.detail.cloudID) {
      wx.showLoading({
        title: '登录中..',
        mask: true,
      })
      this.usernickname = e.detail.userInfo.nickName
      this.userimg = e.detail.userInfo.avatarUrl

      this.wxGetCode(e.detail.cloudID)
        .then(this.serverLogin)
        .then(this.setLoginParams)
        .catch((e) => {
          wx.showToast({
            title: '登录失败：' + e,
            icon: 'none'
          })
        })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      })
    }
  },


  //  设置用户信息
  setUserInfo() {
    wx.getUserInfo({
      success: e => {
        this.setData({
          userImg: e.userInfo.avatarUrl,
          userNickName: e.userInfo.nickName,
          loginStatus: true
        })
      }
    })
  },

  //  清除用户信息
  clearUserInfo() {
    this.setData({
      userImg: 'https://seast.nos-eastchina1.126.net/img/wx_laotie/user_img1.png',
      userNickName: '未登录',
      loginStatus: false
    })

  },

  // 初始化参数
  initParams() {
    const loginStatus = wx.getStorageSync('loginStatus') || false
    if (!loginStatus) {
      this.clearUserInfo()
      return false
    }
    this.setUserInfo()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


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
    this.initParams()

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