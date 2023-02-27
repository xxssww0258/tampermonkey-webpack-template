import express, { RequestHandler, ErrorRequestHandler } from 'express'
import webpack, { Configuration } from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import {
    entry,
    getBuildedEntryFilename,
    generateMetaBanner,
    generateScriptUrl,
} from './webpack.base'
import { webpackBaseChain } from './webpack.dev'
// import child_process from 'child_process'
import { PORT } from './index'

const metaUrl = `http://localhost:${PORT}/meta.user.js`

function serveConfigInit(): Configuration {
    webpackBaseChain.externals({})
    webpackBaseChain.stats('errors-only')
    webpackBaseChain.optimization.runtimeChunk('single')

    for (const entryFile in entry) {
        webpackBaseChain.entry(entryFile).prepend(
            `webpack-hot-middleware/client?reload=true`
            // `webpack-hot-middleware/client?reload=true&path=http://localhost:${PORT}/__webpack_hmr`
        )
    }
    webpackBaseChain.plugin('hot').use(webpack.HotModuleReplacementPlugin)
    const webpackConfig = webpackBaseChain.toConfig()
    webpackConfig.module?.rules?.push({
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/inline',
    })
    return webpackConfig
}

export function serveRun(): void {
    const webpackConfig = serveConfigInit()

    const app = express()
    const compiler = webpack(webpackConfig)

    // 仅返回油猴元数据，用于安装脚本
    app.get('/meta.user.js', (req, res) => {
        res.type('application/json')
        const entryFiles = getBuildedEntryFilename()
        // FIX: 热更新webpack-hot-middleware 存在一个bug，必须 抽离runtime,不然会报错,因此还需引入runtime
        entryFiles.push('runtime.user.js')
        res.send(generateMetaBanner(generateScriptUrl(entryFiles)))
    })

    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: webpackConfig.output?.publicPath,
        })
    )

    app.use(webpackHotMiddleware(compiler))

    app.listen(PORT, function () {
        console.log('=================== 服务初始化成功 =====================')

        // 使用默认浏览器打开
        // const filenames = generateScriptUrl(getBuildedEntryFilename())
        // 随便取一个入口文件执行
        console.log('脚本安装url:   \x1B[31m%s\x1B[0m', `${metaUrl}`)
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
