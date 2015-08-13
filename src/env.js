module.exports = {
    envList : ['browser', 'APP'],
    env : (function(){
        var env = /[\?\&]env=([^\#\&\=]+)/i.exec(window.location.search);
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
        var os = /[\?\&]os=([^\#\&\=]+)/i.exec(window.location.search);
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
}
var $ = require('../');
