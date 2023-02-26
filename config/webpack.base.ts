import webpack from 'webpack'
import path from 'path'
import { PORT, META_STRING, isServe, MONKEY_EXT } from './index'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Chain from 'webpack-chain'
import { useVueRule } from './vue-rules'

export const webpackBaseChain = new Chain()
interface EntryArray {
    [index: string]: string[]
}
export const entry: EntryArray = {
    reactMain: [path.resolve(__dirname, '../src/react-main.tsx')],
    // vueMain: [path.resolve(__dirname, '../src/vue-main.ts')],
}
// 遍历入口文件
for (const entryName in entry) {
    for (const entryFilePath of entry[entryName]) {
        webpackBaseChain.entry(entryName).add(entryFilePath)
    }
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

// 入口文件通过@require到元数据标签中
export function entryToMetaStr(): string {
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

webpackBaseChain.output
    .clear()
    .filename('[name].user.js')
    .path(path.resolve(__dirname, '../dist'))
    .publicPath('/')
    .end()

webpackBaseChain.module
    .rule('js')
    .test(/\/jsx?$/i)
    .use('babel-loader')
    .loader('babel-loader')
    .end()
    .end()

webpackBaseChain.module
    .rule('ts')
    .test(/\.tsx?$/i)
    .use('ts-loader')
    .loader('ts-loader')
    .options({
        // 关闭类型检测 提交构建速度
        transpileOnly: true,
        // appendTsSuffixTo: [/\.vue$/],
    })
    .end()

webpackBaseChain.module
    .rule('css')
    .test(/\.sc?ss$/i)
    .use('style')
    .loader('style-loader')
    .end()
    .use('css-loader')
    .loader('css-loader')
    .end()
    .use('sass-loader')
    .loader('sass-loader')
    .end()

webpackBaseChain.devtool(false)

webpackBaseChain.resolve.extensions
    .add('.js')
    .add('.ts')
    .add('.tsx')
    .add('.jsx')
    .end()
    .alias.set('@', path.resolve(__dirname, '../src'))
    .end()

webpackBaseChain
    .plugin('html-webpack-plugin')
    .use(HtmlWebpackPlugin, [
        {
            template: path.resolve(__dirname, '../index.html'),
        },
    ])
    .end()

    .plugin('webpack-banner-plugin')
    .use(webpack.BannerPlugin, [
        {
            banner: entryToMetaStr(),
            raw: true,
            entryOnly: true,
        },
    ])
    .end()

// vue规则，看情况引入
// useVueRule(webpackBaseChain)
