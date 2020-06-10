// pages/practise-sx/practise-sx.js

var util = require("../../../common/util.js")
import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSelectCategoryId: '', //用户选择的cid
    userSelectGrade: '', //等级
    userSelectType: '', //用户选择练习方式

    quesList: [], //题目列表

    currentTab: '', //当前tab  
    nowNum: 0, //当前题数
    currentQues: {}, //当前题目
    currentAns: '', //当前选择答案

    isNext: false, //正在跳转下一题 
  },

  // 选择答案
  handleSelectAns(e) {
    // 如果已经选择答案了，则不操作
    if (this.data.currentAns != '') {
      return
    }

    let ans = e.currentTarget.dataset.ans
    let _this = this

    // 设置当前答案
    this.setData({
      currentAns: ans
    })

    // 答案正确则显示勾勾，延时跳转下一题
    if (ans === this.data.currentQues.ans) {
      this.setData({
        isNext: true
      })

      setTimeout(function () {
        _this.jumpQues(1)
      }, 800)
    } else {
      //答案错误则显示叉叉，显示答案并停留
      this.setData({
        currentTab: 2,
      })

      // 加入错题
      this.addErrorQuestions()
    }
  },



  // 处理答题卡子组件传递的index
  handleItemMenuChange(e) {
    let num = e.detail.num

    this.setData({
      currentQues: this.data.quesList[num - 1],
      nowNum: num,
      currentAns: '',
      currentTab: '',
    })
  },

  // 切换tabbar事件
  handleClickTabbar(e) {
    if (parseInt(e.target.dataset.key) === this.data.currentTab) {
      this.setData({
        currentTab: '',
      })
    } else {
      this.setData({
        currentTab: parseInt(e.target.dataset.key)
      });
    }
  },



  //通用跳转题目
  jumpQues(num) {
    let nowNum = this.data.nowNum
    let maxNum = this.data.quesList.length

    this.setData({
      currentQues: this.data.quesList[nowNum - 1 + num],
      nowNum: nowNum + num,
      currentAns: '',
      currentTab: '',
      isNext: false,
    })
  },

  //点击上/下一题
  handleBtnNext(e) {
    if (this.data.isNext) {
      wx.showToast({
        title: '点得太快了',
        icon: 'none',
      })
      return
    }

    let num = parseInt(e.currentTarget.dataset.num)
    let nowNum = this.data.nowNum
    let maxNum = this.data.quesList.length

    if (nowNum + num <= 0 || nowNum + num > maxNum) {
      Notify({
        type: 'warning',
        message: '已经到头了'
      });
      return
    }
    this.jumpQues(num)
  },

  // 加入错题
  addErrorQuestions() {
    let errorQuestions = wx.getStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`) || '[]'
    let tempList = JSON.parse(errorQuestions)

    // 判断当前错题是否在错题库，在的话则不加入
    for (let item of tempList) {
      if (item.id == this.data.currentQues.id) {
        return
      }
    }
    tempList.push(this.data.currentQues)
    wx.setStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`, JSON.stringify(tempList))
  },



  // 参数初始化后加载题库
  loadQuestions() {
    // 顺序、随机练习则从服务器获取
    let _this = this
    util.request({
      url: "/api/open/questions",
      data: {
        'cid': _this.data.userSelectCategoryId,
        'grade': _this.data.userSelectGrade,
        'type': _this.data.userSelectType,
      },
      funcSucc: function (res) {
        _this.setData({
          quesList: res.data || [],
          currentQues: res.data[0],
          nowNum: 1,
        })
      },
    })
  },


  // 初始化页面参数
  initParams(opt) {
    // 获取保存的cid，grade参数
    let userSelectCategoryId = wx.getStorageSync('userSelectCategoryId')
    let userSelectGrade = wx.getStorageSync('userSelectGrade')
    let userSelectType = opt.type

    // 无效参数则跳转上一页
    if (!userSelectGrade || !userSelectCategoryId) {
      wx.showToast({
        title: '请先选择题库分类 #1！',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
      return
    }

    if (userSelectType != "sx" && userSelectType != 'sj') {
      wx.showToast({
        title: '请先选择题库分类 #2',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
      return
    }

    // 参数正确则加载题目
    this.setData({
      userSelectCategoryId: userSelectCategoryId,
      userSelectGrade: userSelectGrade,
      userSelectType: userSelectType
    })
    this.loadQuestions()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initParams(options)
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