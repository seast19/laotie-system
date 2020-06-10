// pages/practise/search/search.js
var util = require("../../../common/util.js")
// import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: "", //搜索关键字
    
    questionsList: [], //题目列表
    questionsCount: 0, //题目数量

    activeNames: -1, //当前激活的题目
    page: 1, //当前页码
    
    isFinish: false, //是否没有题目了
    isShowLoading: false, //显示loading
  },

  //监听输入改变
  onChange: function(e) {
    this.setData({
      searchKey: e.detail
    });
  },

  //展示结果下拉
  onshowContent(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  //搜索题目
  onSearch: function(e) {
    // 非空验证
    if (this.data.searchKey === "") {
      Toast('请输入关键字');
      return false
    }

    //搜索
    // 初始化上一次搜索参数
    this.setData({
      page: 1,
      isFinish: false,
      isShowLoading: false,
      activeNames:-1,
    })

    let _this = this
    util.request({
      url: "/api/open/searchquestions",
      data: {
        'keywords': _this.data.searchKey,
        'page': 1,
      },
      funcSucc: function(res) {
        _this.setData({
          questionsList: res.data || [],
          questionsCount: res.num
        })
      },
    })
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
    // 无新数据
    if (this.data.isFinish) {
      return
    }

    // 非空验证
    if (this.data.searchKey === "") {
      Toast('请输入关键字');
      return false
    }

    //搜索
    this.setData({
      isShowLoading: true //加载搜索图标
    })

    let _this = this
    util.requestBg({
      url: "/api/open/searchquestions",
      data: {
        'keywords': _this.data.searchKey,
        'page': _this.data.page + 1,
      },
      funcSucc: function(res) {
        if (res.data.length > 0) {
          _this.setData({
            questionsList: _this.data.questionsList.concat(res.data || []),
            questionsCount: res.num,
            page: _this.data.page + 1,
            isShowLoading: false
          })
        } else {
          _this.setData({
            isFinish: true,
            isShowLoading: false
          })
        }

      },
      funcErr: function(res) {
        _this.setData({
          isFinish: true,
          isShowLoading: false
        })
      },
      funcFail: function(res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        _this.setData({
          isShowLoading: false
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})