var fs = require('fs');
var b = require('browserify')();

b.add('./index.js')
    .bundle()
    .pipe(fs.createWriteStream('./dist/kit.js'));