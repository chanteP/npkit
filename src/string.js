module.exports = {
    queryStringify : function(obj, notEncode){
        if(typeof obj === 'string'){return obj;}
        var rs = [], key, val;
        for(var name in obj){
            if(!obj.hasOwnProperty(name)){continue;}
            key = notEncode ? name : encodeURIComponent(name);
            val = (obj[key] === undefined || obj[key] === null) ?
                '' :
                notEncode ? obj[key].toString() : encodeURIComponent(obj[key].toString());
            rs.push(key + '=' + val);
        }
        return rs.join('&');
    },
    queryParse : function(str, notDecode){
        var rs = {};
        if(typeof str != 'string'){
            return rs;
        }
        var rsArr = str.split('&'), unit, key, val;
        while(rsArr.length){
            unit = rsArr.pop().split('=');
            key = (notDecode ? unit[0] : decodeURIComponent(unit[0])).trim();
            val = unit[1] === undefined ? '' : (notDecode ? unit[1] : decodeURIComponent(unit[1])).trim();
            if(key in rs){
                rs[key] = [rs[key]];
                rs[key].push(val);
            }
            else{
                rs[key] = val;
            }
        }
        return rs;
    },
    querySearch : function(key, value){
        if(arguments.length < 2){
            return $.queryParse(location.search.slice(1))[key];
        }
        else{
            var query = $.queryParse(location.search.slice(1));
            query[key] = value;
            return $.queryStringify(query);
        }
    },
    /*
        正则字符串转义
        * . ? + $ ^ [ ] ( ) { } | \ /
    */
    encodeRegExp : function(str){
        return str.replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/])/g, '\\$1');
    },
    trim : function(str, pattern, patternEnd){
        if(typeof str !== 'string'){return str ? str.toString() : '';}
        if(!pattern && !patternEnd){
            return str.trim();
        }
        var startPattern, endPattern;
        startPattern = endPattern = '';
        startPattern = typeof pattern === 'string' ? 
            new RegExp('^' + $.encodeRegExp(pattern)) : 
            $.objectType(pattern) === 'RegExp' ? pattern : '';
        str = startPattern ? str.replace(startPattern, '') : str;

        endPattern = arguments.length <= 2 ? 
                new RegExp($.encodeRegExp(startPattern.source.slice(1)) + '$'):
                typeof patternEnd === 'string' ? 
                    new RegExp($.encodeRegExp(patternEnd) + '$') : 
                    $.objectType(patternEnd) === 'RegExp' ? patternEnd : '';
                    console.log(patternEnd)
        return endPattern ? str.replace(endPattern, '') : str;
    }
}
var $ = require('../');
