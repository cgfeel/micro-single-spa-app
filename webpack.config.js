// webpack-ts-demo/webpack.config.js
const { loader } = require("@event-chat/micro-dev-config/helpers");
const { HtmlWebpackPlugin, copyPlugin, defineEnvPlugin } = require("@event-chat/micro-dev-config/plugins")
const path = require('path');

module.exports = (env) => ({
    // 开发模式，告知 webpack 使用相应模式的内置优化
    mode: env?.production ? 'production' : 'development',
    // 入口文件，需手动在根目录下创建`/src/main.ts`文件
    entry: './src/main.ts',
    // 打包输出配置
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    resolve: {
        // 这里是配置文件的后缀，在import引入文件的时候，如果不写文件后缀，则会按照这个配置的后缀去查找，`...`是默认配置,其实就是在默认配置基础上增加`.ts`扩展
        extensions: [".ts", ".js"]
    },
    plugins: [
        defineEnvPlugin(env, {
            APP_NAME: 'single-spa-raw',
            BASE_URL: env.production ? "/micro-single-spa-app/" : "/"
        }),
        copyPlugin([
            {
                from: path.resolve(__dirname, 'public'),
                noErrorOnMissing: true,
                globOptions: {
                    ignore: ['**/index.html']
                },
            }
        ]),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            templateParameters: {
                BASE_URL: env.production ? "/micro-single-spa-app/" : "/"
            }
        }),
    ],
    module: {
        // 配置ts-loader, 解析ts文件
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: loader("ts-loader")
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true,  // 添加这一行代码，当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    }
})
