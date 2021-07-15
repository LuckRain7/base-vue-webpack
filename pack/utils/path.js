/*
 * Love and Peace
 * 基础路径配置
 */

let path = require('path')
let isDev = process.env.NODE_ENV === 'development'

module.exports = {
    isDev: isDev,
    fixPath(_path) {
        return _path && (_path = (/^\.\//.test(_path) ? '' : './') + _path)
    },

    // 设置项目 root 目录地址
    root(_add_path_ = '') {
        let _root = path.resolve(__dirname, '../..')
        // 根据 root 目录向下进行拼接
        // /^\.\//.test(_add_path_) 判断是否为 ./ 开头 默认都是 root 目录进行向下寻找
        return path.resolve(_root, this.fixPath(_add_path_))
    },

    app(_path = '') {
        return path.resolve(this.root('./app'), this.fixPath(_path))
    },

    src(_path = '') {
        return path.resolve(this.app('./src'), this.fixPath(_path))
    },

    release(_path = '') {
        return path.resolve(this.app('./release'), this.fixPath(_path))
    },

    pack(_path = '') {
        return path.resolve(this.root('./pack'), this.fixPath(_path))
    }
}
