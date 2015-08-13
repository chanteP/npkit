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


