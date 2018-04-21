var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        front: './src/front.js',
        admin: './src/admin.js',
    },
    output: {
        path: path.resolve(__dirname, './front'),
        publicPath: '/',
        filename: 'assets/js/[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            chunks: ['front'],
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            chunks: ['admin'],
            filename: 'admin/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
            }
        }),
        new CopyWebpackPlugin([
            { from: 'src/.htaccess', to: '' },
            { from: 'src/.htaccess', to: 'admin/' }
        ])
    ],
    module: {
        rules: [
        {
            test: /\.css$/,
            use: [
            'vue-style-loader',
            'css-loader'
            ],
        },
        {
            test: /\.scss$/,
            use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
            ],
        },
        {
            test: /\.sass$/,
            use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader?indentedSyntax'
            ],
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
            loaders: {
                // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                // the "scss" and "sass" values for the lang attribute to the right configs here.
                // other preprocessors should work out of the box, no loader config like this necessary.
                'scss': [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
                ],
                'sass': [
                'vue-style-loader',
                'css-loader',
                'sass-loader?indentedSyntax'
                ]
            }
            // other vue-loader options go here
            }
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
            name: '[name].[ext]?[hash]'
            }
        }
        ]
    },
    resolve: {
        alias: {
        'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
    }

    if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = false // '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
        }),
        new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false
        }
        }),
        new webpack.LoaderOptionsPlugin({
        minimize: true
        })
    ])
}
