const webpack = require('webpack');
const path = require('path');

module.exports = {
    // Các cấu hình khác
    resolve: {
        alias: {
            // Thêm alias cho #swagger-ui
            '#swagger-ui': path.resolve(__dirname, 'node_modules/swagger-ui-dist/swagger-ui.css'),
        },
        fallback: {
            "buffer": require.resolve("buffer/"),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
                exclude: [
                    // Loại trừ các module gây lỗi về source map
                    /node_modules\/autolinker/,
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    ignoreWarnings: [
        {
            module: /autolinker/, // Bỏ qua cảnh báo từ autolinker
        },
    ],
};
