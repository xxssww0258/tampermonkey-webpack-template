import webpack from 'webpack'
import { webpackBaseChain } from './webpack.base'
import { serveRun } from './webpack.serve'
import { isServe } from './index'

webpackBaseChain.mode('development')
webpackBaseChain.devtool('source-map')

if (isServe) {
    console.log('-----------------')
    serveRun()
} else {
    console.log('=================')
    const compiler = webpack(
        webpackBaseChain.toConfig(),
        function (err, stats) {
            if (err) {
                throw err
            }
            // console.log(stats)
            console.log('\n开发环境打包完成\n')
        }
    )
}

export { webpackBaseChain }
