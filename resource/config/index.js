// see http://vuejs-templates.github.io/webpack for documentation.
const path = require("path");

const outputDirName = process.env.CDN_HOST
  ? process.env.CDN_HOST.split("://")[1]
  : "www";

// 鸭博娱乐
//const domain = "https://yb01.66boxing.com/";
// Demo
// const domain = 'https://yb0t.66relish.com/';
// Prod
// const domain = 'https://yaboxxxapp01.com/';
// const domain = 'https://yaboxxxapp02.com/';

// Beta
// const domain = 'https://ybbe1.qghco.com/';
// const domain = 'https://yb0t.66apples.com';

// 亿元
const domain = "https://eyt.66boxing.com/";
// Demo
// const domain = 'https://eyd.688lg.com/';
// const domain = 'https://ey01.66poo.com/';
// Prod
// const domain = 'https://ey02.66poo.com/';
// const domain = 'https://ey6999.com/';
// const domain = 'https://ey0099.com/';
// const domain = 'https://ey8866.com/';
// const domain = 'https://ey.688lg.com/';

// Beta
// const domain = 'https://ey01.66boxing-beta.com/';
// const domain = 'https://eyd.66apples.com/';

module.exports = {
  build: {
    env: require("./prod.env"),
    index: path.resolve(__dirname, `../../${outputDirName}/index.html`),
    assetsRootBase: path.resolve(__dirname, "../../www"),
    assetsRoot: path.resolve(__dirname, `../../${outputDirName}`),
    assetsSubDirectory: "static/js",
    assetsPublicPath: `${process.env.CDN_HOST}/`,
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require("./dev.env"),
    port: 8787,
    transportMode: "ws",
    autoOpenBrowser: true,
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {
      // 可於自己開發時改換但不要蓋紀錄
      // '/ubb': {
      //     target: 'https://yaboxxxapp01.com/',
      //     changeOrigin: true,
      //     secure: false
      // },
      // '/static': {
      //     target: 'https://yaboxxxapp01.com/',
      //     changeOrigin: true,
      //     secure: false
      // },
      // '/i18n': {
      //     target: 'https://yaboxxxapp01.com/',
      //     changeOrigin: true,
      //     secure: false
      // },
      // '/checkinfo': {
      //     target: 'https://yaboxxxapp01.com/',
      //     changeOrigin: true,
      //     secure: false
      // },
      "/api": {
        target: domain,
        changeOrigin: true,
        ws: true,
        secure: false
        // onProxyRes(proxyRes, req, res) {
        //     RD5 如果要看 cookie，就解放下面這行就可以了
        //     console.log('req.hesders.cookie :', req.headers.cookie);
        // }
      },
      "/tpl": {
        //  開發測試用
        // target: 'http://pineapple.vir888.net',
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/cdn": {
        //  開發測試用
        // target: 'http://pineapple.vir888.net',
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/payment": {
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/conf": {
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/qybtv": {
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/exsport": {
        target: domain,
        changeOrigin: true,
        secure: false
      }
    },
    cssSourceMap: false
  }
};
