'use strict'


//调试模式
// const debugMod = 'release'
const debugMod = 'debug'


//api接口

// const apiUrl = 'http://127.0.0.1:8081'
const apiUrl = 'https://seast.picp.vip'


// captcha
// 测试环境
// const vid = '5edb8bf0b8c19be33e280e61'
// const vkey = 'ab221b7e82624f8583a9a7f45cf5218e'

// 生产环境
const vid = '5e31596276cb1970819ea8a9'
// const vkey = '732498ff69334a24ad32c9bb2660c662'


// const apiUrl = debugMod === 'release' ? window.location.origin : api


export  {
    debugMod,
    vid,
    apiUrl,
}

