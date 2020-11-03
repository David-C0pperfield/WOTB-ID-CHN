$(function() {
    $(document).on('keydown', function(e) {
        var keyFind = e.which
        if ((e.ctrlKey && keyFind == 70) || (e.metaKey && keyFind == 70)) {
            e.preventDefault();
            $('#searchstr').focus();
        }
    })
    $('#search_btn').on('click', function() {
        startSearching()

    })

    $('#searchstr').on('click', function() {
        if ($('#searchstr').is(':focus')) {
            $('#notification_zone').slideDown(250);
        }
    })
    $('#searchstr').on('keydown', function(e) {
        var key = e.which;
        if (key == 13) startSearching();
    });
    $(document).on('click', function(e) {
        var target = $(e.target)
        if (!target.is('#searchstr') && !target.is('#notification_zone') && !target.is('#notification_zone *')) {
            slideUpNotification()
        }
    })


    function startSearching() {
        highlight()
        slideUpNotification()
    }

    function slideUpNotification() {
        if ($('#notification_zone').css('display') != 'none') {
            $('#notification_zone').slideUp(250);
        }
    }
    var i = 0;
    var sCurText;

    function highlight() {
        clearSelection();

        var searchText = String($('#searchstr').val())
        var flag = 0



        var regExp = new RegExp(searchText, 'gi');
        var content = $('#content tbody tr td').text(); //搜索范围
        if (searchText == (null || '')) {
            alert('关键词不能为空！')
            return
        } else if (!regExp.test(content)) {
            alert("没有找到相关内容");
            return;
        } else if (sCurText != searchText) {
            i = 0;
            sCurText = searchText;
            // $('#notice').prepend('<p>查找到 <b>' + sCurText + '</b></p>')
        }
        //高亮显示
        $('tr').each(function() {
            var html = $(this).html();
            var newHtml = html.replace(regExp, function(txt) {
                return '<span class="highlight">' + txt + '</span>'
            });
            $(this).html(newHtml);
            flag = 1;
        });
        //定位并提示信息
        if (flag == 1) {
            if ($(".highlight").length > 1) {
                $('#register-banner').html('共查找到' + $(".highlight").length + '条结果')
                var _top = $(".highlight").eq(i).offset().top +
                    $(".highlight").eq(i).height();
                var _tip = $(".highlight").eq(i).parent().find("strong").text();
                $(".highlight").eq(i).css({
                    'background': '#FF0000',
                    'font-weight': 'bold',
                })
                if (_tip == "") {
                    _tip = $(".highlight").eq(i).parent().parent().find("strong").text();
                }

                var _left = $(".highlight").eq(i).offset().left;
                var _tipWidth = $("#tip").width();

                if (_left > $(document).width() - _tipWidth) {
                    _left = _left - _tipWidth;
                }
                $("#tip").html(_tip).show();
                $("#tip").offset({
                    top: _top,
                    left: _left
                });
                $("#search_btn").html("下一个");
            } else {
                var _top = $(".highlight").offset().top + $(".highlight").height();
                var _tip = $(".highlight").parent().find("strong").text();
                var _left = $(".highlight").offset().left;
                $('#tip').show();
                $("#tip").html(_tip).offset({
                    top: _top,
                    left: _left
                });
            }
            $("html, body").animate({
                scrollTop: _top - 185
            });
            i++;
            if (i > $(".highlight").length - 1) {
                i = 0;
            }
        }
    }

    // function tipPopup(c) {
    //     var head_position = $('#head').offset().top
    //     var head_height = $('#head').height();
    //     if ($('#popup_tip').length == 0) {
    //         $('body').append('<div id="popup_tip">' + c + '</div>');
    //     } else { $('#popup_tip').html(c) }
    //     $('#popuo_tip').css({
    //         'position': 'absolute',
    //         'top': '0',
    //     });
    // }

    function clearSelection() {
        $('tr').each(function() {
            //找到所有highlight属性的元素；
            $(this).find('.highlight').each(function() {
                $(this).replaceWith($(this).html()); //将他们的属性去掉；
            });
        });
    }
    setTimeout(function() {
        $('#notification_zone').slideDown(250);
    }, 450)
    replaceBrackets('#register-banner', 'total_entries', ($('#content table tr').length - 1))

    function replaceBrackets(target, name, content) {
        //替换某个含有{{xxxx}}的文本
        var origin = $(target).text()
        if (name == '') {
            var processedText = origin.replace(new RegExp('\\{\\{.*\\}\\}', 'g'), content)
        } else { var processedText = origin.replace(new RegExp('\\{\\{' + name + '\\}\\}', 'g'), content) }
        $(target).text(processedText)

    }
    //锚点相关
    $('#content table tbody tr').on('click', function() {
        removeHighlightClan()
        highlightClanLine($(this))
    })

    function highlightClanLine(e) {
        var clanID = '#' + e.attr('id')
        e.addClass("highlight2");
        // location.href = clanID
        // console.log(location.href)
    }

    function removeHighlightClan() { $('.highlight2').removeClass('highlight2') }
    // window.location.hash
})