import Chain from 'webpack-chain'
export function useReactRule(webpackChain: Chain) {
    webpackChain.externals(
        Object.assign(
            {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
            webpackChain.get('externals')
        )
    )

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
}
