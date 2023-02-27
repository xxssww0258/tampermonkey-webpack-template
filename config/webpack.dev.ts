import webpack from 'webpack'
import { useBaseRule, webpackBaseChain } from './webpack.base'
import { serveRun } from './webpack.serve'
import { isServe } from './index'

webpackBaseChain.mode('development')
// webpackBaseChain.devtool('source-map')

if (isServe) {
    console.log('-----------------')
    serveRun()
} else {
    console.log('=================')
    const webpackConfig = webpackBaseChain.toConfig()
    useBaseRule(webpackConfig)

    const compiler = webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw err
        }
        // console.log(stats)
        console.log('\n开发环境打包完成\n')
    })
}

export { webpackBaseChain }
