<template>
	<el-container class="main-container">
		<!-- 导航栏 -->
		<el-header>
			<el-menu
				:default-active="activeNavbar"
				class="el-menu-demo"
				mode="horizontal"
				background-color="#383838"
				text-color="#fff"
				active-text-color="#ffd04b"
			>
				<el-menu-item index="0">老铁题库后台</el-menu-item>
				<!-- <el-menu-item index="1">功能1</el-menu-item>
                <el-menu-item index="2" disabled>功能2</el-menu-item>
                <el-menu-item index="3">功能3</el-menu-item> -->
				<el-menu-item style="float:right">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
							<el-avatar
								:size="30"
								:src="
									'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
								"
							></el-avatar>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="quit">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-menu-item>
			</el-menu>
		</el-header>

		<el-container>
			<!-- 侧边栏 -->
			<el-aside style="max-width:200px;width:auto">
				<el-menu
					:collapse="iscollapesd"
					:default-active="activeSidebar"
					@select="handleSelectSidebar"
					class="sider"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
				>
					<el-menu-item
						:index="item.index"
						v-for="item in sidebarList"
						:key="item.index"
					>
						<i :class="item.icon"></i>
						<span slot="title">{{ item.text }}</span>
					</el-menu-item>
				</el-menu>
			</el-aside>

			<el-container>
				<!-- 正文 -->
				<el-main>
					<!-- 侧边栏折叠 -->
					<a
						@click.prevent="iscollapesd = !iscollapesd"
						href=""
						class="el-icon-s-unfold"
						id="collapseBtn"
					></a>
					<el-breadcrumb separator="/">
						<!-- 面包屑 -->
						<el-breadcrumb-item class="bread-crumb">
							<a @click="handleSelectSidebar('0')">首页</a>
						</el-breadcrumb-item>
						<el-breadcrumb-item>{{
							sidebarList[activeSidebar].text
						}}</el-breadcrumb-item>
					</el-breadcrumb>
					<!-- 路由入口 -->
					<router-view></router-view>
				</el-main>

				<!-- 脚部 -->
				<el-footer>Copyright © {{ year }} 老铁题库</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
'use strict'
export default {
	name: 'Layout',
	data() {
		return {
			iscollapesd: false, // 侧边导航折叠

			activeNavbar: '0', //navbar当前激活项
			activeSidebar: '0', //sidebar当前激活项

			sidebarList: [
				{
					index: '0',
					icon: 'el-icon-menu',
					text: '分类管理',
					href: '/category'
				},
				{
					index: '1',
					icon: 'el-icon-s-order',
					text: '题目管理',
					href: '/questions'
				},
				{
					index: '2',
					icon: 'el-icon-document',
					text: '试卷管理',
					href: '/papers'
				},
				{
					index: '3',
					icon: 'el-icon-files',
					text: '错误日志',
					href: '/logs'
				}
			]
		}
	},
	computed: {
		year() {
			let date = new Date()
			let year = date.getFullYear()
			return year
		}
	},
	methods: {
		//   处理点击sidebar事件
		handleSelectSidebar(key) {
			// 重复点击不处理
			if (this.activeSidebar === key) {
				return
			}
			this.activeSidebar = key
			this.$router.push({ path: this.sidebarList[this.activeSidebar].href })
		},

		//登出
		logout() {
			localStorage.setItem('jwt', '')
			this.$message({
				message: '已退出登录',
				type: 'warning'
			})
			this.$router.push('/login')
		},

		//处理导航栏‘我的’下拉菜单
		handleCommand(e) {
			if (e === 'quit') {
				this.logout()
			}
		},

		//    初始化sidebar
		initSiderbar() {
			//    获取当前路由
			let path = window.location.hash.split('#')[1]
			//设置激活的侧边菜单
			for (let item of this.sidebarList) {
				if (path === item.href) {
					this.activeSidebar = item.index
				}
			}
		}
	},
	created() {
		this.initSiderbar()
	}
}
</script>

<style scoped>
#collapseBtn {
	float: left;
	margin-right: 10px;
	color: black;
	text-decoration: none;
}

.el-header {
	padding: 0;
}

.main-container {
	height: 100vh;
}

.sider {
	height: 100%;
}

.bread-crumb {
	margin-bottom: 15px;
}
</style>
