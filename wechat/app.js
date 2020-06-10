var util = require("./common/util.js")


App({
  // 检查wx会话是否过期
  wxCheckSession() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          resolve()
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          reject("微信未登录")
        }
      })
    })
  },

  // 获取设置
  wxGetSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            resolve()
          } else {
            reject("为获取权限")
          }
        },
        fail() {
          reject("设置失败")
        }
      })
    })
  },

  // 获取用户信息
  wxGetUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: function (res) {
          resolve()
        },
        fail() {
          reject("获取用户信息失败")
        }
      })
    })
  },

  // 检查服务器登录状态
  serverCheckLogin() {
    return new Promise((resolve, reject) => {
      util.requestBg({
        url: "/api/secret/check",
        funcSucc: function (res) {
          resolve()
        },
        funcErr: function (res) {
          reject("用户未登录")
        },
        funcFail: (res) => {
          reject("服务器连接失败")
        }
      })
    })
  },

  // 检查登录状态，登录有效且授权则为登录，否则未登录
  checkLogin() {
    // 初始化登录状态
    wx.setStorageSync('loginStatus', false)
    // jwt不存在则未登录
    let jwt = wx.getStorageSync('jwt')
    if (!jwt) {
      return false
    }

    // 链式调用
    this.wxCheckSession()
      .then(this.wxGetSetting)
      .then(this.wxGetUserInfo)
      .then(this.serverCheckLogin)
      .then(() => {
        wx.setStorageSync('loginStatus', true)
      })
      .catch((e) => {
        console.log(e)
      })
  },



  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.checkLogin()
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    // 向服务器发送错误日志
    util.requestBg({
      url: "/api/open/error",
      method:'POST',
      data:{
        msg
      },
      funcSucc: function (res) {
        console.log('上传错误日志成功')
      },      
    })
  }
})