var $ = {};
module.exports = $;

//任性
$.isOnline = location.port || /^[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}$/.test(location.host);
//################################################################### 
$.objMerger = function(type, args){
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
$.parse = function(){
    return $.objMerger(0, arguments);
};
$.merge = function(){
    return $.objMerger(1, arguments);
};
//log################################################################### 
$.log = function(module, info, e){
    var type =  e instanceof Error ? 'error' :
                e == 'mark' ? 'debug' :
                e == 'warn' ? 'warn' :
                e == 'info' ? 'info' :
                'log';
    var msg = '[' + module + ']@ ' + Date.now() + ' : ' + info + '\n' + (type == 'error' ? '('+(e.stack || e.message)+')' : '');
    config.debug && $.log.list.push(msg);
    config.debug && console && console[type](msg);
    return msg;
};
$.log.list = [];
//################################################################### 
$.isEmptyObject = function(obj){
    for(var key in obj){
        if(!obj.hasOwnProperty(key)){continue;}
        return false;
    }
    return true;
}
$.unique    = function(arr){
    for(var i = arr.length - 1; i >= 0; i--){
        for(var j = i - 1; j >= 0; j--){
            if(arr[i] === arr[j]){
                arr.splice(i, 1);
                break;
            }
        }
    }
    return arr;
}
//dom################################################################### 
$.find      = function(selector, dom){
    return (dom || document).querySelector(selector);
}
$.findAll   = function(selector, dom){
    return (dom || document).querySelectorAll(selector);
}
$.contains  = function(root, el){
    if(root == el){return true;}
    return !!(root.compareDocumentPosition(el) & 16);
}
$.ancestor  = function(node, selector){
    while(node.parentNode){
        if($.match(node.parentNode, selector)){
            return node.parentNode;
        }
        node = node.parentNode;
    }
    return null;
}
$.create = function(str){
    str = str.trim();
    if(str.slice(0, 1) === '<'){
        var template = document.createElement(str.slice(0, 3) === '<tr' ? 'tbody' : 'template');
        template.innerHTML = str;
        return template.content ? template.content.firstChild : template.firstElementChild;
    }
    else{
        return document.createElement(str);
    }
}
$.remove    = function(node, array){
    if(array){
        var index = array.indexOf(node);
        if(index >= 0) array.splice(index, 1);
        return;
    }
    if(node.parentNode){
        return node.parentNode.removeChild(node);
    }
}
$.evt = function(element, data){
    element._eventList = element._eventList || {};
    return {
        'on' : function(evt, selector, callback, capture){
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
        'off' : function(evt, selector, callback, capture){
            if(element._eventList[selector]){
                element._eventList[selector].some(function(cache){
                    if(cache.func === callback){
                        element.removeEventListener(evt, cache.cb, capture);
                        return true;
                    }
                });
            }
            return this;
        }
    }
}
$.match = function(node, selector, context){
    context = context || document;
    return [].indexOf.call(context.querySelectorAll(selector) || [], node) >= 0;
}

$.query = {
    'parse' : function(str, notDecode){
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
    'stringify' : function(obj, notEncode){
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
    }
}
//top鬘ｺ蠎擾ｼ計ertical
$.lazyload = function(wrapper, node, attr, callback, isLive){
    var lazyload = function(el, src, callback){
        el.setAttribute('lazy-loading', '1');
        var img = new Image();
        img.onload = function(){
            callback && callback(el, src);
            // el.src = this.src;
            el.removeAttribute('lazy-loading');
        }
        setTimeout(function(){
            img.src = src;
        }, 400);
    }
    if(arguments.length === 3){
        //纯加载回调 node, src, callback
        lazyload(wrapper, node, attr);
    }
    else{
        //滚动视口检测
        wrapper = wrapper || document.body;
        var hasLazyLoad = node.hasBindLazyLoad;
        node.hasBindLazyLoad = attr;
        var checkTimer;
        var timerCheck = function(){
            clearTimeout(checkTimer);
            checkTimer = setTimeout(check, 50);
            node.hasBindLazyLoad = false;
        }
        var check = function(){
            var list = $.findAll('['+attr+']', node);
            if(!list.length && !isLive){
                wrapper.removeEventListener('scroll', timerCheck);
                return;
            }
            var docHeight = document.documentElement.clientHeight;
            [].every.call(list, function(el){
                var bd = el.getBoundingClientRect();
                if(bd.top + el.clientHeight < 0){
                    return true;
                }
                else if(bd.top < docHeight){
                    lazyload(el, el.getAttribute(attr), callback);
                    el.removeAttribute(attr);
                    return true;
                }
                else{
                    return false;
                }
            });
        }
        !hasLazyLoad && wrapper.addEventListener('scroll', timerCheck);  
        check();
    }
}

$.scrollTo = function(pos, wrap){
    wrap = wrap || document.body;
    if(wrap.isScrolling){wrap.isScrolling.stop();}
    if($.tween){
        return wrap.isScrolling = $.tween({
            'begin': wrap.scrollTop,
            'end'  : pos,
            'duration' : 300,
            'func' : function(num){
                wrap.scrollTop = num;
            },
            'endfunc' : function(){
                delete wrap.isScrolling;
            }
        });
    }
    else{
        wrap.scrollTop = pos;
    }
}

