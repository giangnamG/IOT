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
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};
