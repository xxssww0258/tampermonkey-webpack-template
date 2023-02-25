import webpack from 'webpack'
import { webpackBaseChain } from './webpack.base'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import TerserPlugin from 'terser-webpack-plugin'

webpackBaseChain
    .mode('production')
    .optimization.minimizer('TerserPlugin')
    .use(TerserPlugin)
    .tap((args) => [
        ...args,
        {
            terserOptions: {
                format: {
                    comments: true,
                },
                // test: /webpackBootstrap/i,
                // exclude:/^main.user.js/
            },
        },
    ])
    .end()

// 判断是否有--report
if (process.env.npm_config_report) {
    webpackBaseChain.plugin('build-analyzer-plugin').use(BundleAnalyzerPlugin)
}

webpack(webpackBaseChain.toConfig(), function (err) {
    if (err) {
        console.log(err)
    }
    console.log('\n生产环境打包完成\n')
})
