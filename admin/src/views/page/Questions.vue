<template>
	<div>
		<!-- 显示分类数据 -->
		<el-table v-loading="loadingTable" :data="tableData" border style="width: 100%">
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
			<el-table-column
				prop="g5_count"
				label="高级技师"
				align="center"
			></el-table-column>
			<el-table-column
				prop="g6_count"
				label="其他"
				align="center"
			></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<!-- 删除等级 -->
					<el-dropdown class="m-5" @command="onDeleteGrade">
						<el-button type="danger" size="mini">
							删除
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								v-if="scope.row.g1_count > 0"
								:command="{ id: scope.row.id, grade: '初级工' }"
								>初级工
							</el-dropdown-item>
							<el-dropdown-item
								v-if="scope.row.g2_count > 0"
								:command="{ id: scope.row.id, grade: '中级工' }"
								>中级工
							</el-dropdown-item>
							<el-dropdown-item
								v-if="scope.row.g3_count > 0"
								:command="{ id: scope.row.id, grade: '高级工' }"
								>高级工
							</el-dropdown-item>
							<el-dropdown-item
								v-if="scope.row.g4_count > 0"
								:command="{ id: scope.row.id, grade: '技师' }"
								>技师
							</el-dropdown-item>
							<el-dropdown-item
								v-if="scope.row.g5_count > 0"
								:command="{ id: scope.row.id, grade: '高级技师' }"
								>高级技师
							</el-dropdown-item>
							<el-dropdown-item
								v-if="scope.row.g6_count > 0"
								:command="{ id: scope.row.id, grade: '其他' }"
								>其他
							</el-dropdown-item>
							<el-dropdown-item
								disabled
								v-if="
									scope.row.g1_count == 0 &&
										scope.row.g2_count == 0 &&
										scope.row.g3_count == 0 &&
										scope.row.g4_count == 0 &&
										scope.row.g5_count == 0 &&
										scope.row.g6_count == 0
								"
								:command="{ id: scope.row.id, grade: '-1' }"
								>无
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

					<!-- 上传文件 -->
					<el-button
						size="mini"
						class="m-5"
						type="primary"
						@click.stop="clickUpload(scope.row.id)"
					>
						上传
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input
						:id="'myFile' + scope.row.id"
						name="myFile"
						class="inputfile"
						type="file"
						@change="handlerUpload(scope.row.id)"
					/>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
'use strict'

import { request,requestBG } from '../../common/utils'

export default {
	name: 'Questions',
	data() {
		return {
			inputCategory: '', //用户输入分类
			inputDesc: '', //输入简介

			tableData: [] ,//表格数据

			loadingTable:false
		}
	},
	methods: {
		// 点击上传按钮
		clickUpload(cid) {
			document.getElementById('myFile' + cid).click()
		},

		// 删除某个等级的试卷
		onDeleteGrade(e) {
			this.$confirm('真的删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					let grade = e.grade
					let categoryId = e.id
					request({
						url: '/m/api/question',
						method: 'delete',
						params: { grade, categoryId }
					})
						// _delete('/m/api/question', { grade, categoryId })
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
				})
				.catch(() => {})
		},

		// 上传文件
		handlerUpload(cid) {
			// 空文件则结束
			if (!document.getElementById('myFile' + cid).files[0]) {
				this.$message({
					message: '取消上传',
					type: 'info'
				})
				return
			}

			//通过append向form对象添加数据
			let param = new FormData()
			param.append('categoryId', cid)
			param.append('files', document.getElementById('myFile' + cid).files[0])

			// 清空files
			document.getElementById('myFile' + cid).value = ''

			// 上传请求
			request({
				url: '/m/api/question',
				method: 'post',
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				data: param
			})
				.then((res) => {
					this.$message({
						message: '上传文件成功',
						type: 'success'
					})
					this.initCategory()
				})
				.catch((e) => {
					this.$message({
						message: '上传失败：' + e,
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
				// _get('/api/open/categorys')
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
.m-5 {
	margin: 5px;
}

.inputfile {
	display: none;
}
</style>
