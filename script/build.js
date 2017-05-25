const rollup = require('rollup');
const fs = require('fs');
const config = require('../rollup.config');

function write(dest, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dest, content, err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function build() {
    return rollup.rollup(config).then(buddle => {
        var code = buddle.generate(config).code;
        return write(config.dest, code);
    }).catch(e => console.log(e));
}

build();
