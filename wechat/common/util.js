var config = require("./config.js")

module.exports = {
  // 等级转化为数字
  gradeToNum: function (value) {
    var text = 0
    if (value == '初级工') {
      text = 1
    } else if (value == '中级工') {
      text = 2
    } else if (value == '高级工') {
      text = 3
    } else if (value == '技师') {
      text = 4
    } else if (value == '高级技师') {
      text = 5
    } else {
      text = 6
    }
    return text
  },

  // 封装http请求，
  //第二个参数为true则加入jwt，
  //自带loading
  /*
  params=
  {
    url:"",
    method:"",
    data:"",
    header:  {
        'content-type': 'application/x-www-form-urlencoded'
      },
    funcSucc:function(res){},
    funcErr:function(res){},
    funFail:function(res){},
  }
  */
  request: function (params) {
    // 显示loading
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let _this=this

    wx.request({
      url: config.apiUrl + params.url,
      data: {
        jwt: wx.getStorageSync("jwt"),
        ...(params.data || {})
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: params.method || 'GET',
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode === 200 && res.data.status === 'ok') {
          params.funcSucc && params.funcSucc(res.data)
        } else {
          //有错误回调则执行该回调函数，无则提示错误信息
          if (params.funcErr) {
            params.funcErr(res.data)
          } else {
            wx.showToast({
              title: '请求参数错误',
              icon: 'none',
            })
          }
        }
      },
      fail: function (res) {
        wx.hideLoading()
        _this.showNetConnectFail()
        params.funcFail && params.funcFail(res)
      },
    })
  },

  // 封装http请求，加入success判断，无提示信息
  requestBg: function (params) {
    wx.request({
      url: config.apiUrl + params.url,
      data: {
        jwt: wx.getStorageSync("jwt"),
        ...(params.data || {})
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: params.method || 'GET',
      success: function (res) {
        if (res.statusCode === 200 && res.data.status === 'ok') {
          params.funcSucc && params.funcSucc(res.data)
        } else {
          params.funcErr && params.funcErr(res.data)
        }
      },
      fail: function (res) {
        params.funcFail && params.funcFail(res)
      },
    })
  },

  //提示并返回上一页
  jumpPrePage: function () {
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)
    return
  },

  //过滤 emoji 表情
  filteEmoji: function (text) {
    console.log(text)
    text = text.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "?");
    console.log(text)
    return text
  },

  // 检查登录状态，未登录的返回上一页
  checkLoginAndBack: function () {
    let loginStatus = wx.getStorageSync('loginStatus')
    let jwtToken = wx.getStorageSync('jwt')

    // 未登录则退出页面
    if (!loginStatus || !jwtToken) {
      wx.showToast({
        title: '用户未登录',
        icon: 'none',
        mask: true,
        duration: 2000
      })

      this.jumpPrePage()
      return
    }
  },

  // 检查登录状态
  checkLogin: function () {
    let loginStatus = wx.getStorageSync('loginStatus')
    let jwtToken = wx.getStorageSync('jwt')

    // 未登录则退出页面
    if (!loginStatus || !jwtToken) {
      return false
    } else {
      return true
    }
  },

  //显示网络连接失败
  showNetConnectFail: function () {
    wx.showToast({
      title: '网络连接失败',
      icon: 'none'
    })
  }
}