import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import dateFormat from 'dateformat';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import {fileURLToPath} from 'url';
import webpack from 'webpack';
import _package from './package.json' assert {type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const now = new Date();
const timestamp = dateFormat(now, 'isoDateTime');
const year = dateFormat(now, 'yyyy');

const commonPlugins = [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({
        banner: `@license ${_package.name} v${_package.version}, ${timestamp}
(c) ${year} ${_package.author.name} <${_package.author.email}>
License: ${_package.license}`
    })
];

const commonRules = [
    {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }]
    },
    {
        test: /\.html$/,
        use: [{
            loader: 'html-loader',
            options: {
                minimize: true
            }
        }]
    }
];

export default [
    {
        plugins: commonPlugins.concat([
            new MiniCssExtractPlugin({
                filename: 'core-layout.css',
            })
        ]),
        name: 'library',
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        //mode: 'development',
        entry: './src/lib/core-layout.js',
        output: {
            path: path.resolve(__dirname, 'dist/lib'),
            filename: 'core-layout.js',
            library: 'coreLayout',
            libraryTarget: 'umd'
        },
        module: {
            rules: commonRules.concat([
                {
                    test: /\.(sa|sc|c)ss$/,
                    /* Exclude fonts while working with images, e.g. .svg can be both image or font. */
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: '../scss/'
                            }
                        },
                    ]
                }
            ]),
        },
        externals: {
            lodash: {
                commonjs: 'lodash',
                commonjs2:
                    'lodash',
                amd:
                    'lodash',
                root:
                    '_',
            }
            ,
            angular: {
                commonjs: 'angular',
                commonjs2:
                    'angular',
                amd:
                    'angular',
                root:
                    'angular',
            }
            ,
            'angular-iscroll': {
                commonjs: 'angular-iscroll',
                commonjs2:
                    'angular-iscroll',
                amd:
                    'angular-iscroll',
                root:
                    'angular-iscroll',
            }
        },
    },
    {
        plugins: commonPlugins.concat([
            new HtmlWebpackPlugin({
                template: 'src/examples/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css',
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new LodashModuleReplacementPlugin,
        ]),
        name: 'examples',
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        //mode: 'development',
        entry: './src/examples/app.js',
        output: {
            path: path.resolve(__dirname, 'dist/examples'),
            filename: '[name].[contenthash].js'
        },
        optimization: {
            splitChunks: {
                //chunks: 'all',
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        // cacheGroupKey here is `commons` as the key of the cacheGroup
                        name(module, chunks, cacheGroupKey) {
                            const moduleFileName = module.identifier().split('/').reduceRight(item => item);
                            const allChunksNames = chunks.map((item) => item.name).join('~');
                            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                        },
                        chunks: 'all'
                    }
                }
            },
        },
        devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
        devServer: {
            static: './dist/examples',
        },
        module: {
            rules: commonRules.concat([
                {
                    test: /\.(sa|sc|c)ss$/,
                    /* Exclude fonts while working with images, e.g. .svg can be both image or font. */
                    exclude: /node_modules/, //path.resolve(__dirname, '../src/assets/fonts'),
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                        },
                    ]
                },
                {
                    test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 50000,
                                mimetype: 'application/font-woff',
                                name: 'fonts/[name].[ext]',
                                fallback: 'file-loader'
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[contenthash].[ext]'
                            }
                        }
                    ]
                },

            ])
        }
    }
];
