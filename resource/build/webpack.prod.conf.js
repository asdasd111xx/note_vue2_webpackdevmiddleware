let path = require('path');
let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

let env = process.env.NODE_ENV === 'testing'
    ? require('../config/test.env')
    : config.build.env;


console.log('[debug]process.env.CDN_HOST:', process.env.CDN_HOST);
let webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    // 出錯後強制退出編譯，避免部署流程發布錯誤的程式
    bail: true,
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('[name].[chunkhash].js'),
        chunkFilename: config.build.bundleAnalyzerReport
            ? utils.assetsPath('[id].[name].[chunkhash].js')
            : utils.assetsPath('[id].[chunkhash].js')
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     $              : "jquery",
        //     jQuery         : "jquery",
        //     'window.jQuery': "jquery",
        //     'root.jQuery'  : "jquery"
        // }),
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing'
                ? 'index.html'
                : config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackTagsPlugin({
            tags: [
                `${process.env.CDN_HOST}/public/js/jquery-3.3.1.min.js`,
                `${process.env.CDN_HOST}/public/js/semantic-2.2.12.min.js`,
                `${process.env.CDN_HOST}/public/js/jquery.cloud9carousel.js`,
                { path: '//g.alicdn.com/sd/ncpc/nc.js?t=', type: 'js', attributes: { charset: 'utf-8' } }
            ],
            publicPath: false,
            append: false,
            hash: true
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        })
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
});

if (config.build.productionGzip) {
    let CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                `\\.(${
                config.build.productionGzipExtensions.join('|')
                })$`
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    const param = {};
    if (process.env.ANALYZER_MODE_STATIC) {
        param.analyzerMode = 'static';
    }
    webpackConfig.plugins.push(new BundleAnalyzerPlugin(param));
}
console.log("[debug]webpack debug ===> ");
console.log("[debug]process.argv:", process.argv);
console.log("[debug]process.env.CDN_HOST:", process.env.CDN_HOST);
console.log("[debug]process.env.NODE_ENV:", process.env.NODE_ENV);
module.exports = webpackConfig;
