const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = (env, argv) => ({
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        chunkFilename: 
            argv.mode === 'production' ? 'js/[chunkhash].[id].chunk.js' : 'js/[id].chunk.js',
        filename: 
            argv.mode === 'production' ? 'js/[name].[chunkhash].js' : 'js/[name].js'
    },
    devtool: 'source-map',
    plugins: [
        argv.mode === 'production' ? new CleanWebpackPlugin() : new CleanWebpackPlugin({dry: true}), 
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: 
                argv.mode === 'production' ? 'css/[name].[contenthash].css' : 'css/[name].css'
        }),  
        new WebpackMd5Hash(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
        watchContentBase: true,
        progress: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(css|scss)$/,
                use:  [
                    'style-loader', 
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'media'
                    }
                }
            },
        ]
    }

});
/*
var config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[hash].main.js'
    },
  };
  
  module.exports = (env, argv) => {
  
        config.module = {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use:  ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: ['file-loader']
                },
            ]
        };

        config.devServer = {
            contentBase: path.join(__dirname, 'public'),
            compress: true,
            port: 3000,
            watchContentBase: true,
            progress: true,
            open: true
        };

        config.plugins =[
            new HtmlWebpackPlugin({
                template: 'public/index.html'
            }),
            new MiniCssExtractPlugin({filename: '[hash].style.css'}),
            argv.mode === 'production' ? new MinifyPlugin({}, {comments: false}) : null    
        ]
  
    if (argv.mode === 'production') {
      //...
    }
  
    return config;
  };*/