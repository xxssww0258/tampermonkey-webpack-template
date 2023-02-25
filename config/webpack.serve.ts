import express, { RequestHandler, ErrorRequestHandler } from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import {
    getEntryFilenameUrl,
    getBuildedEntryFilename,
    entryToMetaStr,
    entry,
} from './webpack.base'
import { webpackBaseChain } from './webpack.dev'
// import child_process from 'child_process'
import path from 'path'
import { PORT } from './index'

// 如果url是dist文件返回纯元数据
const metaMatchMiddleware: RequestHandler = (req, res, next) => {
    // debugger
    // console.log(req,res)
    const isEntryFile = getBuildedEntryFilename().includes(
        path.basename(req.path)
    )
    if (isEntryFile) {
        res.type('application/json')
        res.send(entryToMetaStr())
    } else {
        next()
    }
}

function serveConfigInit() {
    webpackBaseChain.externals({})

    for (const entryFile in entry) {
        webpackBaseChain
            .entry(entryFile)
            // TODO：开发阶段，在第三方页面启动热刷新存在跨域问题
            // `webpack-hot-middleware/client?reload=true&path=http://localhost:${PORT}/__webpack_hmr`
            .prepend('webpack-hot-middleware/client?reload=true')
    }
    webpackBaseChain.plugin('hot').use(webpack.HotModuleReplacementPlugin)
}

export function serveRun(): void {
    serveConfigInit()

    const app = express()
    const compiler = webpack(webpackBaseChain.toConfig())

    app.use('/meta', metaMatchMiddleware)
    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: webpackBaseChain.toConfig().output?.publicPath,
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
