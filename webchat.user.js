// ==UserScript==
// @name          webchat打点
// @namespace     webchat.spm
// @description   webchat打点
// @include       https://wx.qq.com/*
// @version       2.0
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @run-at        document-end
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
var msgdom = $('<table border=1 >').css({
  position:'fixed',
  top:0,
  left:0,
  background:'#fff',
  color:'#000'
});
msgdom.appendTo($('body'));
msgdom.append('<tr><<th>早</th><th>晚</th><th>昵称</th></tr>');
function log(msg,isnew) {
  if (isnew) {
    $('<tr>').attr('data-nick',msg.title).html(['<td>',msg.morning,'</td><td>',msg.night,'</td><td>',msg.title,'</td>'].join('')).appendTo(msgdom)
  } else {
    msgdom.find('tr[data-nick="'+msg.title+'"]').html(['<td>',msg.morning,'</td><td>',msg.night,'</td><td>',msg.title,'</td>'].join(''));
  }
}

var peopleMap = {};
function getChatContent() {
  var title = $('#chatArea .title_name').text();
  if (!title.match(/和君8届北京现场/)) {
    return;
  };
  if (true) {};
   var chatdom = $('#chatArea .avatar');
   chatdom.each(function(i,dom) { 
       var avatar = $(dom);
       if(avatar.attr('has-checked')){
            return;
       }

       avatar.attr('has-checked',true);

       var title = avatar.attr('title');
       var pic = avatar.attr('src');

       var content = avatar.parent().find('.js_message_plain').text();
       var morning = '';
       var night = '';
       if (content.match(/早上好/)) {
          morning = 'Y';
       } else if (content.match(/晚安/)) {
          night = 'Y';
       }

       var isnew = true;

       if(title in peopleMap) {
          isnew = false;
          if ( peopleMap[title].morning && peopleMap[title].night) {
            return;
          };
          peopleMap[title].morning= morning||peopleMap[title].morning;
          peopleMap[title].night= night||peopleMap[title].night;

       } else {
         peopleMap[title]={
            title:title,
            pic:pic,
            morning:morning,
            night:night
         };
       }

      log(peopleMap[title],isnew);
   });
}
    setInterval(function(){
        getChatContent();
    },1000);
});

