// ==UserScript==
// @name       editor
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @match    http://*.*.com
// @copyright  2012+, You
// ==/UserScript==

var load, execute, loadAndExecute;
load=function(src,success,error){	
	var script=document.createElement("script");
	script.setAttribute("src",src);
	
	success!=null&&script.addEventListener("load",success);
	error!=null&&script.addEventListener("error",error);
	document.body.appendChild(script);
	return script
};
//nserts a function or string of code into the document and executes it. The functions are converted to source code before being inserted, so they lose their current scope/closures and are run underneath the global window scope.
execute=function(success){
	var b,c;
	typeof success=="function"?b="("+success+")();":b=success;
	c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);
	return c
};
loadAndExecute=function(src,success,error)
{	
	return load(src,function(){	
		return execute(success);
	},error)
};
loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js", function() {
    $("#tree_tree_1").delegate("a.MzTreeview[href^='http://*.*.*/?pid=']", "mouseover", function () {
	if($(this).attr("isover")) return;
	var $url = $(this).attr("href").replace("pid=","pid=1&type=");
	
	var newa = $("<span> </span><a href='"+$url+"' target='_blank' style='color:rgb(255, 92, 0);font-size: 14px;'>配置</a>");
	
	$(this).parent().append(newa);
	$(this).attr("isover","1");
});
});

