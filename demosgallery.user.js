// ==UserScript==
// @name        DesmosGallery
// @namespace   https://github.com/XXXXX
// @description Desmos Gallery generator
// @include     https://www.desmos.com/calculator*
// @version     1
// @run-at      document-start
// @grant       GM_addStyle
// ==/UserScript==

/* DesmosGallery TamperMonkey / GreaseMonkey script by Fabrice Neyret */
// script structure inspired by https://github.com/baz1/DesmosToSVG

function PageScript() {
  window.DesmosGallery = new Object();

  // my stuff
  DesmosGallery.getGallery = function() {
    var g = Calc.myGraphsWrapper._childViews[0].props.graphsController().__savedGraphs; // structure containing all user graph informations
    var t = "<html>\n<head><title> Desmos graphs - visual list </title>\n";             // build the gallery html
    t += "<style>div { display:inline-block; width : 200px; height: 250px; padding: 10px;} div img { height: 200px;  width:  200px;}</style>\n"; // CSS
    t += "</head>\n<body></br><hr><center><h1>My Desmos Graphs visual list</h1> </center><hr>\n( "+g.length+" graphs. )</br>\n";
    for( var i=0; i<g.length; i++) {                                                    // foreach user graphs
      t += "<div><a href=https://www.desmos.com/calculator/"+g[i].hash+"><img src="+g[i].thumbURL+"></br>"+g[i].title+"</a>"; // image + title + URL
   /* t+= " (<a href="+g[i].stateURL+">JSON"+"</a>)"; */                                // optional JSON URL for backup
      t += "</div>\n";
    }
    t+="</body></html>"
    window.open().document.write(t);                                                    // creates new tab with gallery
  };

  var main = function() {

    var spanObj = document.createElement("SPAN");                                       // creates button
    DesmosGallery.button = document.createElement("INPUT");
    DesmosGallery.button.type = "button";
    DesmosGallery.button.disabled = false; // true;
    DesmosGallery.button.addEventListener("click", DesmosGallery.getGallery, false);
    DesmosGallery.button.value = "Get Gallery";

    spanObj.appendChild(DesmosGallery.button);

    DesmosGallery.graph = document.getElementsByClassName("dcg-graph-inner");           // attach it to the top bar
    if (DesmosGallery.graph.length != 1) {
      console.log("GM_DesmosGallery: Graph not found, or several found.");
      return;
    }
    DesmosGallery.graph = DesmosGallery.graph[0];
    var floaters = document.getElementsByClassName("align-right-container");
    if (floaters.length != 1) {
      console.log("GM_DesmosGallery: Floaters object not found, or several found.");
      return;
    }
    floaters[0].appendChild(spanObj);
    console.log("GM_DesmosGallery: (Info) Button added.");

  }

  setTimeout(main, 3000);
}

function AddJSNode(fn, url) {
  var scriptNode = document.createElement("script");
  scriptNode.type = "text/javascript";
  if (fn) scriptNode.textContent = "(" + fn.toString() + ")();";
  if (url) scriptNode.src = url;
  var target = document.getElementsByTagName ('head')[0] ||
      document.body || document.documentElement;
  target.appendChild(scriptNode);
}

window.addEventListener("DOMContentLoaded", function() {
//AddJSNode(null, "exernalJStoInclude.js");
  AddJSNode(PageScript, null);
}, false);
