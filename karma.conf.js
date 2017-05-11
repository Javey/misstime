const webpack = require('webpack');

module.exports = function(config) {
    config.set({
        logLevel: config.LOG_INFO,
        files: [
            'src/__benchmark__/vnode.js'
            // 'node_modules/sinon/pkg/sinon.js',
            // 'test/**/*.js',
            // 'test/render.js',
        ],
        preprocessors: {
            'test/**/*.js': ['webpack'],
            'src/__benchmark__/**/*.js': ['webpack']
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
            'benchmark',
            // 'mocha',
        ],
        reporters: [
          'benchmark',
          // 'progress', 
          // 'html'
        ],
        plugins: [
            'karma-chrome-launcher',
            // 'karma-babel-preprocessor',
            'karma-mocha',
            'karma-webpack',
            'karma-benchmark',
            'karma-benchmark-reporter',
            // 'karma-browserify',
            // 'karma-rollup-plugin'
        ],
        browser: ['chrome'],
        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
