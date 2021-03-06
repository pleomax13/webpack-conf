'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostcssSafeParser = require('postcss-safe-parser');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            chunkFilename: 
                isProd ? 'js/[name].[chunkhash:8].chunk.js' : 'js/[name].chunk.js',
            filename: 
                isProd ? 'js/[name].[chunkhash:8].js' : 'js/main.js',
            devtoolModuleFilenameTemplate:  
                isProd ?
                info => path.relative('src', info.absoluteResourcePath).replace(/\\/g, '/') :
                info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
        },
        devtool: isProd ? 'source-map' : 'cheap-module-source-map',
        plugins: [
            isProd ? new CleanWebpackPlugin() : new CleanWebpackPlugin({dry: true}), 
            new HtmlWebpackPlugin({
                template: 'public/index.html',
                filename: 'index.html',
                inject: true,
                minify: isProd ?
                {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                } : undefined
            }),
            new MiniCssExtractPlugin({
                filename: 
                    isProd ? 'css/[name].[contenthash:8].css' : 'css/[name].css'
            }),  
            new WebpackMd5Hash(),
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
            }),
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                exclude: [/\.map$/, /asset-manifest\.json$/],
                skipWaiting: true,
                navigateFallback: '/index.html',
                navigateFallbackBlacklist: [
                    new RegExp('^/_'),
                    new RegExp('/[^/]+\\.[^/]+$'),
                ],
            }),
            new CopyPlugin([
                {
                  from: 'public',
                  ignore: ['*.html']
                },
              ]),
        ],
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            compress: true,
            port: 3030,
            watchContentBase: true,
            progress: true,
            open: true
        },
        optimization: {
            minimizer: [new TerserPlugin({
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    output: {
                    comments: false
                    },
                },
                cache: true
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: PostcssSafeParser,
                    map: {
                        inline: false,
                        annotation: true,
                    }
                }
            })],
            splitChunks: {
                chunks: 'all',
                //name: false,
            },
            runtimeChunk: true
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
                        {
                            loader: 'style-loader',
                            options: {
                                sourceMap: isProd
                            }
                        }, 
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../'
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isProd
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('postcss-preset-env')({
                                        stage: 3
                                    }),
                                ],
                                sourceMap: isProd
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                //sourceMap: isProd,
                            }
                        },
                    ]
                },
                {
                    exclude: [/\.(js|mjs|jsx|ts|tsx|css|scss|sass)$/, /\.html$/, /\.json$/],
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'media/[name].[hash:8].[ext]'
                        }
                    }
                },
            ]
        }

}}