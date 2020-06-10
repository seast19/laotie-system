'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'


import {filteLogin} from './guards'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
        meta: { title: "登录" }
    },
    {
        path: '/',
        beforeEnter: filteLogin,
        component: () => import(/* webpackChunkName: "about" */ '../views/Layout.vue'),
        children: [
            {
                path: '',
                redirect: '/category'
            },
            {
                path: '/category',
                name: 'category',
                component: () => import(/* webpackChunkName: "about" */ '../views/page/Category.vue'),
                meta: { title: "分类管理" },
            },
            {
                path: '/questions',
                name: 'questions',
                component: () => import(/* webpackChunkName: "about" */ '../views/page/Questions.vue'),
                meta: { title: "题目管理" },
            },
            {
                path: '/papers',
                name: 'papers',
                component: () => import(/* webpackChunkName: "about" */ '../views/page/Papers.vue'),
                meta: { title: "试卷管理" },
            },
            {
                path: '/logs',
                name: 'logs',
                component: () => import(/* webpackChunkName: "about" */ '../views/page/Logs.vue'),
                meta: { title: "错误日志" },
            },
        ]
    },


]

const router = new VueRouter({
    routes
})

//动态设置标题
router.beforeEach((to,from,next)=>{

    if(to.meta.title){
        document.title = to.meta.title
    }
    next()
})

export default router
