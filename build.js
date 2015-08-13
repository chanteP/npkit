var fs = require('fs');
var b = require('browserify')();


b.add('./index.js')
w = require('watchify')(b, {});
    
w.on('update', function(){
    console.log('update@ ' + Date.now());
    bundle();
});
w.on('error', function(e){
    console.log(e.message);
});

var bundle = function(){
    w.bundle()
        .pipe(fs.createWriteStream('./dist/kit.js'))
        ;   
}
bundle();