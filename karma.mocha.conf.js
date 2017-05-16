const webpack = require('webpack');

process.env.NODE_ENV = 'production';

const customLaunchers = {
    sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '58'
    },
    sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 7',
        version: '53'
    },
    sl_opera: {
        base: 'SauceLabs',
        browserName: 'opera',
        platform: 'Windows 7',
        version: '12'
    },
    sl_ie13: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: '13.10586'
    },
    sl_ie14: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: '14.14393'
    },
    sl_safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'macOS 10.12',
        version: '10'
    }
};

[8, 9, 10, 11].forEach(v => {
    customLaunchers[`sl_ie${v}`] = {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: v
    };
});

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
