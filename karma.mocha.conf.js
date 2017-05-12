const webpack = require('webpack');

module.exports = function(config) {
    config.set({
        logLevel: config.LOG_INFO,
        files: [
            'node_modules/sinon/pkg/sinon.js',
            'test/**/*.js',
            // 'test/render.js',
        ],
        preprocessors: {
            'test/**/*.js': ['webpack'],
        },
        webpack: {
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        exclude: /node-modules/
                    }
                ]
            }
        },
        frameworks: [
            'mocha',
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-webpack',
        ],
        browser: ['chrome'],
        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
