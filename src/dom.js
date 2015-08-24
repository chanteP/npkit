

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
    isNode : function(node){
        return node && typeof node === 'object' && (node.nodeType === 1 || node.nodeType === 9) && typeof node.nodeName === 'string';
    },
    inScreen : function(node){
        var t;
        return node && node.scrollWidth && (t = node.getBoundingClientRect().top) >= 0 && (t + node.clientHeight) < document.documentElement.clientHeight;
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
        if(node && node.parentNode){
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
    insertStyle : function(css){
        var s = document.createElement('style');
        s.innerHTML = css;
        document.head.appendChild(s);
        return s;
    },
    load : function(url, contentNode, conf){
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
        if(returnValue){
            $.merge(returnValue, conf, true);
            contentNode.appendChild(returnValue);
        }
        return returnValue;
    }
}
var $ = require('../');