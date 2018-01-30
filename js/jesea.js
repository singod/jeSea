/**
 @Name : jeSea v1.2 轻量级文件加载
 @Author: chen guojun
 @Date: 2018-01-30
 @官网：http://www.jemui.com/ 或 https://github.com/singod/jeSea
 */
;(function ( window, factory ) {
    window.jeSea = factory();
})( this, function () {
    var _extend = function(a, b) {
        for (var k in b) {
            a[k] = b[k];
        }
        return a;
    };
    var seaset = {
        baseUrl:'',
        paths:{},
        urlArgs:""
    };
    var jeSea = {
        config:function (opts) {
            return _extend(seaset, opts || {});
        },
        use : function (deps,callback) {
            if(deps && typeof (deps) == "function"){
                this.ready(deps);
            }else {
                new loadRun(deps,callback);
            }
        },
        ready: function ( callback ) {
            if ( document.readyState === "complete" ) {
                callback && callback();
            } else {
                var docReady = (function () {
                    document.addEventListener("DOMContentLoaded", function () {
                        document.removeEventListener("DOMContentLoaded", docReady);
                        callback && callback();
                    });
                })();
            }
        }
    };
    var baseurl = (function() {
        var tags = document.getElementsByTagName("script"),
            script = tags[tags.length - 1],
            url = script.hasAttribute ? script.src : script.getAttribute( 'src', 4 );
        return script.getAttribute("data-baseurl") || url.replace(/\/[^\/]+$/, "");
    })();
    var opts = jeSea.config();
    var head = document.head || document.getElementsByTagName('head')[0];
    function getKey(obj) {
        var keyArr = [];
        for(var key in obj){ keyArr.push(key); }
        return keyArr;
    }
    function arrayContain(array, obj){
        for (var i = 0; i < array.length; i++){
            if (array[i] == obj) return true;
        }
        return false;
    };
    function loadRun(urls,callback) {
        var loader = function (urlarr, callback) {
            var returi,spath,tmp,srcl,url = arrayContain(getKey(opts.paths),urlarr) ? opts.paths[urlarr] : urlarr;
            var ext = url.split(/\./).pop(),isFull = /^(\w+)(\d)?:.*/.test(url),
                isCSS = (ext.replace(/[\?#].*/, '').toLowerCase() == "css"),
                node = document.createElement(isCSS ? "link" : "script");
            
            if (isFull) { //如果本来就是完整路径
                returi = url;
            } else {
                tmp = url.charAt(0);
                spath = url.slice(0,2);
                if(tmp != "." && tmp != "/"){ //当前路径
                    returi = baseurl + "/" + url;
                }else if(spath == "./"){ //当前路径
                    returi = baseurl + url.slice(1);
                }else if(spath == ".."){ //相对路径
                    srcl = baseurl;
                    url = url.replace(/\.\.\//g,function(){
                        srcl = srcl.substr(0,srcl.lastIndexOf("/"));
                        return "";
                    });
                    returi = srcl + "/" + url;
                }
            }
            //为uri添加一个统一的后缀
            if (!isCSS && !/\.js$/.test(returi)) {
                returi += ".js";
            }
            node.src = isFull ? returi + opts.urlArgs : opts.baseUrl + returi + opts.urlArgs;
            if (isCSS) {
                node.type = "text/css";
                node.rel = "stylesheet";
            } else {
                node.type = "text/javascript";
                //node.async = true;
            }
            head.appendChild(node);
            
            node.onerror = function (oError) {
                console.error("Error: "+ url + " \u4E0D\u5B58\u5728\u6216\u65E0\u6CD5\u8BBF\u95EE");
            };
            if (node.readyState) {
                //IE
                node.onreadystatechange = function () {
                    if (node.readyState == "loaded" || node.readyState == "complete") {
                        node.onreadystatechange = null;
                        callback && callback();
                    }
                };
            } else {
                //Others
                node.onload = function () {
                    callback && callback();
                };
            }
        };
        var index = 0, loadStart = function (url) {
            loader(url, function () {
                var idx = ++index;
                if(idx == urls.length){
                    callback && callback();
                }else {
                    loadStart(urls[index]);
                }
            });
        };
        if (urls && urls.length > 0) {
            loadStart(urls[index]);
        };
        
    }
    return jeSea;
});
