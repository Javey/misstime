const webpack = require('webpack');

process.env.NODE_ENV = 'production';

const customLaunchers = {
    sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '35'
    }
};

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
            'karma-firefox-launcher',
            'karma-sauce-launcher',
            'karma-mocha',
            'karma-webpack',
        ],
        // browsers: ['Chrome', 'Safari', 'Firefox', 'Opera', 'IE', 'Phantomjs'],
        // browsers: process.env.TRAVIS ? ['Chrome_travis_ci', 'Firefox'] : [],
        browsers: Object.keys(customLaunchers),
        // customLaunchers: {
            // Chrome_travis_ci: {
                // base: 'Chrome',
                // flags: ['--no-sandbox']
            // }
        // },
        sauceLabs: {
            testName: 'Miss Unit Tests'
        },
        customLaunchers: customLaunchers,
        reportes: ['dots', 'saucelabs'],
        client: {
            mocha: {
                reporter: 'html'
            }
        },
        singleRun: true
    });
};
