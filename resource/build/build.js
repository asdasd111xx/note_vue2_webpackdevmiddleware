require('./check-versions')()

process.env.NODE_ENV = 'production'
// 跑建置腳本時 第一個接在build.js後的值為cdn_host ex: node build.js https://xxx.cdn.com

process.env.CDN_HOST = process.argv[2] || ''
console.log(process);
console.log(process.argv);
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var copy = require('recursive-copy');

var spinner = ora('building for production...')
spinner.start()

// 根據帶入腳本的CDN_HOST去複製output資料夾
function copyCDNOutput(callback) {
  if (!process.env.CDN_HOST) {
    return callback()
  }

  copy(config.build.assetsRootBase, config.build.assetsRoot, function (err) {
    if (err) throw err
    callback()
  })
}

copyCDNOutput(function (err) {
  if (err) throw err
  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      // 出錯後強制退出編譯，避免部署流程發布錯誤的程式
      if (stats.hasErrors()) {
        // 在GCP上直接exit會導致log無法寫完，等待10秒讓log寫完後再退出編譯
        setTimeout(() => process.exit(2), 10000);
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
})
