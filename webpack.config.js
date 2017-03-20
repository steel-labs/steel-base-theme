var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

var paths = (function(){
    var theme = './default-theme/';
    return {
        theme : theme,
        js : theme + 'js/',
        sass : theme + 'sass/',
        dist : theme + 'dist/'
    }
})();

module.exports = {
    entry: {
        main: ['babel-polyfill', paths.js + 'main.js'],
        screen: paths.sass + 'screen.scss'
    },
    output: {
        filename: paths.dist + '[name].js'
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-1']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    {
                        fallback: "style-loader",
                        use: "css-loader!sass-loader"
                    }
                )
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin(paths.dist + "[name].css"),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Cookies: 'js-cookie'
        })
    ]
};