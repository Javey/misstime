const babel = require('rollup-plugin-babel');

module.exports = {
    entry: 'src/index.js',
    dest: 'dist/index.js',
    format: 'cjs',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                ['es2015', {"modules": false}]
            ],
            plugins: [
                "external-helpers",
                "minify-constant-folding",
                "transform-es3-property-literals"
            ],
            babelrc: false
        })
    ]
};
