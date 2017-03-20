var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var _ = require('lodash');

// add production plugins
webpackConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: true
        }
    })
);

// remove the loader where the element test exist and match 'scss'
_.remove(webpackConfig.module.rules, function (loader) {
    return loader.test && loader.test.toString() == /\.scss$/;
});

// add the new scss loaders
webpackConfig.module.rules.push(
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
            {
                fallback: "style-loader",
                use: "css-loader?minimize!sass-loader"
            }
        )
    }
);

module.exports = webpackConfig;