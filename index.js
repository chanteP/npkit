var $ = {};
module.exports = $;

var buildFunc = function(mt){
    return function(){
        var arg = arguments[0],
            mod;
        for(var i = 0; i < modList.length; i++){
            mod = mods[modList];
            if(mod._check && mod._check(arg)){
                return mod[mt].apply($, arguments);
            }
        }
        for(var i = 0; i < modList.length; i++){
            mod = mods[modList];
            if(!mod._check){
                return mod[mt].apply($, arguments);
            }
        }
    }
}


var mods = {
    array : require('./src/array'),
    object : require('./src/object'),
    dom : require('./src/dom'),
    string : require('./src/string'),
    env : require('./src/env')
};
var modList = [
    'array',
    'object',
    'dom',
    'string',
    'env'
];

modList.forEach(function(modName){
    var mod = mods[modName];
    var check = mod._check;
    for(var mt in mod){
        if(mod.hasOwnProperty(mt) && mt[0] !== '_'){
            if(!$[mt]){
                $[mt] = mod[mt];
            }
            else{
                $[mt] = buildFunc(mt);
            }
        }
    }
});

$.tween = require('np-tween-ani');

window.np = $;