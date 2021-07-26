const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const glob = require('glob')

const path = require('../utils/path') // 提前预设的 path 路径
const config = require('./config') // 多页面的配置项
let HTMLPlugins = []
let Entries = {}

// 入口文件自动生成
config.HTMLDirs.forEach(item => {
    let filename = `${item.page}.html`
    if (item.dir) filename = `${item.dir}/${item.page}.html`
    const htmlPlugin = new HTMLWebpackPlugin({
        title: item.title, // 生成的html页面的标题
        filename: filename, // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
        template: path.src('/template/index.html'), // 模板文件，不同入口可以根据需要设置不同模板
        chunks: [item.page, 'vendor'] // html文件中需要要引入的js模块，这里的 vendor 是webpack默认配置下抽离的公共模块的名称
    })
    HTMLPlugins.push(htmlPlugin)
    Entries[item.page] = path.src(`/pages/${item.page}/index.js`) // 根据配置设置入口js文件
})

let _entry = {}
const mainEntryPathArray = glob.sync(path.src_pages('./**/main.entry.js'))
const pagesPath = path.src_pages()
mainEntryPathArray.forEach(mainEntryPath => {
    const key = mainEntryPath.replace(pagesPath, '').replace(/\.js$/, '');
    _entry[key] = [mainEntryPath] // ['公共css', mainEntryPath]
})


const env = process.env.NODE_ENV.trim()
let ASSET_PATH = '/' // dev 环境
if (env === 'prod') ASSET_PATH = '//abc.com/static/' // build 时设置成实际使用的静态服务地址

module.exports = {
    entry: Entries,
    output: {
        publicPath: ASSET_PATH,
        filename: 'js/[name].[hash:8].js',
        path: path.root('/dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/, // 处理vue模块
                use: 'vue-loader'
            },
            {
                test: /\.js$/, //处理es6语法
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        // 设置模块如何被解析
        alias: {
            '@components': path.src('components'),
            '@styles': path.src('styles'),
            '@assets': path.src('assets'),
            '@commons': path.src('commons'),
            '@mixins': path.src('pages/page.js'),
            '@vuex': path.src('store')
        },
        extensions: ['*', '.css', '.js', '.vue']
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.src('public'),
                to: path.root('dist'),
                ignore: ['*.html']
            },
            {
                from: path.src('scripts/lib'),
                to: path.root('dist')
            }
        ]),
        ...HTMLPlugins, // 利用 HTMLWebpackPlugin 插件合成最终页面
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH) // 利用 process.env.ASSET_PATH 保证模板文件中引用正确的静态资源地址
        })
    ]
}
