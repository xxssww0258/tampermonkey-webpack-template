import webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import { webpackBaseConfig } from './webpack.base'
import { serveRun } from './webpack.serve'
import { isServe } from './index'

export const webpackDevConfig: Configuration = merge(
    {
        mode: 'development',
        plugins: [],
    },
    webpackBaseConfig
)

if (isServe) {
    console.log('-----------------')
    serveRun()
} else {
    console.log('=================')
    const compiler = webpack(webpackDevConfig, function (err, stats) {
        if (err) {
            throw err
        }
        // console.log(stats)
        console.log('\n开发环境打包完成\n')
    })
}
