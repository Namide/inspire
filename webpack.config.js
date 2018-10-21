var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var WebpackCleanPlugin = require('webpack-clean')
var MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = function(env, argv) {

    var prod = env.production === true

    return {

        // Webpack optimizations
        mode: prod ? 'production' : 'development',
        devtool: prod ? '' /*'source-maps'*/ : 'eval',

        // Export 2 builds (for admin and public)
        entry: {
            build: './src/main.js',
            // admin: './src/admin.js',
        },

        // Export js builds in the dist/assets/js/ dir
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: 'assets/js/[name].js'
        },

        plugins: [

            // Optimize index.html file
            new HtmlWebpackPlugin({
                template: prod ? 'src/index.php' : 'src/index.html',
                inject: !prod,
                filename: prod ? 'index.php' : 'index.html',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true
                }
            }),

            // Copy .htaccess from src/ to dist/
            new CopyWebpackPlugin([
                { from: 'api', to: 'api', ignore: ['nbproject/**/*', 'config.php', 'data/**/*'] },
                { from: 'src/.htaccess' }
            ]),

            ...(prod ? [
                // Extract CSS code from js builds
                new MiniCssExtractPlugin({
                    filename: 'assets/css/[name].css',
                }),

                // new UglifyJsPlugin()
                new MinifyPlugin({
                    removeConsole: true,
                    removeDebugger: true
                }, {
                    comments: false,
                    // sourceMap: false
                })

            ] : [ ])
        ],

        module: {
            rules: [
            {
                test: /\.css$/,
                use: [
                    ...(prod ? [MiniCssExtractPlugin.loader] : ['style-loader']),
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    ...(prod ? [MiniCssExtractPlugin.loader] : ['style-loader']),
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    ...(prod ? [MiniCssExtractPlugin.loader] : ['style-loader']),
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    // presets: ["transform-object-rest-spread"],// ['@babel/preset-env'],
                    plugins: [["@babel/plugin-transform-react-jsx", { "pragma": "h" }], "transform-object-rest-spread"] // ["@babel/plugin-syntax-dynamic-import"]
                }
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

        optimization: prod ? {
            minimizer: [

                // Minimize js
                /*new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false,
                    uglifyOptions: {
                        output: { comments: false }
                    }
                }),*/

                // Minimize CSS
                new OptimizeCSSAssetsPlugin({})
            ],

            // Join CSS files
            /*splitChunks: {
                cacheGroups: {
                    style: {
                        name: 'style',
                        test: /\.(css|scss|sass)$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            },*/
        } : {},

        devServer: {

            // Enable hystory mode
            historyApiFallback: true/* {
                rewrites: [
                    { from: /./, to: '/index.html' }
                ]
            }*/,

            noInfo: true,
            overlay: true,

            proxy: {
                '/api': 'http://inspire.local'
            }

            // headers: {
            //     'Access-Control-Allow-Origin': '*',
            //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            //     'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            // }
        },

        performance: {
            hints: false
        },

        stats: { 
            children: false
        }
    }
}
