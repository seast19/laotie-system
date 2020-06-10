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
    paperId: 0, //试卷id

    quesList: [], //题目列表

    currentTab: '', //当前tab    
    currentNum: 0, //当前题数
    currentQues: {}, //当前题目
    currentAns: '', //当前选择答案

    ansList: [], //用户选择答案集合{id:xx,ans:xxx,num:xx}
    menuActiveList: [], //答题卡激活的选项[1,2,4]

    startTime: 0,
    lastTimeStr: '0:00',
  },

  // 选择答案
  handleSelectAns(e) {
    let ans = e.detail.value || e.currentTarget.dataset.ans //
    let num = this.data.currentNum
    let ansList = this.data.ansList

    // 无答案则不操作
    if (!ans) {
      return
    }

    // 设置当前答案
    this.setData({
      currentAns: ans
    })

    //将当前题答案加入答案列表
    let changeFlag = false
    // 检查答案列表是否有记录，有则修改记录
    for (let item of ansList) {
      if (num == item.num) {
        item.ans = ans
        changeFlag = true
        break
      }
    }
    // 无记录则添加记录
    if (!changeFlag) {
      ansList.push({
        "num": num,
        "id": this.data.currentQues.id,
        "ans": ans
      })
    }

    // 添加答题卡已选项
    let menuActiveList = this.data.menuActiveList
    if (menuActiveList.indexOf(num - 1) == -1) {
      menuActiveList.push(num - 1)
    }

    // 更新答案及答题卡
    this.setData({
      ansList: ansList,
      menuActiveList: menuActiveList
    })
  },



  // 处理答题卡子组件传递的index
  handleItemMenuChange(e) {
    let num = e.detail.num

    this.setData({
      currentQues: this.data.quesList[num - 1],
      currentNum: num,
      currentAns: '',
      currentTab: '',
    })

    // 填空等题显示原答案
    let tempAns = ''
    for (let item of this.data.ansList) {
      if (this.data.currentNum === item.num) {
        tempAns = item.ans
        break
      }
    }

    if (tempAns) {
      this.setData({
        currentAns: tempAns
      })
    }
  },



  // 切换tabbar事件
  handleClickTabbar(e) {
    if (parseInt(e.target.dataset.key) === this.data.currentTab) {
      this.setData({
        currentTab: '',
      })
      return false
    }
    this.setData({
      currentTab: parseInt(e.target.dataset.key)
    });

  },

  // 提交试卷
  handleSubmitPaper() {
    let _this = this

    // 询问是否交卷
    wx.showModal({
      title: '提示',
      content: '真的交卷吗？',
      success(res) {
        if (res.confirm) {
          // http请求
          util.request({
            url: "/api/secret/paper",
            method: 'POST',            
            data: {
              answers: JSON.stringify(_this.data.ansList),
              paper_id: _this.data.paperId,
            },
            funcSucc: function (res) {
              //停止计时
              clearInterval(_this.mytimer)

              // 有错题则添加错题
              if (res.err_list && res.err_list.length > 0) {
                _this.addErrorQuestions(res.err_list)
              }

              // 显示提示信息
              wx.showToast({
                title: `考试成绩：${res.score} 分`,
                icon: 'none',
                mask: true,
                duration: 2000
              })

              // 退出当前页
              util.jumpPrePage()
            },
            funcErr: (res) => {
              wx.showToast({
                title: '提交失败，请稍后再试',
                icon: 'none',
              })
            }
          })
        }
      }
    })
  },

  //通用跳转题目
  jumpQues(num) {
    let currentNum = this.data.currentNum

    // 设置到下一道题
    this.setData({
      currentQues: this.data.quesList[currentNum - 1 + num],
      currentNum: currentNum + num,
      currentAns: '',
      currentTab: '',
    })

    // 填空等题显示原答案
    let tempAns = ''
    for (let item of this.data.ansList) {
      if (this.data.currentNum === item.num) {
        tempAns = item.ans
        break
      }
    }
    if (tempAns) {
      this.setData({
        currentAns: tempAns
      })
    }

  },

  //点击上/下一题
  handleBtnNext(e) {
    let num = parseInt(e.currentTarget.dataset.num)
    let currentNum = this.data.currentNum
    let maxNum = this.data.quesList.length

    if (currentNum + num <= 0 || currentNum + num > maxNum) {
      Notify({
        type: 'warning',
        message: '已经到头了'
      });
      return
    }

    this.jumpQues(num)
  },

  // 初始化计时器 
  //  始时间与当前时间差，按mm:ss显示
  initTimer() {
    let _this = this
    let startTime = this.data.startTime
    let lastTime = ''
    let min = ''
    let sec = ''

    this.mytimer = setInterval(function () {
      lastTime = (new Date()).getTime() - startTime; //ms
      lastTime = Math.ceil(lastTime / 1000) //s

      min = Math.floor(lastTime / 60)
      sec = lastTime % 60

      // 不足10补0
      if (sec < 10) {
        sec = '0' + sec
      }

      // 时间超过考试时间
      if (lastTime > 7200) {
        min = "120"
        sec = "00"
      }

      _this.setData({
        lastTimeStr: `${min}:${sec}`
      })
    }, 1000)
  },

  // 初始化答题卡
  initCard() {
    // 添加待激活的答题卡题目
    let menuActiveList = this.data.menuActiveList
    for (let ans of this.data.ansList) {
      menuActiveList.push(ans.num - 1)
    }

    this.setData({
      menuActiveList: menuActiveList
    })
  },

  // 初始化第一题答案
  initCurrentAns() {
    for (const ans of this.data.ansList) {
      if (ans.num == 1) {
        this.setData({
          currentAns: ans.ans
        })
        break
      }
    }
  },

  // 初始化临时答案
  initTempAns(l) {
    let ql = this.data.quesList
    let al = []
    for (let item1 of l) {
      for (let i2 = 0; i2 < ql.length; i2++) {
        if (item1.id == ql[i2].id) {
          al.push({
            num:i2+1,
            id:item1.id,
            ans:item1.ans
          })
        }
      }
    }

    this.setData({
      ansList:al
    })
  },

  // 参数初始化后加载题库
  loadQuestions() {
    let _this = this
    // http请求
    util.request({
      url: "/api/secret/paper",
      data: {
        'cid': _this.data.userSelectCategoryId,
        'grade': _this.data.userSelectGrade,
      },
      funcSucc: function (res) {
        //保存第一题 保存题目列表
        _this.setData({
          paperId: res.paper_id,
          quesList: res.data || [],
          // ansList: JSON.parse(res.temp_ans || '[]'), //如有历史答案则记录
          currentQues: res.data[0],
          currentNum: 1,
          startTime: res.paper_start_time > 0 ? res.paper_start_time : Date.now() + 1000 //为了减少页面加载时间影响
        })

        // 初始化答案列表
        _this.initTempAns(JSON.parse(res.temp_ans || '[]'))


        // 初始化第一题答案
        _this.initCurrentAns()

        // 初始化答题卡
        _this.initCard()

        // 开始计时
        _this.initTimer()

        // 若为恢复试卷则提示
        if (res.paper_start_time > 0) {
          Notify({
            type: 'warning',
            message: '已恢复答案'
          });
        } else {
          Notify({
            type: 'success',
            message: '开始考试'
          });
        }
      },
      funcErr: function (res) {
        wx.showToast({
          title: '获取题目失败：' + res.msg,
          icon: 'none',
          mask: true,
          duration: 2000
        })
        util.jumpPrePage()
      }
    })
  },


  // 初始化页面参数
  initParams() {
    // 检查登录
    // 无效参数则跳转上一页
    if (!util.checkLogin()) {
      wx.showToast({
        title: '用户未登录',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      util.jumpPrePage()
      return
    }

    // 获取保存的cid，grade参数
    let userSelectCategoryId = wx.getStorageSync('userSelectCategoryId')
    let userSelectGrade = wx.getStorageSync('userSelectGrade')

    if (!userSelectGrade || !userSelectCategoryId) {
      wx.showToast({
        title: '请先选择题库分类',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      util.jumpPrePage()
      return
    }

    // 设置页面参数
    this.setData({
      userSelectCategoryId: userSelectCategoryId,
      userSelectGrade: userSelectGrade,
    })

    // 加载题目
    this.loadQuestions()
  },

  // 上传临时答案
  uploadTempAns() {
    let _this = this
    util.requestBg({
      url: "/api/secret/temppaper",
      data: {
        // 'session': wx.getStorageSync('session'),
        'paperid': _this.data.paperId,
        'ansList': JSON.stringify(this.data.ansList)
      },
    })

  },
  //添加错题
  addErrorQuestions(errList) {
    let errorQuestions = wx.getStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`) || '[]'
    let tempList = JSON.parse(errorQuestions)

    // 判断当前错题是否在错题库，在的话则不加入
    for (let ques of errList) {
      let repeatFlag = false
      //原有错题有的话则下一题
      for (let item of tempList) {
        if (item.id == ques.id) {
          repeatFlag = true
          break
        }
      }

      if (!repeatFlag) {
        //没有则加入该题
        tempList.push(ques)
      }
    }

    wx.setStorageSync(`err${this.data.userSelectCategoryId}_${util.gradeToNum(this.data.userSelectGrade)}`, JSON.stringify(tempList))
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
    //停止计时
    clearInterval(this.mytimer)


    // 上传临时答案
    this.uploadTempAns()
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