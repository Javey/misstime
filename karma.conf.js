const webpack = require('webpack');

process.env.NODE_ENV = 'development';

module.exports = function(config) {
    config.set({
        logLevel: config.LOG_INFO,
        files: [
            // 'node_modules/babel-polyfill/dist/polyfill.js',
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
                        exclude: /node_modules/
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                    }
                }),
            ]
        },
        frameworks: [
            'mocha',
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-sauce-launcher',
            'karma-mocha',
            'karma-webpack',
        ],
        sauceLabs: {
            testName: 'Miss Unit Tests'
        },
        client: {
            mocha: {
                reporter: 'html'
            }
        },
        concurrency: 2,
        singleRun: true
    });
};
