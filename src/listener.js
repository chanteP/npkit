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

var evtObject = {
    element : null,
    _add : function(evt, key, obj){
        this._list[evt] = this._list[evt] || {};
        this._list[evt][key] = this._list[evt][key] || [];
        this._list[evt][key].push(obj);
    },
    _remove : function(evt, key, check){
        if(!this._list || !this._list[evt] || !this._list[evt][key]){
            return;
        }
        var obj;
        for(var i = this._list[evt][key].length - 1; i >= 0; i--){
            obj = this._list[evt][key][i];
            if(check(obj)){
                this._list[evt][key].splice(i, 1);
            }
        }
    },
    _list : {},
    _each : function(evt, key, func){
        if(this._list && this._list[evt] && this._list[evt][key]){
            this._list[evt][key].forEach(func);
        }
    },
    on : function(){
        var args = parseEvtArgs(arguments);
        var selector = args.selector,
            evt = args.evt,
            callback = args.callback,
            capture = args.capture;
        var element = this.element;
        if(!element){return this;}
        if(!$.isEventTarget(element)){
            this._add(evt, '@', callback);
            return this;
        }
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
            this._add(evt, selector, {
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
        var element = this.element;
        if(!element){return this;}
        if(!$.isEventTarget(element)){
            $._remove(evt, '@', function(obj){
                return obj === callback;
            });
            return this;
        }
        if(!selector){
            element.removeEventListener(evt, callback, capture);
        }
        else{
            this._remove(evt, selector, function(obj){
                if(!callback || obj.func === callback){
                    element.removeEventListener(evt, obj.cb, capture);
                    return true;
                }
            });
        }
        return this;
    }
}
var listener = function(element){
    element = element || window;
    if(element._evtObject){return element._evtObject;}
    element._evtObject = {element:element};
    element._evtObject.__proto__ = evtObject;
    return element._evtObject;
}
var trigger = function(obj, evt, args){
    if(obj._evtObject){
        obj._evtObject._each(evt, '@', function(func){
            try{
                func(args);
            }
            catch(e){
                $.log(e);
            }
        })
    }
}
module.exports = {
    /*写的什么鬼...*/
    evt : listener,
    listener : listener,
    trigger : trigger,
    _check : function(name, arg){
        if(name === 'trigger' && !$.isEventTarget(arg)){
            return true;
        }
    }
};
var $ = require('../');
