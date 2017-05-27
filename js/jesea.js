;(function ( window, factory ) {
    window.jeSea = factory();
})( this, function () {
    var mix = function(a, b) {
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
            return mix(seaset, opts || {});
        },
        use : function (srcurl,sucfun) {
            new loadrun(srcurl,sucfun);
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
    var getKey = function (obj) {
        var keyArr = [];
        for(var key in obj){ keyArr.push(key); }
        return keyArr;
    }, arrayContain = function(array, obj){
        for (var i = 0; i < array.length; i++){
            if (array[i] == obj) return true;
        }
        return false;
    };
    var opts = jeSea.config();
    var head = document.head || document.getElementsByTagName('head')[0];
    function loadrun(urls,callback) {
        var loader = function (uri, sucfun) {
            var url = arrayContain(getKey(opts.paths),uri) ? opts.paths[uri] : uri;
            var ext = url.split(/\./).pop(),
                isCSS = (ext.replace(/[\?#].*/, '').toLowerCase() == "css"),
                node = document.createElement(isCSS ? "link" : "script");
            if (isCSS) {
                node.type = "text/css";
                node.rel = "stylesheet";
            } else {
                node.type = "text/javascript";
                node.async = true;
            }
            //为uri添加一个统一的后缀
            if (!/\.js$/.test(url)) {
                url = url + ".js";
            }
            node.src = opts.baseUrl + url + opts.urlArgs;
            head.appendChild(node);
            node.onerror = function (oError) {
                console.error( url + " \u4E0D\u5B58\u5728\u6216\u65E0\u6CD5\u8BBF\u95EE");
            };
            if (node.readyState) {
                //IE
                node.onreadystatechange = function () {
                    if (node.readyState == "loaded" || node.readyState == "complete") {
                        node.onreadystatechange = null;
                        sucfun && sucfun();
                    }
                };
            } else {
                //Others
                node.onload = function () {
                    sucfun && sucfun();
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
