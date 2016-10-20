var ExtractTextPlugin = require("extract-text-webpack-plugin");
var paths = (function(){
    var theme = './default-theme/';
    return {
        theme : theme,
        js : theme + 'js/',
        sass : theme + 'sass/',
        dist : theme + 'dist/',
        fonts : '../fonts/omnes/'
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
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }

        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin(paths.dist + "[name].css")
    ]
};