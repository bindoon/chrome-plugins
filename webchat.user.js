// ==UserScript==
// @name       webchat spm
// @namespace  http://use.i.E.your.homepage/
// @version    0.0.1
// @description clock ssystem 
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @match    https://wx.qq.com
// @copyright  2015+, frankqian
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


execute( function() {
        Date.prototype.format = function(format){ 
            var o = { 
            "M+" : this.getMonth()+1, //month 
            "d+" : this.getDate(), //day 
            "h+" : this.getHours(), //hour 
            "m+" : this.getMinutes(), //minute 
            "s+" : this.getSeconds(), //second 
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
            "S" : this.getMilliseconds() //millisecond 
            } 
            if(/(y+)/.test(format)) { 
                format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
            } 
            for(var k in o) { 
                if(new RegExp("("+ k +")").test(format)) { 
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
                } 
            } 
            return format; 
        }

var msgdom = $('<div>').css({
  position:'fixed',
  top:0,
  left:0,
  background:'#fff',
  color:'#000'
});
msgdom.appendTo($('body'));
function log(msg) {
msgdom.append(msg);
}

var peopleMap = {};
function getChatContent() {
   var chatdom = $('#chatArea .avatar');
   chatdom.each(function(i,dom) { 
       var avatar = $(dom);
       if(avatar.attr('has-checked')){
            return;
       }

       avatar.attr('has-checked',true);
       var title = avatar.attr('title');
       var pic = avatar.attr('src');
       if(title in peopleMap) {
            return;
       }

       peopleMap[title]={
            pic:pic,
            time:(new Date()).format('yyyy-MM-dd hh:mm:ss')
       };
      log(peopleMap[title].time+' '+title+'<br/>');
   });
}
    setInterval(function(){
        getChatContent();
    },1000);
});

