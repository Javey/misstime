const babel = require('rollup-plugin-babel');

module.exports = {
    entry: 'src/vnode.js',
    dest: 'dist/vnode.js',
    format: 'cjs',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                ['es2015', {"modules": false}]
            ],
            plugins: [
                "external-helpers",
                "minify-constant-folding"
            ],
            babelrc: false
        })
    ]
}
