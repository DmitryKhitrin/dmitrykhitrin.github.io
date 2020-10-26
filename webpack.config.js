const path = require(`path`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        bundle: ['./src/index.ts', './src/styles/main.scss'],
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, `static`),
    },
    devServer: {
        contentBase: path.join(__dirname, `static/scripts`),
        open: true,
        port: 1337,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,
                loader: `ts-loader`,
            },
            {
                test: /\.scss$/,
                use: [
                    // fallback to style-loader in development
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    resolve: {
        extensions: [`.ts`, `.tsx`, `.js`, `json`],
    },
    devtool: `source-map`,
    devServer: {
        contentBase: path.join(__dirname, `static`),
        open: true,
        port: 1337,
        historyApiFallback: true,
    },
};
