// components/sun-answer-menu/sun-answer-menu.js

// const computedBehavior = require('miniprogram-computed')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    maxNum: {
      type: Number,
      value: 0
    },
    activeList: {
      type: Array,
      value: []
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理答题卡点击
    handleCard(e) {
      let num = e.target.dataset.cardnum


      // 传递点击的序号给父组件
      this.triggerEvent('itemMenuChange', {
        num
      })
    },
  }
})