module.exports = {
    get androidVersion(){
        var androidVer = /Android\s([\d|\.]+)\b/i.exec(navigator.userAgent);
        if(androidVer){
            return androidVer[1];
        }
    },
    get env(){
        var env = $.querySearch('env');
        if(env){return env;}
        if(navigator.platform.indexOf('MacIntel') >= 0 || navigator.platform.indexOf('Win') >= 0){
            return 'browser';
        }
        else if(navigator.userAgent.indexOf('webview') >= 0){
            return 'APP';
        }
        return 'APP';
    },
    get os(){
        var os = $.querySearch('os');
        if(os){return os;}
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
    },
}
var $ = require('../');
