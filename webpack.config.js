// webpack-ts-demo/webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 开发模式，告知 webpack 使用相应模式的内置优化
    mode: 'development',
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
        new HtmlWebpackPlugin({
            template: './public/index.html' // 使用本地模板（手动在根目录创建一个`index.html`文件，在vscode编辑器中，点新建文件，输入`!`，然后按`tab`键，会自动生成一段html代码，保存就可以了）
        }),
    ],
    module: {
        // 配置ts-loader, 解析ts文件
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    }
}
