# tampermonkey-webpack-template
油猴脚手架模板，用于开发油猴插件

## 功能介绍
+ 支持 vue 和 react 前端框架
+ 支持 TypeScript 
+ eslint 错误校验
+ prettier 语法风格
+ 支持本地热更新（目标网站更新上有5秒延迟, 出于开发考角度虑需手动刷新）
+ 支持直接使用图片资源
+ 支持css预处理语言sass

## 使用 Use


### 前置准备
+ 打开浏览器的油猴设置选项，找到 `外部` 把更新间隔设置为总是 (实际上有5秒，这导致目标网站热更新有延迟)

### 使用
+ 初始化项目
`npm install`
+ 执行对应命令（这里以 `npm run serve` 启动服务）
```bash
# 本地调试
npm run serve
# 构建不混淆的代码
npm run dev
# 构建混淆后代码
npm run build
```
+ 启动服务后，终端会提示如下
```bash
脚本安装url:   http://localhost:3000/meta.user.js
html调试url:   http://localhost:3000/
```
+ 点击 `脚本安装url` 安装油猴脚本（修改了入口文件，就需要重新安装脚本）
+ 点击 `html调试url` 打开调试页面 或则 手动打开对应的 `@match` `@include` 的页面进行开发

### vue与react的使用
+ 修改`config\index.ts`元数据添加对应的vue和react的cdn
+ 修改`config\webpack.base.ts`入口文件`entry`
+ 修改`config\webpack.base.ts`底部，设置需要的规则
```js
// 或则都不用
useVueRule(webpackBaseChain) // vue 用这个
useReactRule(webpackBaseChain) // react 用这个
```

## 注意
+ 默认会把 `react` 和 `vue` 代码剔除，记得在油猴元数据中引入cdn `@require`， 默认已引入
+ 图片引入会直接转成 `base64` 注意体积大小
+ `webpack` 的修改需要重启终端
+ 提交 `Greasy Fork` 的代码不要混淆