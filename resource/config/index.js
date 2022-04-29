// see http://vuejs-templates.github.io/webpack for documentation.
const path = require("path");

const outputDirName = process.env.CDN_HOST
  ? process.env.CDN_HOST.split("://")[1]
  : "www";

// 币发BIFA 500015
const domain = "https://yb01.66boxing.com/";
// Beta 100003
// const domain = "https://ybbe1.777vendor.com/";
// Demo 69
// const domain = 'https://yb0t.66relish.com/';
// Prod 67
// const domain = "https://bf0168q.com/";

// 泡泡 500035
// const domain = "https://sgtt.66boxing.com/";
// Beta 100009
// const domain ="https://sg.66apples.com";
// Demo 81
// const domain = 'https://sgt.66relish.com/';
// Prod 80
// const domain = "https://pmlvpdep.com/";

// 澳博国际 QA 9999894
// const domain = "https://auqa1.66boxing.com/";
// const domain = "https://952t.66boxing.com/";
// Beta
// const domain = "";
// Demo 93
// const domain = "https://aude1.688lg.com/";
// Prod 92
// const domain = "https://7959vip001.com/";

// 51体育 QA 9999905
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
    assetsRootBase: path.resolve(__dirname, "../../www"), //如果直接 yarn build 會打包在這個目錄底下
    assetsRoot: path.resolve(__dirname, `../../${outputDirName}`),
    assetsSubDirectory: "static/js", //進一步指定資料夾 (www/static/js)
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
    assetsPublicPath: "/", //代表打包后，index.html里面引用资源的的相对地址
    proxyTable: {
      //發送請求有兩種
      //1. golang，axios 有完整的域名http://... 就是向該域名發送請求，有後續的展開
      //
      //2.0順序 ('/conf/domain') 找到'/conf' -> 找到'/conf'.target(是一組domain(https://yb01.66boxing.com/這邊就進到enginx了) -> 再進到nginx找 endpoint'/conf/domain'
      //2.1 "/conf/domain" (以bifa為例)(開發環境下)
      //    1.找到dev.porxyTable.['conf'].target 的domain // https://yb01.66boxing.com/  (是一個nginx伺服器)
      //    2.連到該domain的nginx伺服器（ 可以看檔案 dev-server.js 裡面搜尋 app.use(proxyMiddleware(options.filter || context, options));）
      //    3.對endpoint '/conf/domain' 回應 {"domain":"500015", "site": "porn1"} （可以看note/幣發nginx文件)
      //   ps.如果是nginx沒有設的endpoint 就會走本地的路徑 (ex./static 是本地的圖片資料夾)
      //
      //2.2 除了dev 會需要用到這個方式 (因為是devsever 會是localhost:8787)
      //    1.其他情況(舉例bifa測試站)，發送請求為https://yb01.66boxing.com/conf/domain 就不會經過proxytable了(本來就在nginx了)

      "/api": {
        target: domain, // 传递给http(s)请求的对象
        changeOrigin: true, // 是否将主机头的源更改为目标URL
        ws: true, // 是否代理websocket
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
        //pathRewrite 的作用為：當"/conf"僅作為key值專接後並非實際endpoint接口時（e.g. 開發接口:https://localhost:8787/conf/domain 實際nginx的目的接口為 https://yb01.66boxing.com/domain）(/conf僅為替換用途)
        //實際情形在本專案 https://localhost:8787/conf/domain 就是對應到 https://yb01.66boxing.com/conf/domain ，“所以用不到pathRewrite”
        // pathRewrite: {
        // "^/conf": "/conf" // 这种接口配置出来     http://XX.XX.XX.XX:8083/conf/login
        // "^/conf": "/" //这种接口配置出来     http://XX.XX.XX.XX:8083/login
        // }
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
