var httpProto = "https";
var readabilitySrc = httpProto+"://cdn.rawgit.com/blisszard/readability/development/Readability.min.js";
// var readabilitySrc = httpProto + "://192.168.11.114:8000/Readability.min.js";
var jQuerySrc = httpProto + "://code.jquery.com/jquery-2.1.0.min.js";
var turnSrc = httpProto + "://cdn.rawgit.com/blisszard/turn.js/dev_readability/turn.min.js";
// var turnSrc = httpProto + "://192.168.11.114:8000/turn.js";

function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) { //IE
    script.onreadystatechange = function() {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        if (callback !== undefined) {
          callback();
        }
      }
    };
  } else { //Others
    script.onload = function() {
      if (callback !== undefined) {
        callback();
      }
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

var loadJQquery = function(callback) {
  if (typeof jQuery == 'undefined') {
    loadScript(jQuerySrc, callback);
    return true;
  }
  return false;
}

var loadReadability = function() {
  loadScript(readabilitySrc, function() {
    var loc = document.location;
    var uri = {
      spec: loc.href,
      host: loc.host,
      prePath: loc.protocol + "//" + loc.host,
      scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
      pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    };
    var article = new Readability(uri, document).parse();
    content = article.content.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, "\n");
    document.head.innerHTML = '<meta charset="utf-8"><meta name="viewport" content="width=device-width" />';
    // document.head.innerHTML = '<link href="https://cdn.rawgit.com/builtbywill/booklet/1.4.4/booklet/jquery.booklet.latest.css" type="text/css" rel="stylesheet" media="screen, projection, tv" />';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('div#pages{white-space: pre-wrap;} body{ margin:0px; } div.page {padding:0 8px 0 8px;} #pages .turn-page{ color:#fff; background-color:#383838; background-size:100% 100%; }'));
    document.getElementsByTagName('head')[0].appendChild(style);


    var readyFlag = false;
    var initTurnJS = function($) {
      var winH = $(window).height();
      var winW = $(window).width();
      $('#pages').turn({
        display: 'single',
        acceleration: true,
        gradients: false,
        duration: 0,
        height: winH,
        width: "100%",
        when: {
          turned: function(e, page) {
            console.log(page);
          }
        }
      });
      $('#pages').turn('disable', true);
      // $('div').css('width', '100%');
      // $(".page").css('width', 'auto');
      readyFlag = true;
    }
    loadScript(jQuerySrc);
    loadScript(turnSrc, function() {
      jQuery(
        function($) {
          $(window).ready(function() {
            initTurnJS($);
          });
          $('#pages').on('touchend click', function(e) {
            var winW = ($(window).width());
            var xPos = e.pageX;
            if (xPos === undefined) {
              if (e.originalEvent !== undefined && e.originalEvent.touches[0] !== undefined) {
                xPos = e.originalEvent.touches[0].pageX;
                e.stopPropagation();
                e.preventDefault();
              } else {
                return;
              }
            }

            if (xPos <= winW / 2) {
              $('#pages').turn('previous');
            } else {
              $('#pages').turn('next');
            }
          });

          $(window).bind('keydown', function(e) {
            if (e.keyCode == 37)
              $('#pages').turn('previous');
            else if (e.keyCode == 39)
              $('#pages').turn('next');
          });

          $(window).resize(function() {
            if (readyFlag) {
              $('#pages').turn('resize');
            }
          }).resize();

        });
    });
    document.body.innerHTML = '<div id="pages">' + jQuery(content).text() + '</div>';
    //Todo:  Needs better algos
    var paginator = function() {
      jQuery(function($) {
        var contentBox = $('div#pages');
        var words = contentBox.text().split(/( |\n)/); //Split but keep the delimiter

        function paginate() {
          var newPage = $('<div class="page" />');
          contentBox.empty().append(newPage);
          var pageText = null;
          for (var i = 0; i < words.length; i++) {
            var betterPageText;
            if (pageText) {
              betterPageText = pageText + words[i];
            } else {
              betterPageText = words[i];
            }
            newPage.text(betterPageText);
            if (words[i].startsWith('result')) {
              // debugger;
            }
            if (newPage.height() > $(window).height()) {
              newPage.text(pageText);
              newPage.clone().insertBefore(newPage)
              pageText = words[i];
            } else {
              pageText = betterPageText;
            }
          }
        }
        paginate();

      });
    }

    paginator();
  });
}

if (!loadJQquery(loadReadability)) {
  loadReadability();
}

// var repaginate = function() {
//   if (readyFlag) {
//   var winH = $(window).height();
//       var winW = ($(window).width());
//   jQuery(
//     function($){
//       $('#pages').turn('size', winW, winH);
//     });
// }
// }
// $(window).resize(repaginate).resize();