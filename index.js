var $ = {};
module.exports = $;

var buildFunc = function(mt){
    return function(){
        var arg = arguments[0],
            mod;
        var i;
        for(i = 0; i < modList.length; i++){
            mod = mods[modList[i]];
            if(mod[mt] && mod._check && mod._check(arg)){
                return mod[mt].apply($, arguments);
            }
        }
        for(i = 0; i < modList.length; i++){
            mod = mods[modList[i]];
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
    env : require('./src/env'),
    cache : require('./src/cache')
};
var modList = [
    'array',
    'object',
    'dom',
    'string',
    'env',
    'cache'
];
modList.forEach(function(modName){
    var mod = mods[modName];
    var check = mod._check;
    $['_' + modName] = {};
    for(var mt in mod){
        if(mod.hasOwnProperty(mt) && mt[0] !== '_'){
            $['_' + modName][mt] = mod[mt];
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