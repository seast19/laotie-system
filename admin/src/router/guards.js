'use strict'

import { requestBG } from '../common/utils'

import ElementUI from 'element-ui'

// 检查登录状态
function filteLogin(to, from, next) {
	requestBG({
		method: 'GET',
		url: '/m/login'
	})
		.then(() => {
			next()
		})
		.catch((e) => {
			console.log(e)

			ElementUI.Message({
				message: '用户未登录',
				type: 'warning'
			})
			next('/login')
		})
}

export { filteLogin }
