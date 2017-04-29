suite('test', () => {
    benchmark('a', () => {
        return 1;
    });
    benchmark('b', () => {
        var a = 1;
        return a;
    })
})
