<template>
	<div>
		<!-- 表单 -->
		<el-form :inline="true" ref="formValue" :model="formValue" :rules="rules">
			<el-form-item label="添加分类" prop="category">
				<el-input v-model.trim="formValue.category"></el-input>
			</el-form-item>
			<el-form-item label="简介" prop="desc">
				<el-input v-model.trim="formValue.desc" placeholder="非必填"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addCategory('formValue')"
					>添加</el-button
				>
			</el-form-item>
		</el-form>

		<!-- 显示分类数据 -->
		<el-table
			v-loading="loadingTable"
			:data="tableData"
			border
			style="width: 100%"
		>
			<el-table-column
				prop="category"
				label="分类"
				align="center"
			></el-table-column>
			<el-table-column
				prop="g1_count"
				label="初级工"
				align="center"
			></el-table-column>
			<el-table-column
				prop="g2_count"
				label="中级工"
				align="center"
			></el-table-column>
			<el-table-column
				prop="g3_count"
				label="高级工"
				align="center"
			></el-table-column>
			<el-table-column
				prop="g4_count"
				label="技师"
				align="center"
			></el-table-column>
			<el-table-column prop="g5_count" label="高级技师" align="center" />
			<el-table-column
				prop="g6_count"
				label="其他"
				align="center"
			></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-popconfirm
						title="确定删除吗？"
						@onConfirm="delCategory(scope.row)"
					>
						<el-button type="danger" slot="reference">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
'use strict'

import { request, requestBG } from '../../common/utils'

export default {
	name: 'Category',
	data() {
		return {
			formValue: {
				category: '', //用户输入分类
				desc: '' //输入简介
			},

			rules: {
				category: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' }
				]
			},

			tableData: [], //表格数据

			// loadingForm:true,
			loadingTable: false
		}
	},
	methods: {
		//   添加分类
		addCategory(formName) {
			let { category, desc } = this.formValue

			this.$refs[formName].validate((valid) => {
				if (valid) {
					request({
						url: '/m/api/category',
						method: 'post',
						data: { category, desc }
					})
						.then((res) => {
							this.$message({
								message: '添加成功',
								type: 'success'
							})
							this.initCategory()
						})
						.catch((e) => {
							this.$message({
								message: '添加失败：' + e,
								type: 'error'
							})
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},

		// 删除分类
		delCategory(e) {
			// 请求
			request({
				url: '/m/api/category',
				method: 'delete',
				params: { cid: e.id }
			})
				.then((res) => {
					this.$message({
						message: '删除成功',
						type: 'success'
					})
					this.initCategory()
				})
				.catch((e) => {
					this.$message({
						message: '删除失败：' + e,
						type: 'error'
					})
				})
		},

		//   初始化分类
		initCategory() {
			this.loadingTable = true
			requestBG({
				url: '/api/open/categorys',
				method: 'get'
			})
				.then((res) => {
					this.tableData = res.data.data
					this.loadingTable = false
				})
				.catch((e) => {
					this.$message({
						message: '加载失败：' + e,
						type: 'error'
					})
					this.loadingTable = false
				})
		}
	},
	created() {
		//   加载分类数据
		this.initCategory()
	}
}
</script>

<style scoped>
.text-center {
	text-align: center;
}
</style>
