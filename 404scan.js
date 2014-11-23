var hour=(new Date()).getHours();
if(hour<6) return;
/**
 * @author frankqian
 * @createDate 2011-3-27 2011
 * @lastUpdate on 下午06:16:38 2011-12-23 2011 by frankqian
 * @Description 404扫描
 */

$ = function(elementId){
	return document.getElementById(elementId);
};
o = document.body;
/**
 * 父亲页面索引
 * @param index	404数组列表索引
 * @param father 父亲页面链接地址
 * @returns {LinkCF}
 */
function LinkCF(index,father){
	this.total = 1;
	this.url = father;
	this.idArray = [];
	this.idArray[0] = index;
};

/**
 * 页面特征值数据
 * @param father	父亲页面链接
 * @param title		自己的title
 * @returns {LinkInfo}
 */
function LinkInfo(father, title){
	this.father = father;
	this.title = title;
};
/**
 * 404链接结构
 * @param url
 * @param title
 * @returns {Link404}
 */
function Link404(url, title){
	this.url = url;
	this.title = title;
};

var common = {
	currIDb : null,// mousemove vars
	currIDs : null,

	xoff : 0,// cursor postion
	yoff : 0,
	ridestr : /javascript:|mailto:|https:\/\/|qqlive:\/\//ig, // 创建正则表达式模式。

	startTime : null,	//起始检测时间
	endTime : null,		//检测完成时间
	singelPage : false, //单页面扫描
	ajax : null,
	emailAd : "http://wind.oa.com/cgi-bin/automail",
	/**
	 * 按天缓存页面,防止浏览器200 OK (from cache)
	 */
	randNum : "",//"?r="+(new Date()).getDate(),	//页面缓存随机数，但是让扫描效率降低了很多

	autoRun : true,//(function(){if(typeof autoRun == "boolean") return autoRun;else return false;})(),
	autoMail : true,//(function(){if(typeof autoMail == "boolean") return autoMail;else return false;})(),
	/**
	 * 快排
	 * @param seq
	 */
	quicksort : function(seq) {
		if (seq.length > 1) {
			var k = seq[0];
			var x = [];
			var y = [];
			for ( var i = 1, len = seq.length; i < len; i++) {
				if (seq[i].total <= k.total) {
					x.push(seq[i]);
				} else {
					y.push(seq[i]);
				}
			}
			x = this.quicksort(x);
			y = this.quicksort(y);
			return x.concat(k, y);
		} else {
			return seq;
		}
	},
	closeWin : function(id) {
		var obj = document.getElementById(id);
		obj.parentNode.removeChild(obj);
	},
	getCurTime : function(startTime, endTime) {
		var dt3;
		if (endTime == null) {
			dt3 = new Date() - startTime;
		} else {
			dt3 = endTime - startTime;
		}

		var h = Math.floor(dt3 / 3600000);
		var m = Math.floor((dt3 - h * 3600000) / 60000);
		var s = Math.floor((dt3 - h * 3600000 - m * 60000) / 1000);

		return h + "\u65f6" + m + "\u5206" + s + "\u79d2";
	},
	sort : function(hash){
		var item = [];
		var count = 0;
		for(var p in hash){
			item[count] = hash[p];
			count++;
		}
		item = common.quicksort(item);
		return item;
	},
	checklink : function(link, value) {
		if (link.indexOf(value) >= 0) {
			return true;
		} else {
			return false;
		}
	},
	getFatherDir : function(url) {
		var num = url.lastIndexOf("/");
		if (num == -1) {
			return "";
		}
		if (num > 1 && (url.charAt(num - 2) == ":")) {
			return url;
		} else {
			return url.substring(0, num);
		}// already the top dir
	},
	restHTML: function(str){
		if (!common.__utilDiv) {
			common.__utilDiv = document.createElement("div");

		}
		var t = common.__utilDiv;
		t.innerHTML = (str + "");
		if (typeof(t.innerText) != 'undefined') {
			return t.innerText;
		} else if (typeof(t.textContent) != 'undefined') {
			return t.textContent;
		} else if (typeof(t.text) != 'undefined') {
			return t.text;
		} else {
			return '';
		}
	},
	sendReport : function(autoMail) {
		if(typeof autoMail=="undefined"){
			autoMail = common.autoMail;
		}
		var newwin = window.open("result", "", "");
		if (newwin == null) {
			alert("explorer fibbden the popup window");
			return;
		}
		
		newwin.opener = null; // disable change to page
		var $w = function(msg){
			return newwin.document.write(msg);
		};
		$w("<html><base href='"+location.host+"'/><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/><title>404 REPORT</title><body>");
		$w("<form action='"+common.emailAd+"' method='post' id='mail_form'>" +
				"<input name='charset' type='hidden' id='mail_charset'/>" +
				"<input name='total' type='hidden' id='mail_total'/>" +
				"<input name='subject' type='hidden' id='mail_subject'/>" +
				"<input type='hidden' name='body' id='mail_body'/>" +
				"<input type='submit' value='send report' id='report_send'/></form>");
		$w("<div id='id_msg'><table border=1><tr><th>type</th><th>total</th></tr>");
		$w("<tr><td>\u603b\u68c0\u6d4b\u94fe\u63a5\u6570</td><td>"+common.ajax.checkednum +"</td></tr>");
		$w("<tr><td>\u6b63\u5e38\u94fe\u63a5\u6570</td><td>"+common.ajax.normalnum + "</td></tr>");
		$w("<tr><td>\u8de8\u57df\u94fe\u63a5\u6570</td><td>"+ common.ajax.crossnum+"</td></tr>");
		$w("<tr><td>404\u94fe\u63a5\u6570</td><td>"+common.ajax.queue404.length+"</td></tr>");
		$w("<tr><td>\u68c0\u6d4b\u8017\u65f6</td><td>" + common.getCurTime(common.startTime,common.endTime)+"</td></tr>");
		$w("</table>");
		$w("<h2><font color=red>404 links:</font></h2><table border=1><tr><th>NO</th><th width=700>404 link</th><th width=300>title</th><th>from</th></tr>");
		
		//发送报告前对  father索引页面 按照total数量进行排序
		var item = common.sort(common.ajax.index404.hashTable);
		var totallen = 1; 
		for ( var i = item.length-1; i >= 0; i--) {
			var lenArr = item[i].idArray.length;
			for ( var j = 0; j < lenArr; j++) {
				//对于过长的URL，显示的时候优化
				var cuturl = common.ajax.queue404[item[i].idArray[j]].url;
				if( cuturl.length > 80){
					cuturl = cuturl.substring(0,80) + "...";
				}
				
				$w("<tr><td>" + totallen + "</td>" + "<td><a href='" + common.ajax.queue404[item[i].idArray[j]].url + "' target='_blank'>" 
						+ cuturl + "</a></td>");
				$w("<td>"+ common.ajax.queue404[item[i].idArray[j]].title +"</td>");
				if (j == 0){
					$w("<td rowspan=" + lenArr + ">" + "<a href='" + item[i].url + "' target='_blank'>"	+ item[i].url + "</a></td>");
				}
				$w("</tr>");
				totallen ++;
			}
		}
		$w("</table></div>");
		$w("<script>$=function(id){return document.getElementById(id)};var img=document.getElementsByTagName('img');for(var i=0;i<img.length;i++){img[i].width=100;img[i].height=50;if(img[i].getAttribute('lz_src'))" +
				"{img[i].src=img[i].getAttribute('lz_src');img[i].removeAttribute('lz_src');}else if(img[i].getAttribute('_src')){img[i].src=img[i].getAttribute('_src');img[i].removeAttribute('_src')};};" +
				"function sendEmail(){" +
				"$('mail_charset').value=(document.characterSet||document.charset)||'UTF-8';" +
				"$('mail_total').value = '" + common.ajax.queue404.length + "';" + 
				"$('mail_subject').value='" + location.host +"';$('mail_body').value=$('id_msg').innerHTML;$('mail_form').submit();};" +
				"var autoMail=" + autoMail + ";" +
				"if(autoMail){sendEmail();}else{$('report_send').onclick = sendEmail;};" +
				"</script>");
		$w("</body></html>");
		
		newwin.document.close();
	},
	rootSearch : function() {
		var newwin = window.open("root search", "", "");
		if (newwin == null) {
			alert("explorer fibbden the popup window");
			return;
		}
		
		newwin.opener = null; // disable change to page
		var $w = function(msg){
			return newwin.document.write(msg);
		};
		$w("<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/><title>path search</title><body>");
		if(!common.ajax){
			$w("run first!</body></html>");
			newwin.document.close();
			return;
		}
				

		var map=common.ajax.hashchecked.hashTable;
		var key=$('searchbar').value;
		var value=map[key];
		if(typeof value=='undefined'){
			$w('not found</body></html>');
			return;
		}
		$w('<h2><font color=red>path trace:</font></h2><table border=1 ><tr><th><a href="'+key+'" target=_blank>'+key+'</a></th></tr>');
		while(value){
			$w('<tr><td><a href=\"'+value+'\" target=_blank>'+value+'</a></td></tr>');
			value=map[value];
		}
		$w("</table></body></html>");

		newwin.document.close();
	}
};

// pop up window div
function CPopUp(w, h, x, y) {
	this.width = w;
	this.height = h;
	this.startx = x;
	this.starty = y;

	// div zIndex
	this.zctr = 2000;
	this.mydiv;
}
CPopUp.prototype.trackmouse = function(evt) {
	if ((common.currIDb !== null) && (common.currIDs !== null)) {
		var x = evt.pageX;
		var y = evt.pageY;
		common.currIDb.style.left = x + common.xoff + "px";
		common.currIDs.style.left = x + common.xoff + 5 + "px";
		common.currIDb.style.top = y + common.yoff + "px";
		common.currIDs.style.top = y + common.yoff + 5 + "px";
		return false;
	}
};
CPopUp.prototype.stopdrag = function() {
	common.currIDb = null;
	common.currIDs = null;
};
CPopUp.prototype.grab_id = function(evt) {
	common.xoff = parseInt(this.IDb.style.left) - evt.pageX;
	common.yoff = parseInt(this.IDb.style.top) - evt.pageY;
	common.currIDb = this.IDb;
	common.currIDs = this.IDs;
};
CPopUp.prototype.incrzindex = function() {
	this.zctr = this.zctr + 2;
	this.subb.style.zIndex = this.zctr;
	this.subs.style.zIndex = this.zctr - 1;
};
CPopUp.prototype.creatediv = function(id, top, left, width, height, shadowcolor) {
	var objdiv = document.createElement("DIV");
	var objname = "shop_" + 1;
	objdiv.id = id;
	objdiv.style.top = top + "px";
	objdiv.style.left = left + "px";
	objdiv.style.width = width + "px";
	objdiv.style.height = height + "px";
	objdiv.style.background = shadowcolor;
	objdiv.style.visibility = "visible";
	objdiv.style.overflow = "hidden";
	return objdiv;
};
/**
 * 创建浮动窗口
 */
CPopUp.prototype.CreateDialog = function() {
	this.zctr += 2;
	var barcolor = "black";
	//底层阴影
	var obj = this.creatediv("mydiv" + "_s", this.startx + 5, this.starty + 5,
			this.width, this.height, "#757A91");
	obj.style.position = "absolute";
	obj.style.filter = "Alpha(Opacity=80)";
	o.appendChild(obj);
	
	obj = this.creatediv("mydiv" + "_b", this.startx, this.starty, this.width,
			this.height, barcolor);
	obj.style.border = "outset #09f 1px";
	obj.style.position = "absolute";
	o.appendChild(obj);
	

	var inhtml = '<div id="mydiv" style="width:400px;height:16px;"><table width="400"><tbody><tr><td width="380"><div id="mydiv_h" style="top:100px;left:100px;width:380px;height:14px;background:black;"></div></td><td width="30" align="center"><a onmousedown="common.closeWin(\'mydiv_s\'); common.closeWin(\'mydiv_b\'); ui.stop(ui.button2);" ;="" style="cursor:pointer"><font color="red">X</font></a></td></tr></tbody></table></div><div id="mydiv_ov" style="width:400px;height:248px;background:rgb(255, 255, 238);"><p><table width="100%" border="1"><td><p>AJAX num:<select id="id_selected"></select><lable style="float:right;margin-right:10px"><input type="checkbox" id="checkbox_ck">check current page only</lable></p></td></table><p><button style="width:200px;height:50px" id="id_start_check">start check</button><lable id="id_check_tips" style="color:red;visibility:hidden;"> &nbsp; &nbsp;checking...&nbsp;&nbsp;</lable><lable id="id_checked_num" style="visibility:hidden;">0</lable></p><p><button id="id_send" style="height:30px">send report</button></p><input id="searchbar"/><button id="id_search" style="height:30px">root search</button></p></div>';
	
	obj.innerHTML = inhtml;
	
	this.IDh = document.getElementById("mydiv_h");// top title
	this.IDh.IDb = document.getElementById("mydiv_b");// hole page
	this.IDh.IDs = document.getElementById("mydiv_s");// background
	this.IDh.IDb.subs = this.IDh.IDs;
	this.IDh.IDb.subb = this.IDh.IDb;
	this.IDh.IDb.IDov = this.mydiv;
	this.IDh.IDs.style.MozOpacity = 0.5;
	this.IDh.IDb.zctr = this.zctr;
	this.IDh.IDb.style.zIndex = this.zctr;
	this.IDh.IDb.onmousedown = this.incrzindex;
	this.IDh.onmousedown = this.grab_id; // title mousedown events
	this.IDh.onmouseup = this.stopdrag;
};

//UI INTERFACE
function CUI() {
	this.lablerun;
	this.lablemaxnum = 0;
	this.select;
	this.input;
	this.ajax = null;
	this.runflag = false;
}
CUI.prototype.createElement = function(type) {
	return document.createElement(type);
};
CUI.prototype.start = function(obj) {
	common.startTime = new Date();
	common.endTime = null;
	common.singelPage = document.getElementById("checkbox_ck").checked;
	if (common.singelPage){//单页面扫描替换页面翻译函数
		Ajax.prototype.processTemp = Ajax.prototype.processEcho;
		Ajax.prototype.processEcho = function(str1,str1){};
	}
	else if (Ajax.prototype.processTemp){
		Ajax.prototype.processEcho = Ajax.prototype.processTemp;
	}
	
	this.runflag = true;
	obj.innerHTML = "stop";
	this.lablerun.style.visibility = "visible";
	this.lablemaxnum.style.visibility = "visible";
	if (common.ajax != null) {
		delete common.ajax;
		common.ajax = null;
	}
	common.ajax = new Ajax(this.select.value);
	var a = document.getElementsByTagName("A");
	
	common.ajax.runFlag = true;

	common.ajax.setlink(a);
	this.lablemaxnum.innerHTML = 0;
	this.timer = setInterval(this.updateNum(this), 100);
};
CUI.prototype.stop = function(obj) {
	obj.innerHTML = "start check";
	this.lablerun.style.visibility = "hidden";
	this.lablemaxnum.style.visibility = "hidden";
	this.runflag = false;
	if(common.ajax)
		common.ajax.runFlag = false;
	clearInterval(this.timer);
};
CUI.prototype.buttonmouse = function(objID) {
	return function(e) {
		if (this.innerHTML == "stop") {
			objID.stop(this);
		} else {
			objID.start(this);
		}
	};
};
CUI.prototype.updateNum = function(obj) {
	return function() {
		obj.lablemaxnum.innerHTML = common.ajax.checkednum;
		if (obj.runflag == true) {
			if (common.ajax.requestQue.length == 0) {
				// 延迟3秒判断结果,AJAX返回有延迟
				setTimeout(function checkAgain() {
					if (common.ajax.requestQue.length == 0) {
						obj.lablemaxnum.innerHTML = common.ajax.checkednum;
						obj.runflag = false;
						common.endTime = new Date();
						obj.lablerun.innerHTML = " &nbsp; &nbsp;check over&nbsp;&nbsp;";
						if(common.autoMail){
							common.sendReport();
						}
//						alert("checked over");

					} else {
						obj.timer = setInterval(obj.updateNum(obj), 100);
					}
				}, 1000);
				clearInterval(obj.timer);
			}
		}
	};
};
CUI.prototype.buttonsend = function() {
	return function(e) {
		if (common.ajax == null) {
			alert("start check first");
			return;
		}
		// objID.sendForm();
		common.sendReport(false);
	};
};

CUI.prototype.InitEvents = function() {
	this.select = $("id_selected");
	for ( var i = 1; i <= 10; i++) {
		var option = this.createElement("option");
		if (i == 10) {
			option.selected = "selected";
		}
		option.innerHTML = i;
		this.select.appendChild(option);
	}

	// MOUSE EVENT
	$("id_start_check").onmousedown = this.buttonmouse(this);
	
	this.lablerun = $("id_check_tips");
	this.lablemaxnum = $("id_checked_num");
	this.button2 = $("id_send");

	this.button2.onmousedown = this.buttonsend();
	$("id_search").onclick = common.rootSearch;
};

/**
 * hash
 */
function Hash() {
	this.hashTable = new Object();
}
Hash.prototype.isKeyExists = function(key) {
	return (key in this.hashTable);
};
Hash.prototype.add = function(key, value) {
	if (!(this.isKeyExists(key))) {
		this.hashTable[key] = value;
	}
};
Hash.prototype.del = function(key) {
	if (this.isKeyExists(key)) {
		delete (this.hashTable[key]);
	}
};
Hash.prototype.getValue = function(key) {
	return this.hashTable[key];
};
Hash.prototype.alter = function(key, value) {
	this.hashTable[key] = value;
};
/**
 * 保存404数组的索引值到索引数组
 * @param key
 * @param value
 */
Hash.prototype.addMap = function(key, value){
	if (this.isKeyExists(key)){
		this.hashTable[key].total ++;
		this.hashTable[key].idArray.push(value);
	}else{
		this.hashTable[key] = new LinkCF(value, key);
	}
};

// ajax并发连接
function Ajax(max_session) {
	this.max_session = max_session; // 最大并发数
	this.sessions = 0;			//当前运行ajax线程数
	this.requestQue = new Array(); // 请求数组
	this.hashchecked = new Hash(); // 已经检测的链接hash
	this.queue404 = new Array(); // 404链接数据存放数组
	this.index404 	= new Hash();	//404父链接索引用于打印报告排序排序
	
	this.checkednum = 0;
	this.normalnum = 0;
	this.crossnum = 0;
	this.host = "http://" + location.host;
	this.runFlag = false;
}
Ajax.prototype.createRequest = function(method, url, linkObj) {
	var request = new Object();
	request.ajax = false;
	try {
		request.ajax = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			request.ajax = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				request.ajax = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request.ajax = false;
			}
		}
	}
	if (!request.ajax) {
		return;
	}
	if (request.ajax) {
		request.url = url;
		request.method = method;
		request.linkObj = linkObj;
		if (this.sessions < this.max_session) {
			this.sessions += 1;
			this.sendRequest(request);
			return;
		} else {
			this.requestQue.push(request);
		}
	}
};
Ajax.prototype.sendRequest = function(request) {
	request.ajax.open(request.method, request.url, true);	//randNum防止缓存页面
	request.ajax.onreadystatechange = this.processRequest(request);
	request.ajax.setRequestHeader("If-Modified-Since","0");//防止页面缓存
	request.ajax.send(null);
};
Ajax.prototype.preworkBeforeRequest = function() {
	// Do something before sending request about object
};
Ajax.prototype.checkQue = function() {
	if (this.requestQue.length > 0) {
		var request = this.requestQue.shift();
		if (request) {
			// Do something before sending request about object
			// preworkBeforeRequest();alert(requestQue.length);
			this.sendRequest(request);
		} else if (this.sessions > 0) {
			this.sessions--;
		}
	} else if (this.sessions > 0) {
		this.sessions--;
	}
};
Ajax.prototype.processRequest = function(request) {
	var url = request.url;
	var linkObj = request.linkObj;
	return function() {
		if (this.readyState != 4) {
			return;
		}
		if (common.ajax.runFlag == false) {
			return;
		}
		common.ajax.checkednum++;
		/**
		 * 这里如果服务器发现缓存页面没有过期返回304 Not Modified，chrome读取本地数据并返回200
		 */
		if (this.status == 200) {
			// Handle the response text or XML
			
			common.ajax.normalnum++;
			if (common.ajax.exCheck.check404(this.responseText)){
				common.ajax.index404.addMap(linkObj.father,common.ajax.queue404.length);
				var obj404 = new Link404(url,linkObj.title);
				common.ajax.queue404.push(obj404);
			}
			else{
				common.ajax.processEcho(this.responseText, url);
			}
			
		} else {
			if (this.status == 0) {
				common.ajax.crossnum++;
			} else if (this.status == 404 ) { //302错误跳转
				common.ajax.index404.addMap(linkObj.father,common.ajax.queue404.length);
				var obj404 = new Link404(url,linkObj.title);
				common.ajax.queue404.push(obj404);
			}
		}

		common.ajax.checkQue();	//执行完成后检查队列

		request.ajax.onreadystatechange = null;
		delete request.linkObj;
		delete request.ajax;
		request.ajax = null;
		delete request;
		request = null;
	};
};


// suburl: path:
// return: http://ip/sub.html


/**
 * 路径构造
 * @param suburl:"./sub.html"
 * @param path: http://ip (from http://ip/index.html)
 */
Ajax.prototype.getFullPath = function(suburl, path) {
	var ftchar = suburl.charAt(0);
	if (ftchar == "/") {
		return this.host + suburl;
	} else if (ftchar != ".") {
		return path + "/" + suburl;
	} else if (suburl.substring(0, 2) == "./") {
		return path + suburl.substring(1, suburl.length);
	} else if (suburl.substring(0, 3) == "../") {
		return common.getFatherDir(path) + suburl.substring(2, suburl.length);
	}
	return path + "/" + suburl;
};

/**
 * 去除?后面数据
 * @param url 页面地址
 * @returns
 */
Ajax.prototype.getRealURL = function(url){
	if (!url){
		return "";
	}
	var len = url.indexOf("?");
	if(len >= 0) {
		url = url.substring(0,len);
	}
	else if((len=url.indexOf("#")) >= 0){
		url = url.substring(0,len);
	}
	return url;
};

/**
 * 从网页源码中提取链接
 * @param str 源码
 * @param url 源码网页URL
 */
Ajax.prototype.checkLinkFromPage = function(str, url) {
	
	var a = str.match(/<a .*?href\s*=.*?<\/a>/igm);
	if (a != null) {
		var path = common.getFatherDir(url);// 到父目录
		/*
		 * //记录该URL包含的链接数 if (this.hashchecked.isKeyExists(url)) {
		 * this.hashchecked.alter(url, a.length); }
		 */
		for ( var i = 0; i < a.length; i++) {
			var tmp = a[i].replace(/<a .*href\s*=[\s\"\']?/ig, "");
			var childurl = tmp.replace(/[\s>\"\']+.*/ig,"");
			if(!childurl){
				continue;
			}
			var inhtml = tmp.match(/>.*</g)[0].replace(/^>|<$/g,"");
			var linkObj = new LinkInfo(url,inhtml);
			this.filterLink(childurl, path, linkObj);
		}
	}
};

Ajax.prototype.processEcho = function(strHtml, url) {
//	echoXML = ajax.responseXml;

	this.checkLinkFromPage(strHtml, url);
	// Do something related with echo Text
	// Do something related with echo XML
};

/**
 * 条件去除需要过滤的链接
 * @param strLink
 * @param path 父目录
 * @param father 当前URL(相对扫出来的链接，自己是父链接)
 */
Ajax.prototype.filterLink = function(strLink, path, linkObj){
	if (!strLink ){
		return;
	}
	else {
		if(this.exCheck.checkDecode(strLink)){//需要对链接解码
			strLink = common.restHTML(strLink);
		}
		strLink = strLink.replace(/^\s+|\s+$/g, "");
		strLink = this.getRealURL(strLink);//只取网页地址，去掉后面的参数
		if (!strLink || this.exCheck.checkUrl(strLink)){
			delete linkObj;
			return;
		}
	}
	//过滤特殊链接
	if (strLink.match(common.ridestr)) {
		delete linkObj;
		return;
	} else {
		if (strLink.charAt(4) != ":"){	//判断http: 第4位是“：”
			strLink = this.getFullPath(strLink, path);
		}
		if (!this.hashchecked.isKeyExists(strLink)) {
			this.createRequest("GET", strLink, linkObj);
			this.hashchecked.add(strLink, linkObj.father);
		}
	}
};

/***
 * 从当前页面取得链接分析
 * @param a 
 */
Ajax.prototype.setlink = function(a) {
	this.hashchecked.add(location.href, null);

	var path = common.getFatherDir(location.href);
	for (i = 0; i < a.length; i++) {
		var attrihref = a[i].getAttribute("href");
		if (attrihref == null || attrihref == "" || common.checklink(attrihref, "#")) {
			continue;
		}
		var tmp = a.item(i).href;
		if(!tmp){
			continue;
		}
		var linkObj = new LinkInfo(location.href,a[i].innerHTML);
		this.filterLink(tmp, path, linkObj);
	}
};

/**
 * 页面检测标准
 */
Ajax.prototype.exCheck = {
	/**
	 * 404链接检测标准
	 * @param strHtml 网页内容
	 * @returns {Boolean} false-检测失败 true-检测成功
	 */
	check404 :	function(strHtml){
		return false;
	},
	/**
	 * //默认需要对链接解码 很多网页对链接escHTML
	 * @param url
	 * @returns {Boolean}
	 */
	checkDecode : function(url){
		if(url.match(/&#[0-9]{2,3};/)){
			return true;
		}
		return false;
	},
	/**
	 * 特殊字符过滤标准
	 * @param url 链接地址
	 * @returns {Boolean}
	 */
	checkUrl : function(url){
		return false;
	}
};
common.exCheckArray = [
	{
		host : "v.qq.com",
		check404 : function(strHtml){
			if(common.checklink(strHtml,"http://imgcache.qq.com/mediastyle/tenvideo/css/404.css")){
				return true;
			}
			return false;
		},
		checkDecode : function(url){//腾讯视频不需解码，没有这种链接
			return false;
		},
		checkUrl : function(url){
			if(url.match(/\$|{|http:\/\/v.qq.com\/boke\/play\//)){//过滤模版内容
				return true;
			}
			return false;
		}
	},
	{
		host : "film.qq.com",
		check404 : function(strHtml){//404页面特征
			if(common.checklink(strHtml,"<meta http-equiv=\"refresh\" content=\"0;url=http://v.qq.com\">")){
				return true;
			}
			return false;
		},
		checkDecode : function(url){//腾讯视频不需解码，没有这种链接
			return false;
		},
		checkUrl : function(url){
			if(url.match(/\$|{|http:\/\/v.qq.com\/boke\/play\//)){//过滤模版内容
				return true;
			}
			return false;
		}
	},
	{
		host : "live.qq.com",
		checkUrl : function(url){
			if(url.match(/\$|{/)){//过滤模版内容
				return true;
			}
			return false;
		}
	},
	{
		host : "music.qq.com",
		checkUrl : function(url){
			if(url.match(/%sortUrl%$|%\(|\<%=/)){//过滤模版内容
				return true;
			}
			return false;
		}
	}
];

(function init(){
	for(var i=0; i < common.exCheckArray.length; i++){
		if(common.exCheckArray[i].host == location.host){
			for (var p in common.exCheckArray[i]){
				Ajax.prototype.exCheck[p] = common.exCheckArray[i][p];
			}
			break;
		}
	}
})();

if (document.getElementById("mydiv_s") == null) {
	var mypopup = new CPopUp(400, 248, 100, 100);
	document.onmousemove = mypopup.trackmouse;
	mypopup.CreateDialog();
	var ui = new CUI();
	ui.InitEvents();
	if (common.autoRun){
		ui.start($("id_start_check"));
	}
}
