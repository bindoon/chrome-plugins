// ==UserScript==
// @name          阿里内外周报系统标题自动更正
// @namespace     com.popotang.weekly.title
// @description   阿里内外周报系统标题自动更正
// @include       http*://work.alibaba-inc.com/work/sns/workreportModify*
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @run-at        document-end
// ==/UserScript==


var loopcnt = 0, timer = null;
timer = setInterval(function () {

    if (++loopcnt == 100) {
        clearInterval(timer)
        timer = null;
        console.warn("【周报标题插件】貌似匹配不到元素，先自行屏蔽插件吧");
        return;
    }

    var tbTitle = document.querySelector("[name='reportTitle']"),
        tbEndTime = document.querySelector(".endTimeReport");

    if (tbTitle && tbTitle.nodeType == 1 && tbEndTime && tbEndTime.nodeType == 1 && !!tbEndTime.value) {
        clearInterval(timer);
        timer = null;

        var m = null,
            oldValue = "",
            nickname = "",
            datestr = "";

        oldValue = tbTitle.value;
        datestr = tbEndTime.value;

        if (m = oldValue.match(/\((.+)\)/)) {
            nickname = m[1];
        }
        tbTitle.value = "【前端】" + nickname + " 周报 " + datestr + " / [Front End] wuliang  Weekly Report " + datestr;
    }

}, 3000);
