import express, { RequestHandler, ErrorRequestHandler, Express } from 'express'
import webpack, { Configuration, EntryObject } from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import {
    getEntryFilenameUrl,
    getBuildedEntryFilename,
    addJstoMetaStr,
} from './webpack.base'
import { webpackDevConfig } from './webpack.dev'
// import child_process from 'child_process'
import path from 'path'
import { PORT } from './index'
import { merge } from 'webpack-merge'

// 如果url是dist文件返回纯元数据
const metaMatchMiddleware: RequestHandler = (req, res, next) => {
    // debugger
    // console.log(req,res)
    const isEntryFile = getBuildedEntryFilename().includes(
        path.basename(req.path)
    )
    if (isEntryFile) {
        res.type('application/json')
        res.send(addJstoMetaStr())
    } else {
        next()
    }
}

const serverConfig: Configuration = {
    stats: 'errors-only',
    plugins: [new webpack.HotModuleReplacementPlugin()],
}

export function serveRun(): void {
    webpackDevConfig.externals = {}
    ;((webpackDevConfig.entry as EntryObject).main as string[]).unshift(
        // TODO：开发阶段，在第三方页面启动热刷新存在跨域问题
        // `webpack-hot-middleware/client?reload=true&path=http://localhost:${PORT}/__webpack_hmr`
        'webpack-hot-middleware/client?reload=true'
    )
    const mergeConfig = merge(webpackDevConfig, serverConfig)
    // console.log(mergeConfig)
    const app = express()
    const compiler = webpack(mergeConfig)

    app.use('/meta', metaMatchMiddleware)

    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: webpackDevConfig.output?.publicPath,
        })
    )

    app.use(webpackHotMiddleware(compiler))

    app.listen(PORT, function () {
        console.log('=================== 服务初始化成功 =====================')

        // 使用默认浏览器打开
        const filenames = getEntryFilenameUrl()
        filenames.forEach((filename) => {
            // child_process.exec(`start ${filename}`)
            console.log('脚本安装url:   \x1B[31m%s\x1B[0m', `${filename}`)
        })
        console.log(
            'html调试url:   \x1B[36m%s\x1B[0m',
            `http://localhost:${PORT}/`
        )
    }).on('error', function (err) {
        if (err?.code === 'EADDRINUSE') {
            console.log(PORT + '端口被占用，请修改 config/index.ts 中PORT字段')
            process.exit(0)
        }
        throw err
    } as ErrorRequestHandler)
}
