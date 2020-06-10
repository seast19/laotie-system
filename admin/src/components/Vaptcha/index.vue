<template>
    <div id="vaptchaContainer">
        <div class="vaptcha-init-main">
            <div class="vaptcha-init-loading">
                <a href="/" target="_blank">
                    <img src="https://r.vaptcha.com/public/img/vaptcha-loading.gif" alt=""/>
                </a>
                <span class="vaptcha-text">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
    'use strict'

    import {apiUrl,vid} from '../../common/config'
    // import {vaptcha} from '../../asset/v3'

    export default {
        name: "Vaptcha",
        mounted() {
            let _this = this

            window.vaptcha({
                vid: vid, // 验证单元id
                type: 'click', // 显示类型 点击式
                container: '#vaptchaContainer', // 容器，可为Element 或者 selector
                offline_server: apiUrl, //离线模式服务端地址
            }).then((vaptchaObj) => {
                //渲染按钮
                vaptchaObj.render()
                //验证通过
                vaptchaObj.listen('pass', () => {
                    let t = vaptchaObj.getToken()
                    _this.$emit('my-token', t)
                })
                //关闭验证弹窗时触发
                vaptchaObj.listen('close', () => {
                    console.log('验证错误')
                })
            })
        }
    }
</script>

<style scoped>
    .vaptcha-init-main {
        display: table;
        width: 100%;
        height: 100%;
        background-color: #EEEEEE;

    }

    #vaptchaContainer >>> .vp-dark-btn.vp-basic-btn{

        min-width: 20px;
    }

    ​
    ​
    .vaptcha-init-loading > a {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: none;
    }

    ​
    .vaptcha-init-loading > a img {
        vertical-align: middle
    }

    ​
    .vaptcha-init-loading .vaptcha-text {
        font-family: sans-serif;
        font-size: 12px;
        color: #CCCCCC;
        vertical-align: middle
    }
</style>