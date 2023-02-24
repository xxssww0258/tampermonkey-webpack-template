import webpack, { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import { webpackBaseConfig } from './webpack.base'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import TerserPlugin from 'terser-webpack-plugin'

const webpackProdConfig: Configuration = merge(
    {
        mode: 'production',
        devtool: false,
        optimization: {
            // minimize:false,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: true,
                        },
                    },
                    // test: /webpackBootstrap/i,
                    // exclude:/^main.user.js/
                }),
            ],
            // // runtimeChunk:true,
        },
        plugins: [],
    },
    webpackBaseConfig
)
// 判断是否有--report
if (process.env.npm_config_report) {
    webpackProdConfig.plugins?.push(new BundleAnalyzerPlugin())
}

webpack(webpackProdConfig, function (err) {
    if (err) {
        console.log(err)
    }
    console.log('\n生产环境打包完成\n')
})
