import webpack, { Configuration } from 'webpack'
import path from 'path'
import { PORT, META_STRING, isServe, MONKEY_EXT } from './index'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Chain from 'webpack-chain'
import { useVueRule } from './vue-rules'
import { useReactRule } from './react-rules'

export const webpackBaseChain = new Chain()
interface EntryArray {
    [index: string]: string[]
}
export const entry: EntryArray = {
    main: [path.resolve(__dirname, '../src/js-main.ts')],
    reactMain: [path.resolve(__dirname, '../src/react-main.tsx')],
    vueMain: [path.resolve(__dirname, '../src/vue-main.ts')],
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

// 根据文件名生成url
export function generateScriptUrl(filenames: string[]): string[] {
    return filenames.map((filename) => `http://localhost:${PORT}/${filename}`)
}

// 根据url生产@require的 油猴元数据
export function generateMetaBanner(filenames: string[]): string {
    let newMetaStr = META_STRING
    if (isServe) {
        filenames.map((filename) => {
            newMetaStr += `// @require      ${filename}\n`
        })
    }
    newMetaStr += '// ==/UserScript==\n'
    return newMetaStr
}

// webpack-chain 不支持 webpack5 部分api用还是得用对象控制
export function useBaseRule(webpackConfig: Configuration) {
    if (webpackConfig.output) {
        webpackConfig.output.clean = true
    }
    if (webpackConfig.optimization) {
        webpackConfig.optimization.splitChunks = false
    }
    webpackConfig.module?.rules?.push({
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/inline',
    })
}

webpackBaseChain.output
    .filename('[name].user.js')
    .path(path.resolve(__dirname, '../dist'))
    .publicPath('/')
    .end()

webpackBaseChain.module
    .rule('js')
    .test(/\.(js|jsx|ts|tsx)$/i)
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .end()

webpackBaseChain.module
    .rule('css')
    .test(/\.sc?ss$/i)
    .exclude.add(/node_modules/)
    .end()
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

webpackBaseChain.optimization.runtimeChunk(false)

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
            banner: generateMetaBanner(
                generateScriptUrl(getBuildedEntryFilename())
            ),
            raw: true,
            entryOnly: true,
        },
    ])
    .end()

// vue规则，看情况引入
useVueRule(webpackBaseChain)

// react规则
// 需要安装对应的类型库 npm install -D @types/react @types/react-dom
useReactRule(webpackBaseChain)
