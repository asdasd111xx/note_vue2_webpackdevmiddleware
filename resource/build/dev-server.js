require("./check-versions")(); //檢查 node與npm 版本，錯誤會顯示並退出

var config = require("../config");
process.env.config = config;
if (!process.env.NODE_ENV) {
  //有一種情況是NODE_ENV="testing" ，哪時????
  //為什麼加這個判斷呢????一開始應該本來就沒有才對(還是package.json script{"xx":"--NODE_ENV='dev"}有哪份檔案這邊有傳嗎)
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV); //process.env.NODE_ENV為'develop'
}

let assetsVariablePath = `@import "./src/css/variable/porn1.scss";`;
let buildSite = "";
try {
  process.argv.map(a => {
    if (a.startsWith("--SITE=") || a.startsWith("--site=")) {
      //^^什麼情形????
      buildSite = a.split("=")[1];
      console.log("buildSite: ", buildSite);
      assetsVariablePath = `@import "./src/css/variable/${buildSite}.scss";`;
      console.info("=> build target site:", buildSite);
      console.info("=> import variable scss:", assetsVariablePath);
      return;
    }
  });
  // console.log(process.argv);此屬性返回一個包含在命令行中運行時傳遞給該過程的參數的數組。第一個元素是流程執行路徑，第二個元素是js文件的路徑。
  // [ '/Users/jason_tsai/.nvm/versions/node/v8.17.0/bin/node',
  // '/Users/jason_tsai/project/筆記/resource/build/dev-server.js' ]
} catch (e) {
  //會有什麼例外????
  //在 catch 區塊中可以指定一個參數，這個參數通常稱作 exception 或 catchID。在 catch 區塊中可以辨認這個參數，但離開這個區塊後就無法取得這個變數。透過 catch 可以阻止例外情況繼續向外冒泡，讓整個程式可以繼續執行。
  console.info("=> error:", e);
}

process.env.assetsVariablePath = assetsVariablePath;

var path = require("path"); //路徑的解析工具 在webpack:{output:{}}中設定中會用其來指定輸出位置 //請看path練習

var express = require("express");
var webpack = require("webpack");
var proxyMiddleware = require("http-proxy-middleware");
var webpackConfig = //引入哪份webpack(但build就都是prod)
  process.env.NODE_ENV === "testing" //when????
    ? require("./webpack.prod.conf")
    : require("./webpack.dev.conf");

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port; //port號8000
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser; //反反????
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable;

var app = express();
var compiler = webpack(webpackConfig);

process.env.compiler = compiler;

var devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  stats: "errors-only" //隱藏bundle的terminal訊息
});

var hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: () => {}
});
// force page reload when html-webpack-plugin template changes //!!!!Compiler.plugin 已從 webpack 5 ionic-team/stencil-webpack#8中移除
compiler.plugin("compilation", function(compilation) {
  compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
    hotMiddleware.publish({ action: "reload" });
    cb();
  });
});

// 未來升級 html-webpack-plugin至4.0.0以上時可能會用到，若升級後沒問題即可移除此段
// force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//   HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
//     'DevServerPublishReload', // <-- Set a meaningful name here for stacktraces
//     (data, cb) => {
//       // Manipulate the content
//       hotMiddleware.publish({ action: 'reload' })
//       // Tell webpack to move on
//       cb(null, data)
//     }
//   )
// })

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options)); //理解為幫app裝上proxyMiddleware...的套件
});

// handle fallback for HTML5 history API
app.use(require("connect-history-api-fallback")());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

// 讀取本地 字典檔.圖檔 無需再設定apache
app.use(express.static(path.resolve(__dirname, "../../www")));

var uri = "http://localhost:" + port;

devMiddleware.waitUntilValid(function() {
  console.log("> Listening at " + uri + "\n");
});

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }
});
