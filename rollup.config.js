const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');

module.exports = {
    entry: 'src/index.js',
    dest: 'dist/index.js',
    format: 'cjs',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                ['es2015', {"modules": false, "loose": true}]
            ],
            plugins: [
                "external-helpers",
                "minify-constant-folding",
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals",
            ],
            babelrc: false
        })
    ]
};
