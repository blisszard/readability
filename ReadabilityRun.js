window.injectScript = function(src) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    return true;
}
window.injectJQ = function() {
    if (typeof jQuery == 'undefined') {
        window.injectJQ("https://code.jquery.com/jquery-2.1.0.min.js");
    }
}
injectJQ();
function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
loadScript("https://cdn.rawgit.com/blisszard/readability/development/Readability.min.js",function() {
var loc = document.location;
var uri = { spec: loc.href, host: loc.host, prePath: loc.protocol + "//" + loc.host, scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")), pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1) };
var article = new Readability(uri, document).parse();
document.body.innerHTML = '<div id="pages">' + article.content + '</div>';
});