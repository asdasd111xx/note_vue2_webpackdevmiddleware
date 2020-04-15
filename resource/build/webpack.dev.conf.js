const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: [
            {
                // test: /\.(js|vue)$/,
                // loader: 'eslint-loader',
                // enforce: "pre",
                // include: [resolve('src')],
                // options: {
                //     formatter: require('eslint-friendly-formatter'),
                //     emitWarning: true
                // }
            }]
    },
    mode: 'development',
    // cheap-module-eval-source-map is faster for development
    devtool: '#source-map',
    plugins: [
        // new BundleAnalyzerPlugin(),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     'root.jQuery': 'jquery'
        // }),
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            chunksSortMode: 'none'
        }),
        new HtmlWebpackTagsPlugin({
            tags: [
                'public/js/jquery-3.3.1.min.js',
                'public/js/semantic-2.2.12.min.js',
                'public/js/jquery.cloud9carousel.js',
                { path: '//g.alicdn.com/sd/ncpc/nc.js?t=', type: 'js', attributes: { charset: 'utf-8' } }
            ],
            append: false,
            hash: true
        }),
        new FriendlyErrorsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
});
