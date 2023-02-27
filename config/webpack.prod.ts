import webpack from 'webpack'
import { useBaseRule, webpackBaseChain } from './webpack.base'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import TerserPlugin from 'terser-webpack-plugin'

webpackBaseChain
    .mode('production')
    .optimization.minimizer('TerserPlugin')
    .use(TerserPlugin)
    .tap((args) => [
        ...args,
        {
            parallel: true,
            terserOptions: {
                format: {
                    comments: /(UserScript|@).+?[^\n]$/i,
                },
            },
        },
    ])
    .end()

// 判断是否有--report
if (process.env.npm_config_report) {
    webpackBaseChain.plugin('build-analyzer-plugin').use(BundleAnalyzerPlugin)
}
const webpackConfig = webpackBaseChain.toConfig()
useBaseRule(webpackConfig)

webpack(webpackConfig, function (err) {
    if (err) {
        throw err
    }
    console.log('\n生产环境打包完成\n')
})
