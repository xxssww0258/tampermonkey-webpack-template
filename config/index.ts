export const PORT = 3000
export const MONKEY_EXT = 'user'
export const META_STRING = `// ==UserScript==
// @name         zhangsan测试
// @namespace    http://www.baidu.com
// @version      0.1
// @description  hello world
// @author       zhangsan
// @match        *://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.runtime.global.prod.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js
`
// 判断是否启动服务
export const isServe = (function isServe(): boolean {
    return process.argv.includes('serve')
})()
