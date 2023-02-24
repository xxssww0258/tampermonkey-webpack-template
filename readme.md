# tampermonkey-webpack-template
油猴脚手架模板，用于开发油猴插件

## 使用use


### 前置准备
+ 打开浏览器的油猴设置选项，找到 `外部` 把更新间隔设置为总是 (实际上有5秒缓存)
+ 设置油猴脚本元数据 找得到`config\index.ts META_STRING` 字段

### 使用
+ 执行对应命令（这里以 `npm run serve` 启动服务）
```bash
# 本地调试
npm run serve
# 构建混淆后代码
npm run build
# 构建不混淆的代码
npm run dev
```
+ 启动服务后，终端会提示如下
```bash
脚本安装url:   http://localhost:3000/meta/main.user.js
html调试url:   http://localhost:3000/
```
+ 点击 `脚本安装url` 安装油猴脚本
+ 点击 `html调试url` 打开调试页面 或则 手动打开对应的 `@match` `@include` 的页面进行开发