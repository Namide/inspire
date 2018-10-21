var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var WebpackCleanPlugin = require('webpack-clean')
var MinifyPlugin = require('babel-minify-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = function(env, argv) {

    var prod = env.production === true

    return {

        // Webpack optimizations
        mode: prod ? 'production' : 'development',
        devtool: prod ? '' /*'source-maps'*/ : 'eval',

        // Export 2 builds (for admin and public)
        entry: {
            build: './src/main.js'
        },

        // Export js builds in the dist/assets/js/ dir
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: '/',
            filename: 'assets/js/[name].js',
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
                    filename: 'assets/css/style.css',
                }),

                // Uglify JS with es6 support
                new MinifyPlugin({
                    removeConsole: true,
                    removeDebugger: true
                }, {
                    comments: false
                }),

                // Gzip files
                new CompressionPlugin({
                    filename: '[path].gz[query]',
                    include: ['./dist/**/*.css'],
                    algorithm: 'gzip',
                    test: /\.(js|css|sass|scss|html)$/i, // /\.js$|\.css$|\.html$/,
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: false
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

            contentBase: path.join(__dirname, 'dist'),

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
