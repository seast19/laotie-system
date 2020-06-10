// pages/rank/rank.js

var util = require("../../common/util.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [], //分类列表
    gradeList: [], //等级列表
    rankList: [], //排行榜列表

    selectIndexCategory: 0, //选择分类index
    selectIndexGrade: 0 ,//选择等级index

    isLoaded:false
  },

  // 处理分类tab切换
  handleChangeCategory(e) {
    this.setData({
      selectIndexCategory: e.detail.value
    });
    this.produceGrade()
    this.getRankList()
  },

  // 处理等级tab切换
  handleChangeGrade(e) {
    this.setData({
      selectIndexGrade: e.detail.value
    });

    this.getRankList()
  },

  // 获取排行榜数据
  getRankList() {
    let cid = this.data.categoryList[this.data.selectIndexCategory].id
    let grade = this.data.gradeList[this.data.selectIndexGrade]

    // http请求
    util.request({
      url: '/api/open/rank',
      data: {
        cid: cid,
        grade: grade
      },
      funcSucc: res => {
        this.setData({
          rankList: res.data || [],
          isLoaded:true
        })
      }
    })
  },

  // 设置当前排行榜为用户选择分类
  setCurrentCat() {
    let catNum = 0

    // 分类
    for (let i = 0; i < this.data.categoryList.length; i++) {
      if (wx.getStorageSync("userSelectCategoryId") == this.data.categoryList[i].id) {
        catNum = i
        break
      }
    }

    // 设置
    this.setData({
      selectIndexCategory: catNum
    })
  },

  //设置当前配航班用户选择等级
  setCurrentGrade(){
    // 设置用户已选择等级
    let gradeNum = 0
    for (let i = 0; i < this.data.gradeList.length; i++) {
      if (wx.getStorageSync("userSelectGrade") == this.data.gradeList[i]) {
        gradeNum = i
        break
      }
    }

    this.setData({
      selectIndexGrade: gradeNum

    })
  },

  // 构建gradeList
  produceGrade() {
    let index = this.data.selectIndexCategory
    let cat = this.data.categoryList[index]
    let gradeList = []

    let g1 = cat.g1_count || 0
    let g2 = cat.g2_count || 0
    let g3 = cat.g3_count || 0
    let g4 = cat.g4_count || 0
    let g5 = cat.g5_count || 0
    let g6 = cat.g6_count || 0

    if (g1 > 0) {
      gradeList.push('初级工')
    }
    if (g2 > 0) {
      gradeList.push('中级工')
    }
    if (g3 > 0) {
      gradeList.push('高级工')
    }
    if (g4 > 0) {
      gradeList.push('技师')
    }
    if (g5 > 0) {
      gradeList.push('高级技师')
    }
    if (g6 > 0) {
      gradeList.push('其他')
    }

    this.setData({
      gradeList: gradeList
    })

    this.setCurrentGrade()
    
  },


  // 获取分类参数
  getCategorys() {
    let _this = this
    // http请求
    util.requestBg({
      url: "/api/open/categorys",
      funcSucc: function(res) {
        _this.setData({
          categoryList: res.data || [],
        })
        _this.setCurrentCat() //设置当前分类序号
        _this.produceGrade() //设置等级序号

        _this.getRankList() //获取排行列表
      },
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
      url: '/pages/rank/rank',
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