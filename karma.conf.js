const webpack = require('webpack');

module.exports = function(config) {
    config.set({
        logLevel: config.LOG_INFO,
        files: [
            // 'src/__benchmark__/**/*.js'
            'node_modules/sinon/pkg/sinon.js',
            'test/**/*.js',
        ],
        preprocessors: {
            'test/**/*.js': ['webpack']
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
            // 'benchmark'
            'mocha' 
        ],
        // reporters: [
          // 'benchmark',
          // 'progress', 
          // 'html'
        // ],
        plugins: [
            'karma-chrome-launcher',
            // 'karma-babel-preprocessor',
            'karma-mocha',
            'karma-webpack',
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
}
