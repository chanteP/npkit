(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./src/array":3,"./src/cache":4,"./src/dom":5,"./src/env":6,"./src/object":7,"./src/string":8,"np-tween-ani":2}],2:[function(require,module,exports){
var parse = function(){
    var type = 0, args = arguments
    var hold = false, rsObj, curObj;
    if(args[args.length-1] === true){
        hold = true;
    }
    rsObj = hold ? args[0] : {};
    for(var i = +hold, j = args.length - hold; i<j; i++) {
        curObj = args[i];
        if(typeof curObj !== 'object'){continue;}
        for(var key in (type ? curObj : args[0])){
            if(!args[i].hasOwnProperty(key)){continue;}
            rsObj[key] = curObj[key];
        }
    };
    return rsObj;
};
//就污染window了怎么了？
window.requestAnimationFrame = null
    || window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame
    || function(callback) {setTimeout(callback, 1000 / 60);};
    //raf优化
var tweenAniAnchor = function(opts){
    opts = parse({
        'type' : 'cubic-easein',
        'begin': 0,
        'end'  : 0,
        'duration' : 600,
        'extra' : undefined,
        'func' : function(){},
        'fps' : 60,
        'endfunc' : function(){}
    },opts);
    var spf = 1000 / opts.fps;
    var duration = opts.duration;
    var step = Math.round(duration / spf);
    var tweenTRS = tweenT(opts.type, opts.begin, opts.end, step, opts.extra);
    var startTimer = Date.now(), distance;
    var controll;
    var ani = {
        'stop' : function(){
            controll = true;
        },
        'opts' : opts
    };
    requestAnimationFrame(function(){
        if(controll){return;}
        distance = Date.now() - startTimer;
        if(distance >= duration){
            ani.step = Math.round(duration / spf);
            opts.func.call(ani, opts.end, duration, duration, opts);
            opts.endfunc();
            return;
        }
        ani.step = Math.round(distance / spf);
        opts.func.call(ani, tweenTRS(ani.step), distance, duration, opts);
        requestAnimationFrame(arguments.callee);
    });
    return ani;
};
//指定t输出数值
var tweenT = function(type, begin, end, duration, extra){
    b = Math.min(begin, end);
    c = Math.max(begin, end);
    return function(t){
        if(t > duration){return end;}
        return begin > end ? 
            c - tween[type].apply(null, [t, 0, c-b, duration].concat(extra)): 
            b + tween[type].apply(null, [t, 0, c-b, duration].concat(extra));
    }
};

var tween;
tweenAniAnchor.types = tween = (function(){
    var rs = {};
    var type = {
        'linear' : function(t, b, c, d) {
            return c * t / d + b;
        },
        'quad' : {
            easeIn : function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut : function(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut : function(t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        'cubic' : {
            easeIn : function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut : function(t, b, c, d) {
                return c * (( t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut : function(t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        'quart' : {
            easeIn : function(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut : function(t, b, c, d) {
                return -c * (( t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut : function(t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        'quint' : {
            easeIn : function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut : function(t, b, c, d) {
                return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut : function(t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        'sine' : {
            easeIn : function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut : function(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut : function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        'expo' : {
            easeIn : function(t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut : function(t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut : function(t, b, c, d) {
                if (t == 0)
                    return b;
                if (t == d)
                    return b + c;
                if ((t /= d / 2) < 1)
                    return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        'circ' : {
            easeIn : function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut : function(t, b, c, d) {
                return c * Math.sqrt(1 - ( t = t / d - 1) * t) + b;
            },
            easeInOut : function(t, b, c, d) {
                if ((t /= d / 2) < 1)
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        'elastic' : {
            easeIn : function(t, b, c, d, a, p) {
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut : function(t, b, c, d, a, p) {
                if (t == 0)
                    return b;
                if ((t /= d) == 1)
                    return b + c;
                if (!p)
                    p = d * .3;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut : function(t, b, c, d, a, p) {
                if (t == 0)
                    return b;
                if ((t /= d / 2) == 2)
                    return b + c;
                if (!p)
                    p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1)
                    return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        'back' : {
            easeIn : function(t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut : function(t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut : function(t, b, c, d, s) {
                if (s == undefined)
                    s = 1.70158;
                if ((t /= d / 2) < 1)
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        'bounce' : {
            easeIn : function(t, b, c, d) {
                return c - type.bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut : function(t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut : function(t, b, c, d) {
                if (t < d / 2)
                    return type.bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                else
                    return type.bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    };
    for(var key in type){
        if(typeof type[key] === 'function'){
            rs[key] = type[key];
        }
        else{
            for(var style in type[key]){
                rs[key + '-' + style.toLowerCase()] = type[key][style];
            }
        }
    }
    return rs;
})();
module.exports = tweenAniAnchor;

},{}],3:[function(require,module,exports){
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
    _check : function(arg){
        return Array.isArray(arg);
    }
}
var $ = require('../');

},{"../":1}],4:[function(require,module,exports){
var defPrefix = '';
//默认存1个月
var defExp = 30 * 24 * 3600 * 1000;

var getStorage = function(useSession){
    return useSession ? window.sessionStorage : window.localStorage;
}
var expired2Timestamp = function(expired){
    expired = isNaN(expired) ? 0 : expired;
    expired = (!expired || String(expired).length === 13) ? expired : Date.now() + expired;
    return +expired;
}

var Cache = function(prefix){
    this.prefix = prefix || defPrefix;
};
Cache.prototype.get = function(name, protoData){
    var storage = getStorage();
    if(!storage){return null;}
    var stData = storage.getItem(this.prefix + name);
    if(stData === null || protoData){return stData;}
    try{
        stData = JSON.parse(stData);
    }catch(e){}
    var now = Date.now(), expired = stData.expired, data = stData.data;
    return !expired || now < expired ? data : null;
};
//cookie一样..expired为叠加时间ms单位..,储存后expired为过期时间戳,默认时间见上面定义,0为直到地久天长海枯石烂ry
//TODO 长度验证&数量验证
Cache.prototype.set = function(name, value, expired){
    var storage = getStorage();
    if(!storage){return null;}
    try{
        value = JSON.parse(value);
    }catch(e){
    }
    return storage.setItem(this.prefix + name, JSON.stringify({
        timestamp : Date.now(),
        data : value,
        expired : expired2Timestamp(expired === undefined ? defExp : +expired)
    }));
};
//获取本prefix下所有
Cache.prototype.each = function(callback, reverse){
    var storage = getStorage();
    if(!storage){return null;}
    if(typeof callback !== 'function'){return null;}
    !reverse ? 
        (function(self){
            var name;
            for(var i = 0; i < storage.length; i++){
                name = storage.key(i);
                if(name.indexOf(self.prefix) === 0){
                    callback.apply(self, [name, name.replace(self.prefix, '')]);
                }
            }
        })(this) : 
        (function(self){
            var name;
            for(var i = storage.length - 1; i > 0; i--){
                name = storage.key(i);
                if(name.indexOf(self.prefix) === 0){
                    callback.apply(self, [name, name.replace(self.prefix, '')]);
                }
            }
        })(this);
};
//force ? 强制删除全部 : 删除过期的
Cache.prototype.clear = function(force){
    this.each(function(name, subName){
        this.remove(subName, force);
    });
};
//删除一个key
Cache.prototype.remove = function(name, force){
    var storage = getStorage();
    if(!storage){return null;}
    if(force || this.get(name) === null){
        storage.removeItem(this.prefix + name);
    }
};

Cache.prototype.extend = function(prefix){
    if(typeof prefix !== 'string'){
        prefix = '$';
    }
    return new Cache(this.prefix + prefix);
};
var commonCache = new Cache(defPrefix);
Cache.set = commonCache.set;
Cache.get = commonCache.get;
Cache.remove = commonCache.remove;
Cache.clear = commonCache.clear;
Cache.extend = commonCache.extend;
Cache.each = commonCache.each;
Cache.prefix = commonCache.prefix;


module.exports = {
    storage : Cache
};



},{}],5:[function(require,module,exports){
var parseEvtArgs = function(args){
    var params = {}, arg;
    for(var i = 0, j = args.length; i < j; i++){
        arg = args[i];
        if(typeof arg === 'string' && !params.evt){
            params.evt = arg;
        }
        else if(typeof arg === 'string' && !params.selector){
            params.selector = arg;
        }
        else if(typeof arg === 'function' && !params.callback){
            params.callback = arg;
        }
        else if(typeof arg === 'boolean' && !(params.capture)){
            params.capture = arg;
        }
    }
    return params;
}

module.exports = {
    find : function(selector, dom){
    return (dom || document).querySelector(selector);
    },
    findAll : function(selector, dom){
        return (dom || document).querySelectorAll(selector);
    },
    contains : function(root, el){
        if(root == el){return true;}
        return !!(root.compareDocumentPosition(el) & 16);
    },
    ancestor : function(node, selector){
        while(node.parentNode){
            if($.match(node.parentNode, selector)){
                return node.parentNode;
            }
            node = node.parentNode;
        }
        return null;
    },
    create : function(str){
        str = str.trim();
        if(str.slice(0, 1) === '<'){
            var template = document.createElement(str.slice(0, 3) === '<tr' ? 'tbody' : 'template');
            template.innerHTML = str;
            return template.content ? template.content.firstChild : template.firstElementChild;
        }
        else{
            return document.createElement(str);
        }
    },
    remove : function(node){
        if(node.parentNode){
            return node.parentNode.removeChild(node);
        }
    },
    match : function(node, selector, context){
        var rs = $.findAll(selector, context);
        if(!rs){return false;}
        return [].indexOf.call(rs, node) >= 0;
    },
    trigger : function(element, evt, args){
        evt = typeof evt === 'string' ? new Event(evt, $.merge({bubbles:true}, args || {}, true)) : evt;
        element.dispatchEvent(evt);
        return this;
    },
    evt : function(element){
        if(element._evtObject){return element._evtObject;}

        element._eventList = element._eventList || {};
        return element._evtObject = {
            on : function(){
                var args = parseEvtArgs(arguments);
                var selector = args.selector,
                    evt = args.evt,
                    callback = args.callback,
                    capture = args.capture;
                if(!selector){
                    element.addEventListener(evt, callback, capture);
                }
                else{
                    var cb = function(e){
                        var target = e.target;
                        while(target && target !== element.parentNode){
                            if($.match(target, selector, element)){
                                callback.call(target, e);
                                return true;
                            }
                            target = target.parentNode;
                        }
                    }
                    element._eventList[selector] = element._eventList[selector] || [];
                    element._eventList[selector].push({
                        cb : cb,
                        func : callback
                    });
                    element.addEventListener(evt, cb, capture);
                }
                return this;
            },
            off : function(){
                var args = parseEvtArgs(arguments);
                var selector = args.selector,
                    evt = args.evt,
                    callback = args.callback,
                    capture = args.capture;

                if(!selector){
                    element.removeEventListener(evt, callback, capture);
                }
                else if(element._eventList[selector]){
                    element._eventList[selector].forEach(function(cache){
                        if(!callback || cache.func === callback){
                            element.removeEventListener(evt, cache.cb, capture);
                            return true;
                        }
                    });
                }
                return this;
            }
        }
    },
    domReady : (function(){
        var readyList = [];
        document.addEventListener('DOMContentLoaded', function(){
            while(readyList.length){
                readyList.pop()();
            }
        })
        return function(func){
            if(document.readyState === 'interactive' || document.readyState === 'complete'){
                func();
            }
            else{
                readyList.push(func);
            }
        }
    })(),
    scrollTo : function(pos, wrap, type){
        wrap = wrap || document.body;
        if(wrap.npKitScrollAni){wrap.npKitScrollAni.stop();}
        if($.tween){
            return wrap.npKitScrollAni = $.tween({
                type : type || 'quart-easeout',
                begin: wrap.scrollTop,
                end  : pos,
                extra : [0.2],
                duration : 500,
                func : function(num){
                    wrap.scrollTop = num;
                },
                endfunc : function(){
                    delete wrap.npKitScrollAni;
                }
            });
        }
        else{
            wrap.scrollTop = pos;
        }
    },
    load : function(url, contentNode){
        var type = /\.([\w]+)$/.exec(url);
        type = type ? type[1] : '';
        contentNode = contentNode || document.head;

        var returnValue;
        switch(type){
            case 'js' : 
                returnValue = document.createElement('script');
                returnValue.src = url;
                break;
            case 'css' : 
                returnValue = document.createElement('link');
                returnValue.rel = 'stylesheet';
                returnValue.href = url;
                break;
            default : 
                break;
        }
        returnValue && contentNode.appendChild(returnValue);
    }
}
var $ = require('../');
},{"../":1}],6:[function(require,module,exports){
module.exports = {
    envList : ['browser', 'APP'],
    env : (function(){
        var env = /[\?\&]env=([^\#\&\=]+)\b/i.exec(window.location.search);
        if(env){return env[1];}
        if(navigator.platform.indexOf('MacIntel') >= 0 || navigator.platform.indexOf('Win') >= 0){
            return 'browser';
        }
        else if(navigator.userAgent.indexOf('webview') >= 0){
            return 'APP';
        }
        return 'APP';
    })(),
    osList : ['Android', 'IOS', 'Mac', 'Window'],
    os : (function(){
        var os = /[\?\&]os=([^\#\&\=]+)\b/i.exec(window.location.search);
        if(os){return os[1];}
        if(/\bAndroid\b/i.test(navigator.userAgent)){
            return 'Android';
        }
        if(/\biPhone\b/i.test(navigator.userAgent)){
            return 'IOS';
        }
        if(navigator.platform.indexOf('MacIntel') >= 0){
            return 'Mac';
        }
        if(navigator.platform.indexOf('Win') >= 0){
            return 'Window';
        }
        return '';
    })(),
    osVersion : (function(){
        var ua = navigator.userAgent;
        var androidVer = /\bAndroid\s([\d|\.]+)\b/i.exec(ua);
        if(androidVer){
            return androidVer[1];
        }
        var IOSVer = /\biPhone\sOS\s([\d\_]+)\s/i.exec(ua);
        if(androidVer){
            return IOSVer[1];
        }
        //其他有什么用...
        return null;
    })(),
    isLocal : (function(){
        var isLocal = /[\?\&]isLocal=(true|false|0|1)\b/i.exec(window.location.search);
        if(isLocal){return !!+isLocal[1];}
        return /\b(localhost|127.0.0.1)\b/i.test(location.host);
    })()
}
var $ = require('../');

},{"../":1}],7:[function(require,module,exports){
var objMerger = function(needFilter, args){
    var isHold = 0, 
        resultObject, 
        currentObject,
        paramsMap;
    if(args[args.length - 1] === true){
        isHold = 1;
    }
    resultObject = isHold ? args[0] : {};
    for(var i = isHold, j = args.length - isHold; i < j; i++) {
        currentObject = args[i];
        if(typeof currentObject === 'object'){
            paramsMap = needFilter ? currentObject : args[0];
            for(var key in paramsMap){
                if(currentObject.hasOwnProperty(key)){
                    resultObject[key] = currentObject[key];
                }
            }
        }
    }
    return resultObject;
};
module.exports = {
    get : function(data, ns){
        if(!ns){return data;}
        ns = ns.replace(/[\[|\]]/g, '.').replace(/(?:(?:^\.*)|\.{2,}|(?:\.*$))/g, '');
        var nsArr = ns.split('.'), key;
        while(nsArr.length){
            key = nsArr.shift();
            if(!data || typeof data !== 'object'){
                return undefined;
            }
            data = data[key];
        }
        return data;
    },
    set : function(data, ns, value){
        var nsArr = ns.split('.'), 
            key;
        while(nsArr.length > 1){
            key = nsArr.shift();
            if(!data[key] || typeof data[key] !== 'object'){
                data[key] = {};
            }
            data = data[key];
        }
        data[nsArr.pop()] = value;
    },
    merge : function(){
        return objMerger(false, arguments);
    },
    parse : function(){
        return objMerger(true, arguments);
    },
    map : function(obj, func){
        if(typeof obj !== 'object'){return;}
        var rs = [];
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                rs.push(func ? func.call(obj, obj[key], key, obj) : obj[key]);
            }
        }
        return rs;
    },
    objectType : function(obj){
        return Object.prototype.toString.call(obj).slice(8, -1);
    },
    isEmptyObject : function(obj){
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    },
    isSimpleObject : function(obj){
        return typeof obj === 'object' && $.objectType(obj) === 'Object';
    },
    _check : function(arg, method){
        return typeof arg === 'object';
    }
}
var $ = require('../');

},{"../":1}],8:[function(require,module,exports){
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

},{"../":1}]},{},[1]);
