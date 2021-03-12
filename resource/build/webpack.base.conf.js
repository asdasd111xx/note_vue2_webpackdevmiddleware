var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var utils = require('./utils');
var config = require('../config');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 1
  }
};

const cssModulesLoader = JSON.parse(JSON.stringify(cssLoader));
cssModulesLoader.options.modules = {
  localIdentName: '[local]__[hash:base64:5]'
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })]
  }
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    prependData: `$buildTimestamp: ${config.build.env.TIMESTAMP};`
  }
};

const miniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    // only enable hot in development
    hmr: process.env.NODE_ENV === 'development',
    // if hmr does not work, this is a forceful method.
    reloadAll: true
  }
};

const plugins = [new VueLoaderPlugin()];

const enableMiniCssExtract =
  process.env.NODE_ENV === 'production' || process.env.DEV_MINI_CSS_EXTRACT;
if (enableMiniCssExtract) {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    })
  );
}

const mainCssLoader = enableMiniCssExtract
  ? miniCssExtractPluginLoader
  : 'vue-style-loader';

module.exports = {
  entry: {
    app: [
      process.env.NODE_ENV === 'development'
        ? './src/main.js'
        : './src/cdn-entry-index.js'
    ]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[id].[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [resolve('src'), resolve('node_modules')],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      assets: resolve('src/assets'),
      components: resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          configFile: resolve('babel.config.js'),
          comments: process.env.NODE_ENV !== 'production'
        },
        include: [resolve('src'), resolve('node_modules')],
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.css$/,
        oneOf: [
          // this matches `<style module>`
          {
            resourceQuery: /module/,
            use: [mainCssLoader, cssModulesLoader, postcssLoader]
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
