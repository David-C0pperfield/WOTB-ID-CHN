$(function() {
    $(document).on('keydown', function(e) {
        var keyFind = e.which
        if ((e.ctrlKey && keyFind == 70) || (e.metaKey && keyFind == 70)) {
            e.preventDefault();
            $('#searchstr').focus();
        }
    })
    $('#search_btn').on('click', highlight)
    $('#searchstr').on('keydown', function(e) {
        var key = e.which;
        if (key == 13) highlight();
    });

    var i = 0;
    var sCurText;

    function highlight() {
        clearSelection();
        var searchText = String($('#searchstr').val())
        var flag = 0



        var regExp = new RegExp(searchText, 'gi');
        var content = $("#content").text(); //获取#content中的文本
        if (searchText == (null || '')) {
            tipPopup('关键词不能为空！')
        } else if (!regExp.test(content)) {
            tipPopup("没有找到相关内容");
            return;
        } else if (sCurText != searchText) {
            i = 0;
            sCurText = searchText;
            $('#notice').prepend('<p>查找到 <b>' + sCurText + '</b></p>')
        }
        //高亮显示
        $('tr').each(function() {
            var html = $(this).html();
            var newHtml = html.replace(regExp, '<span class="highlight">' + sCurText + '</span>');
            $(this).html(newHtml);
            flag = 1;
        });
        //定位并提示信息
        if (flag == 1) {
            if ($(".highlight").length > 1) {
                var _top = $(".highlight").eq(i).offset().top +
                    $(".highlight").eq(i).height();
                var _tip = $(".highlight").eq(i).parent().find("strong").text();
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
    document.documentElement.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    }, false);
})