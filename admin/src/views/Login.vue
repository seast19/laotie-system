<template>
	<div>
		<!--容器-->
		<el-row justify="center" type="flex" class="container">
			<el-col :xs="2" :sm="4" :md="8"> </el-col>
			<el-col :xs="20" :sm="16" :md="8" class="border">
				<div class="login">登录</div>
				<el-form
					:model="formValue"
					:rules="rules"
					ref="formValue"
					label-position="left"
					label-width="80px"
				>
					<el-form-item label="账号" prop="username">
						<el-input
							v-model.trim="formValue.username"
							type="text"
							placeholder="username"
						/>
					</el-form-item>
					<el-form-item label="密码" prop="pwd">
						<el-input
							v-model.trim="formValue.pwd"
							show-password
							placeholder="password"
						/>
					</el-form-item>
					<!-- <el-form-item label="">
						<Vaptcha @my-token="getToken($event)" />
					</el-form-item> -->
					<el-form-item label="验证码" prop="code">
						<el-col :span="12">
							<el-input v-model="formValue.code"></el-input>
						</el-col>
						<el-col :span="12" class="codeImg">
							<img :src="codeValue.img" @click="freshCode()" />
						</el-col>
					</el-form-item>
					<el-form-item label="记住我" prop="rememberme">
						<el-switch v-model="formValue.remeberme" />
					</el-form-item>
					<el-form-item class="btn-group">
						<el-button type="primary" @click="onSubmit('formValue')"
							>登录</el-button
						>
						<el-button>取消</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :xs="2" :sm="4" :md="8" />
		</el-row>

		<div class="footer">
			<p>
				©2020 老铁题库 
				<!-- |
				<a href="https://www.vaptcha.com" target="_blank">VAPTCHA</a> -->
			</p>
		</div>
	</div>
</template>

<script>
'use strict'
import { request, requestBG } from '../common/utils'

import Vaptcha from '../components/Vaptcha/index'

export default {
	name: 'Login',
	components: { Vaptcha },
	data() {
		return {
			// 表单
			formValue: {
				username: '',
				pwd: '',
				code: '',
				remeberme: false
			},
			// 表单验证规则
			rules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
				],
				pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				code: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
					{ min: 4, max: 4, message: '验证码为4位数字', trigger: 'change' }
				]
			},

			token: '', //行为验证的token

			// 验证码
			codeValue: {
				img: '',
				ctoken: ''
			}
		}
	},
	methods: {
		getToken(e) {
			this.token = e
		},

		//获取验证码
		freshCode() {
			requestBG({
				url:
					'https://service-dlgbjcx0-1254302252.gz.apigw.tencentcs.com/release/simple-captcha',
				method: 'post',
				data: {
					action: 'new'
				}
			})
				.then((res) => {
					console.log(res)
					this.codeValue.img = res.data.img
					this.codeValue.ctoken = res.data.ciphertext
				})
				.catch((e) => {
					console.log('获取验证码失败' + e)
				})
		},

		//登录操作
		onSubmit(formName) {
			let { username, pwd, code } = this.formValue
			let ctoken = this.codeValue.ctoken		

			this.$refs[formName].validate((valid) => {
				if (valid) {
					request({
						url: '/m/login',
						method: 'POST',
						data: { username, pwd, code, ctoken }
					})
						.then((res) => {
							//设置jwt到localstroage
							localStorage.setItem('jwt', res.data.jwt)
							this.$message({
								message: '登录成功',
								type: 'success'
							})
							setTimeout(() => {
								this.$router.push('/')
							}, 800)
						})
						.catch((e) => {
							this.$message({
								message: '登录失败：' + e,
								type: 'error'
							})

							this.freshCode()
							this.formValue.code = ''
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		}
	},
	created() {
		this.freshCode()
	}
}
</script>

<style scoped>
.footer {
	font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
		'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
	text-align: center;
	color: #909399;
}

.footer a {
	text-decoration: none;
	color: #909399;
}

.container {
	margin-top: 20vh;
}

.login {
	text-align: center;
	padding-bottom: 30px;
	font-size: 36px;
}

.border {
	padding: 20px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.btn-group {
	margin-left: -80px;
	text-align: center;
}
</style>
