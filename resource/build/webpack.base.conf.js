var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
var utils = require("./utils");
var config = require("../config");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const cssLoader = {
  loader: "css-loader",
  options: {
    importLoaders: 1
  }
};

const cssModulesLoader = JSON.parse(JSON.stringify(cssLoader)); // 深拷贝console.log(cssLoader===JSON.parse(JSON.stringify(cssLoader))) #false
cssModulesLoader.options.modules = {
  localIdentName: "[local]__[hash:base64:5]"
};

const postcssLoader = {
  //use:[css-loader,postcssLoader]先用postcssLoader對css做兼容性處理，在透過css-loader添加到main.js (透過autoprefixer 指定browsers["last 2 versions"] 指定為最近的兩個版本)
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")({ browsers: ["last 2 versions"] })]
  }
};

console.log("process.env.assetsVariablePath: ", process.env.assetsVariablePath);
const sassLoader = {
  loader: "sass-loader",
  options: {
    // prependData: process.env.assetsVariablePath
  }
};

const miniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    // only enable hot in development
    hmr: process.env.NODE_ENV === "development",
    // if hmr does not work, this is a forceful method.
    reloadAll: true
  }
};

const plugins = [new VueLoaderPlugin()];

const enableMiniCssExtract =
  process.env.NODE_ENV === "production" || process.env.DEV_MINI_CSS_EXTRACT;
if (enableMiniCssExtract) {
  plugins.push(
    new MiniCssExtractPlugin({
      //1.css-loader將css檔整合到js 2.MiniCssExtractPlugin在把js中的css轉為獨立的css
      filename: utils.assetsPath("css/[name].[contenthash].css") //會輸出到localhost:8000/static/css/[name].[contenthash].css
    })
  );
}

const mainCssLoader = enableMiniCssExtract
  ? miniCssExtractPluginLoader
  : "vue-style-loader";

module.exports = {
  entry: {
    //指定chunk的名稱
    app:
      process.env.NODE_ENV === "development"
        ? ["./src/a.js"] //HMR加入"webpack-hot-middleware/client"
        : ["./src/cdn-entry-index.js"]
  },
  output: {
    path: config.build.assetsRoot, //儲存你所有輸出檔案的本地檔案目錄。（絕對路徑）
    filename: "[name].js", //打包後的名稱([name] (對應到entry的key(app)) )
    chunkFilename: "[id].[name].js", //分開打包
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath // `${process.env.CDN_HOST}/`
        : config.dev.assetsPublicPath //"/"
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    modules: [resolve("src"), resolve("node_modules")],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
      assets: resolve("src/assets"),
      components: resolve("src/components")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          configFile: resolve("babel.config.js"),
          comments: process.env.NODE_ENV !== "production"
        },
        include: [resolve("src"), resolve("node_modules")],
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.css$/,
        oneOf: [
          // this matches `<style module>`
          {
            resourceQuery: /module/,
            use: [mainCssLoader, cssModulesLoader, postcssLoader] //use的引入順序是從最後一個開始
          },
          // this matches plain `<style>` or `<style scoped>`
          {
            use: [mainCssLoader, cssLoader, postcssLoader]
          }
        ]
      },
      {
        test: /\.scss$/,
        oneOf: [
          // this matches `<style module>`
          {
            resourceQuery: /module/,
            use: [mainCssLoader, cssModulesLoader, sassLoader]
          },
          // this matches plain `<style>` or `<style scoped>`
          {
            use: [mainCssLoader, cssLoader, sassLoader]
          }
        ]
      }
    ]
  },
  plugins
};
