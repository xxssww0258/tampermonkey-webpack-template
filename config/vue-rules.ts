import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'
import Chain from 'webpack-chain'

export function useVueRule(webpackChain: Chain) {
    webpackChain.module
        .rule('vue')
        .test(/\.vue$/i)
        .exclude.add(/node_modules/)
        .end()
        .use('vue-loader')
        .loader('vue-loader')
        .end()

    webpackChain.module
        .rule('css')
        .test(/\.sc?ss$/i)
        .exclude.add(/node_modules/)
        .end()
        .use('style')
        .loader('vue-style-loader')
        .end()

    webpackChain.module
        .rule('js')
        .use('babel-loader')
        .loader('babel-loader')
        .options({
            presets: [
                [
                    '@babel/preset-typescript',
                    {
                        isTSX: true,
                        allExtensions: true,
                    },
                ],
            ],
        })

    webpackChain.resolve.extensions.add('.vue')

    webpackChain.externals(
        Object.assign(
            {
                vue: 'Vue',
            },
            webpackChain.get('externals')
        )
    )

    webpackChain.plugin('webpack-define-plugin').use(webpack.DefinePlugin, [
        {
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
        },
    ])

    webpackChain.plugin('vue-loader-plugin').use(VueLoaderPlugin).end()
}
