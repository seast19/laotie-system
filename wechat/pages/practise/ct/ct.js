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

    quesList: [], //题目列表

    currentTab: '', //当前tab
    nowNum: 0, //当前题数
    currentQues: {}, //当前题目
    currentAns: '', //当前选择答案

    isNext: false, //正在跳转下一题
    isLoaded: false, //是否加载完成
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
      this.delErrorQuestions() //删除该错题
      // 还有错题则跳转下一题
      if (this.data.quesList.length > 0) {
        setTimeout(function () {
          _this.jumpQues(0)
        }, 800)
      }
    } else {
      //答案错误则显示叉叉，显示答案并停留
      this.setData({
        currentTab: 2,
      })
    }
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

    // 如果当前题号大于最大题，则当前题号改为最大题号
    if (nowNum > maxNum) {
      nowNum = maxNum
    }

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

    if (nowNum + num <= 0) {
      this.setData({
        nowNum: maxNum
      })
      this.jumpQues(0)
    } else if (nowNum + num > maxNum) {
      this.setData({
        nowNum: 1
      })
      this.jumpQues(0)
    } else {

      this.jumpQues(num)
    }
  },


  //删除错题
  delErrorQuestions() {
    //从storage获取错题
    let errorQuestions = wx.getStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`) || '[]'
    let tempList = JSON.parse(errorQuestions)

    // 找到做对题目，删除他
    let finalList = []
    for (let item of tempList) {
      if (item.id != this.data.currentQues.id) {
        finalList.push(item)
      }
    }

    // 更新最大题数，删除后的题目list
    this.setData({
      quesList: finalList,
    })
    wx.setStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`, JSON.stringify(finalList))

    // 如果删除后题目数为0，则提示用户
    if (finalList.length <= 0) {
      Notify({
        type: 'success',
        message: '错题已完成'
      });
      util.jumpPrePage()
    }
  },

  // 参数初始化后加载题库
  loadQuestions() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    let _this = this
    // 如果为错题则从本地缓存中取出数据
    let errorQuestions = wx.getStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`) || '[]'
    // 如果没有错题，则提示后返回上一页
    if (errorQuestions == '[]') {
      wx.hideLoading()
      wx.showToast({
        title: '当前无错题',
        mask: true,
        icon: 'none',
        duration: 2000
      })
      util.jumpPrePage()
      return
    }

    // 有错题则取出错题,保存题目列表
    this.setData({
      quesList: JSON.parse(errorQuestions),
      isLoaded: true
    })
    //保存第一题
    this.setData({
      currentQues: this.data.quesList[0],
      nowNum: 1,
    })
    wx.hideLoading()
  },


  // 初始化页面参数
  initParams() {
    // 获取保存的cid，grade参数
    let userSelectCategoryId = wx.getStorageSync('userSelectCategoryId')
    let userSelectGrade = wx.getStorageSync('userSelectGrade')

    // 无效参数则跳转上一页
    if (!userSelectGrade || !userSelectCategoryId) {
      wx.showToast({
        title: '请先选择题库分类 #1',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      util.jumpPrePage()
      return
    }

    // 参数正确则加载题目
    this.setData({
      userSelectCategoryId: userSelectCategoryId,
      userSelectGrade: userSelectGrade,
    })
    this.loadQuestions()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initParams()
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