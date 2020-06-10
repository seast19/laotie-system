<template>
	<div class="aaa">
		<!--        日志列表-->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" align="" label="id" width="180">
			</el-table-column>
			<el-table-column
				prop="time"
				align=""
				label="日期"
				width="180"
				:formatter="formatDate"
			>
			</el-table-column>
			<el-table-column prop="msg" align="" label="详细信息">
				<template slot-scope="scope">
					<el-collapse>
						<el-collapse-item title="日志">
							<p>{{ scope.row.msg }}</p>
						</el-collapse-item>
					</el-collapse>
				</template>
			</el-table-column>
			<el-table-column prop="action" width="180" label="操作">
				<template slot-scope="scope">
					<el-popconfirm
						title="确定删除吗？"
						@onConfirm="onDelete(scope.row.id)"
					>
						<el-button slot="reference" type="danger">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!--        分页-->
		<el-pagination
			layout="total, prev, pager, next"
			@current-change="pageChange"
			:total="total"
			:current-page="page"
		>
		</el-pagination>
	</div>
</template>

<script>
'use strict'

import { request } from '../../common/utils'

export default {
	name: 'Logs',
	data() {
		return {
			tableData: [], //表格数据
			page: 1, //当前页码
			total: 0 //数据总数
		}
	},

	methods: {
		//获取当前页码
		pageChange(e) {
			this.page = e
			this.getLogsByPage()
		},

		//格式化时间戳
		formatDate(row, column, cellValue, index) {
			const d = new Date(cellValue) //创建一个指定的日期对象
			const year = d.getFullYear() //取得4位数的年份
			const month = d.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
			const date = d.getDate() //返回日期月份中的天数（1到31）
			const hour = d.getHours() //返回日期中的小时数（0到23）
			const minute = d.getMinutes() //返回日期中的分钟数（0到59）
			const second = d.getSeconds() //返回日期中的秒数（0到59）
			return (
				year +
				'/' +
				month +
				'/' +
				date +
				' ' +
				hour +
				':' +
				minute +
				':' +
				second
			)
		},

		//删除日志
		onDelete(e) {
			request({
				url: '/m/api/logs',
				method: 'delete',
				params: { id: e }
			})
				.then((res) => {
					this.$message({
						message: '删除成功',
						type: 'success'
					})
					this.getLogsByPage()
				})
				.catch((e) => {
					this.$message({
						message: '删除失败：' + e,
						type: 'error'
					})
				})
		},

		//    初始化日志
		initLogs() {
			request({
				url: '/m/api/logs',
				method: 'get'
			})
				.then((res) => {
					this.tableData = res.data.data
					this.total = res.data.num
				})
				.catch((e) => {
					this.$message({
						message: '加载失败：' + e,
						type: 'error'
					})
				})
		},

		//    获取某页数据
		getLogsByPage() {
			request({
				url: '/m/api/logs',
				method: 'get',
				params: { page: this.page }
			})
				.then((res) => {
					this.tableData = res.data.data
					this.total = res.data.num
				})
				.catch((e) => {
					this.$message({
						message: '加载失败：' + e,
						type: 'error'
					})
				})
		}
	},
	mounted() {
		this.initLogs()
	}
}
</script>

<style scoped>
.aaa >>> .el-table .cell {
	white-space: pre-line;
}

.el-collapse {
	/* padding: 10px; */
	border-top: 0;
	border-bottom: 0;
}

.el-collapse-item {
	background-color: transparent;
}

.el-collapse-item >>> .el-collapse-item__wrap {
	border-bottom: 0;
	background-color: transparent;
}

.el-collapse-item >>> .el-collapse-item__header {
	border-bottom: 0;
	background-color: transparent;
}
</style>
