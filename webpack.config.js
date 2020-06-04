const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    name: 'mountup',
    entry: {
        index: './src/scripts/mountup.js'
    },
    mode: 'development',
    devtool: 'source-map',
    output: {
        publicPath: 'modules/mountup/scripts/',
        filename: 'mountup.js',
        chunkFilename: 'bundles/[name].[chunkhash:4].js',
        path: path.resolve(__dirname, 'dist/scripts/'),
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};