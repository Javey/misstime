const webpack = require('webpack');

process.env.NODE_ENV = 'production';

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
                        exclude: /node-modules/
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
            'karma-mocha',
            'karma-webpack',
        ],
        // browsers: ['Chrome', 'Safari', 'Firefox', 'Opera', 'IE', 'Phantomjs'],
        browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        client: {
            mocha: {
                reporter: 'html'
            }
        },
        singleRun: true
    });
};
