// pages/mypaper/mypaper.js
var util = require("../../../common/util.js")
import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperList: [], //试卷集合
    currentPage: 1, //当前显示的页数

    isLoaded: false, //加完完成
    isNoPaper: false, //没有更多信息
    isShowLoading: false, //显示底部加载框

    // 弹出菜单
    currentPaperId: -1, //当前选择的试卷id
    show: false, //是否显弹出菜单
    actions: [{ //弹出菜单选项
      name: '删除试卷',
      color: '#CC3333'
    }, ]
  },

  // 获取试卷列表
  getPapers(page) {
    // 检查登录
    if (!util.checkLogin()) {
      util.checkLoginAndBack()
      return
    }

    let _this = this
    //获取试卷列表
    util.request({
      url: "/api/secret/userpapers",
      data: {
        page: page
      },
      funcSucc: (res) => {
        this.setData({
          paperList: _this.data.paperList.concat(res.data || []),
          isLoaded: true
        })

        if (res.data==false) {
          this.setData({
            isNoPaper: true
          })
        }
      },
      funcErr: (res) => {
        wx.showToast({
          title: '请求参数错误',
          icon: 'none'
        })
        util.jumpPrePage()
      },
      funcFail: (res) => {
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
        util.jumpPrePage()

      }
    })
  },

  // 选择试卷
  seletePaper: function(e) {
    console.log(e.currentTarget.dataset.paperid)
    this.setData({
      show: true,
      currentPaperId: parseInt(e.currentTarget.dataset.paperid)
    })
  },

  // 关闭弹出菜单
  onCloseMenu: function() {
    this.setData({
      show: false,
      // currentPaperId: -1
    })
  },

  // 选择删除
  onDeleteMenu: function() {
    let _this = this
    
    util.request({
      url: "/api/secret/userpapers",
      method: 'POST',      
      data: {
        pid: _this.data.currentPaperId
      },
      funcSucc: (res) => {
        // 更改试卷记录列表
        let tempList = []
        for (let item of _this.data.paperList) {
          if (item.id != _this.data.currentPaperId) {
            tempList.push(item)
          }
        }
        _this.setData({
          paperList: tempList
        })

        Notify({ type: 'success', message: '删除成功' });
      },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPapers(this.data.currentPage)


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
    //是否已经加载到最后一页
    if (this.data.isNoPaper) {
      return
    }

    this.setData({
      isShowLoading: true
    })
    let _this = this
    //获取试卷列表
    util.requestBg({
      url: "/api/secret/userpapers",
      data: {
        page: _this.data.currentPage + 1
      },
      funcSucc: (res) => {
        if (res.data==false) {
          _this.setData({
            isNoPaper: true,
            isShowLoading: false
          })
        } else {
          _this.setData({
            paperList: _this.data.paperList.concat(res.data),
            currentPage: _this.data.currentPage + 1,
            isShowLoading: false
          })
        }
      },
      funcErr: (res) => {
        _this.setData({
          isShowLoading: false
        })
        wx.showToast({
          title: '请求参数错误',
          icon: 'none'
        })
        util.jumpPrePage()
      },
      funcFail: (res) => {
        _this.setData({
          isShowLoading: false
        })
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
        util.jumpPrePage()

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})