let path = require('path')
let bDev = process.env.NODE_ENV === 'development'

console.log(process.env.NODE_ENV, '')

module.exports = {
    isDev: bDev,
    root(sPath = '') {
        let sRoot = path.resolve(__dirname, '../..')
        sPath && (sPath = (/^\.\//.test(sPath) ? '' : './') + sPath)
        return path.resolve(sRoot, sPath)
    },
    app(sPath = '') {
        let that = this
        return path.resolve(that.root('./app'), sPath)
    },
    src(sPath = '') {
        let that = this
        return path.resolve(that.app('./src'), sPath)
    },
    release(sPath = '') {
        let that = this
        return path.resolve(that.app('./release'), sPath)
    },
    pack(sPath = '') {
        let that = this
        let sRoot = that.root('./pack')
        return path.resolve(sRoot, sPath)
    }
}
