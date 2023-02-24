import webpack, { Configuration, EntryObject } from 'webpack'
import path from 'path'
import { PORT, META_STRING, isServe, MONKEY_EXT } from './index'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'

export const entry: EntryObject = {
    main: [path.resolve(__dirname, '../src/main.ts')],
}
// 获取构建后的入口文件名
export function getBuildedEntryFilename(): string[] {
    return Object.keys(entry).map((x) => x + `.${MONKEY_EXT}.js`) // ['main.user.js']
}

// 获取构建后的入口文件名url
export function getEntryFilenameUrl(): string[] {
    const filenames = getBuildedEntryFilename()
    return filenames.map(
        (filename) => `http://localhost:${PORT}/meta/${filename}`
    )
}

// 添加js到元数据标签中
export function addJstoMetaStr(): string {
    let newMetaStr = META_STRING
    if (isServe) {
        const filenames = getEntryFilenameUrl()
        filenames
            .map((filename) => filename.replace('/meta', ''))
            .map((filename) => {
                newMetaStr += `// @require      ${filename}\n`
            })
    }
    newMetaStr += '// ==/UserScript==\n'
    return newMetaStr
}

export const webpackBaseConfig: Configuration = {
    entry,
    output: {
        clean: true,
        filename: `[name].${MONKEY_EXT}.js`,
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        library: {
            type: 'global',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {},
                    },
                ],
            },
            {
                test: /\.js$/i,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/i,
                exclude: /node_modules/,
                use: [
                    // 'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            // 关闭类型检测 提交构建速度
                            transpileOnly: true,
                            appendTsSuffixTo: [/\.vue$/],
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    optimization: {
        splitChunks: false,
    },
    // devtool: 'source-map',
    devtool: false,
    resolve: {
        // 自动识别tsx后缀
        extensions: [
            '.vue',
            //   '.tsx',
            '.ts',
            //   '.jsx',
            '.js',
        ],
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
    },
    externals: {
        vue: 'Vue',
    },
    plugins: [
        // 基本配置
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false,
        }),
        new webpack.BannerPlugin({
            banner: addJstoMetaStr(),
            raw: true,
            entryOnly: true,
        }),
        // 没有css相关代码时不要引入，减少体积
        new VueLoaderPlugin(),
    ],
}
