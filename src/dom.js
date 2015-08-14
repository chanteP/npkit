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