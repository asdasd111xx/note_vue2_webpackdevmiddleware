// see http://vuejs-templates.github.io/webpack for documentation.
const path = require("path");

const outputDirName = process.env.CDN_HOST
  ? process.env.CDN_HOST.split("://")[1]
  : "www";

// 币发BIFA 500015
// const domain = "https://yb01.66boxing.com/";
// Beta 100003
// const domain = "https://ybbe1.777vendor.com/";
// Demo 69
// const domain = 'https://yb0t.66relish.com/';
// Prod 67
// const domain = "https://bf0168q.com/";

// 亿元 500023
// const domain = "https://eyt.66boxing.com/";
// Beta 100004
// const domain = 'https://eyd.66apples.com/';
// Demo 74
// const domain = 'https://eyd.688lg.com/';
// const domain = 'https://ey01.66poo.com/';
// Prod 41
// const domain = 'https://ey6999.com/';
// const domain = "https://ey0099.com/";
// const domain = 'https://ey8866.com/';
// const domain = 'https://ey.688lg.com/';

// 泡泡 500035
// const domain = "https://sgtt.66boxing.com/";

// Beta 100009
// const domain ="https://sg.66apples.com";

// Demo 81
// const domain = 'https://sgt.66relish.com/';
// Prod 80
const domain = "https://5lpet08l.com/";

// 澳博国际 QA 9999894
//const domain = "https://auqa1.66boxing.com/";
// const domain = "https://952t.66boxing.com/";
// Beta
// const domain = "";
// Demo 93
// const domain = "https://aude1.688lg.com/";
// Prod 92
// const domain = "https://7959vip001.com/";

// 51国际 QA 9999905
// const domain = "https://spqa1.66boxing.com/";
// Beta
// const domain = "";
// Demo 95
// const domain = "https://spde1.688lg.com/";
// Prod 94
// const domain = "https://5151vip21.com/";

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
      "/conf": {
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/exsport": {
        target: domain,
        changeOrigin: true,
        secure: false
      },
      "/getcid": {
        target: domain,
        changeOrigin: true,
        secure: false
      }
    },
    cssSourceMap: false
  }
};
