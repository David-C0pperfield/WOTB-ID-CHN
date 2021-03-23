$(function() {
    var announcement, r = {} //,Rule
    $.ajaxSetup({ async: false })
    $.get("announcement.txt", function(d) { //Data
        announcement = d;
    });

    function processDate(a) {
        p = a

        //Version Info
        var ver = p.match(/Ver:(.*)[\n|$]?/g)
        ver = unescape(ver).replace(/Ver:(.*)[\n|$]?/g, '<span class="version">版本$1</span>')
        p = p.replace(/Ver:(.*)[\n|$]?/g, '')

        /* ------ */
        p = p.replace(/^\*(.+)/gm, '<li>$1</li>')
        p = p.replace(/^\s*(\n)?(.+)/gm, function(temp) {
            return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(temp) ? temp : '<p>' + temp + '</p>';
        });
        p = p.replace(/\_{3}([^\*]+)[\_]{3}/g, '<b><i>$1</i></b>')
        p = p.replace(/\_{2}([^\*]+)[\_]{2}/g, '<b>$1</b>')
        p = p.replace(/\_{1}([^\*]+)\_{1}/g, '<i>$1</i>')
            //link
        p = p.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/gm, '<a href="$2" title="$4">$1</a>')
            /* 参考https://codepen.io/kvendrik/pen/Gmefv */

        return [p, ver]
    }
    var processed = processDate(announcement)
    console.log(processed);
    $('#announcement_zone #part1').html(processed)

})