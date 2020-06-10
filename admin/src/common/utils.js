'use strict'

import axios from 'axios'

import { Loading } from 'element-ui'

import { apiUrl } from './config'

// 通用请求(带loading)
function request(c) {
	let loadingInstance1

	// 实例化axios
	let instance = new axios.create({
		baseURL: apiUrl
	})

	// header添加jtoken
	instance.defaults.headers.common['jtoken'] = localStorage.getItem('jwt') || ''

	// 请求拦截器添加jwt
	instance.interceptors.request.use(		
		function(config) {
			// 添加loading
			loadingInstance1 = Loading.service({
				fullscreen: true,
				background: '#00000026',
				text:'加载中...'
			})

			return config
		},
		function(error) {

			// 对请求错误做些什么
			return Promise.reject(error)
		}
	)

	// 响应拦截器
	instance.interceptors.response.use(
		function(response) {
			loadingInstance1.close()

			const successCode = [2000, 6000, 0]
			if (successCode.indexOf(response.data.code) != -1) {
				return response
			} else {
				return Promise.reject(response.data.msg || '未知错误')
			}
		},
		function(error) {
			loadingInstance1.close()

			// 对请求错误做些什么
			return Promise.reject(error)
		}
	)

	return instance(c)
}

// 通用请求(不带loading)
function requestBG(c) {
	// 实例化axios
	let instance = new axios.create({
		baseURL: apiUrl
	})

	// header添加jtoken
	instance.defaults.headers.common['jtoken'] = localStorage.getItem('jwt') || ''

	// 请求拦截器添加jwt
	instance.interceptors.request.use(
		function(config) {
			return config
		},
		function(error) {
			// 对请求错误做些什么
			return Promise.reject(error)
		}
	)

	instance.interceptors.response.use(
		function(response) {
			let successCode = [2000, 6000, 0]

			if (successCode.indexOf(response.data.code) != -1) {
				return response
			} else {
				return Promise.reject(response.data.msg || '未知错误')
			}
		},
		function(error) {
			// 对请求错误做些什么
			return Promise.reject(error)
		}
	)

	return instance(c)
}

//    时间戳ms转日期
function formatDate(timestamp) {
	// var g=1551334252272; //定义一个时间戳变量
	const d = new Date(timestamp) //创建一个指定的日期对象

	const year = d.getFullYear() //取得4位数的年份
	const month = d.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
	const date = d.getDate() //返回日期月份中的天数（1到31）
	const hour = d.getHours() //返回日期中的小时数（0到23）
	const minute = d.getMinutes() //返回日期中的分钟数（0到59）
	const second = d.getSeconds() //返回日期中的秒数（0到59）
	return (
		year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':' + second
	)
}

export { formatDate, request, requestBG }
