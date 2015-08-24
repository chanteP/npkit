module.exports = {
    unique : function(arr){
        for(var i = arr.length - 1; i >= 0; i--){
            for(var j = i - 1; j >= 0; j--){
                if(arr[i] === arr[j]){
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        return arr;
    },
    remove : function(arr, elem){
        var index = arr.indexOf(elem);
        if(index >= 0) arr.splice(index, 1);
        return;
    },
    _check : function(name, arg){
        return Array.isArray(arg[0]);
    }
}
var $ = require('../');
