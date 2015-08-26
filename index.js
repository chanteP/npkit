var $ = {};
module.exports = $;

var buildFunc = function(mt){
    return function(){
        var arg = arguments,
            mod;
        var i;
        for(i = 0; i < modList.length; i++){
            mod = mods[modList[i]];
            if(mod[mt] && mod._check && mod._check(mt, arg)){
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
    listener : require('./src/listener'),
    object : require('./src/object'),
    dom : require('./src/dom'),
    string : require('./src/string'),
    env : require('./src/env'),
    cache : require('./src/cache')
};
var modList = [
    'array',
    'listener',
    'object',
    'dom',
    'string',
    'env',
    'cache'
];
modList.forEach(function(modName){
    var mod = mods[modName];
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
var logTypes = ['log', 'error', 'info', 'warn', 'debug'];
$.log = function(){
    var message = [], mod, type = 'log';
    for(var i = 0; i < arguments.length; i++){
        if(arguments[i] instanceof window.Error){
            type = 'error';
        }
        else if(logTypes.indexOf(arguments[i]) >= 0){
            type = arguments[i];
        }
        else{
            message.push(arguments[i]);
        }
    }
    if(type !== 'log' || $.debug){
        console && console[type].apply(console, message);
    }
};
$.debug = $.querySearch('debug') || false;

window.np = $;