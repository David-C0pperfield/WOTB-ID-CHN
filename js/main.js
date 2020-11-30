$(function() {
    fetchData() //接受json

    var beginIndex = 0,
        stepLength = 20,
        endingIndex = beginIndex + stepLength - 1,
        dataIndex = beginIndex,
        overflowIndex = 0,
        overflowStep = 0;

    $('.flipBtn.next').on('click', function() {
        beginIndex += stepLength
        endingIndex += stepLength
        dataIndex = beginIndex
        fetchData()
    })
    $('.flipBtn.prev').on('click', function() {
        beginIndex += -stepLength
        endingIndex += -stepLength
        dataIndex = beginIndex
        fetchData()
    })

    function fetchData() {
        $.ajax({
            url: "./js/clan.json",
            dataType: "json",
            error: function() { console.log('数据获取失败') },
            success: function(data) {
                if (data === undefined) return false;
                var total_entries = data.length;
                replaceBrackets('#register-banner .info', total_entries, 'total_entries');

                (function judgePage() {
                    if (beginIndex <= 0) {
                        $('.flipBtn.prev').hide()
                    } else $('.flipBtn.prev').show()
                    if (endingIndex >= total_entries - 1) {
                        $('.flipBtn.next').hide()
                    } else $('.flipBtn.next').show()
                })();
                (function loadList() {
                    $('#content tbody').empty()
                    if (beginIndex < 0) {
                        beginIndex = 0
                        endingIndex = beginIndex + stepLength - 1
                        console.log('less than 0' + beginIndex, endingIndex)
                    } //index为负数时的处理
                    if (endingIndex > total_entries - 1) {
                        overflowIndex = endingIndex
                        endingIndex = total_entries - 1
                        overflowStep = overflowIndex - endingIndex
                        console.log(overflowStep, beginIndex, endingIndex)
                    } //超出的处理
                    if (overflowStep != 0) {
                        endingIndex += overflowStep
                        overflowStep = 0
                    } //补回溢出的读取长度


                    while (dataIndex >= beginIndex && dataIndex <= endingIndex) {
                        let ID = data[dataIndex].ID;
                        let Tag = data[dataIndex].Tag;
                        let Full = data[dataIndex].Full;
                        let Desc = data[dataIndex].Desc;

                        let insertHTML = '<tr><td>' + ID +
                            '</td><td>' + '[' + Tag + '] ' + Full +
                            '</td><td>' + Desc + '</td></tr>'
                        $('#content tbody').append(insertHTML)
                        if (dataIndex < total_entries - 1) {
                            dataIndex++
                        } else {
                            return
                        }
                    }


                })();
            }
        })
    }

    $(document).on('keydown', function(e) {
        var keyFind = e.which
        if ((e.ctrlKey && keyFind == 70) || (e.metaKey && keyFind == 70)) {
            e.preventDefault();
            $('#searchstr').focus();
        }
    })
    $('#search_btn').on('click', function() { startSearching() })
        //通知栏进入后自动下拉
        // slideDownNotification()

    function slideDownNotification() {
        setTimeout(function() {
            $('#notification_zone').slideDown(250);
        }, 450)
    }
    $('#searchstr').on('click', function() { //聚焦时显示横幅
        if ($('#searchstr').is(':focus')) $('#notification_zone').slideDown(250);
    })
    $('#searchstr').on('keydown', function(e) { //检测回车
        var key = e.which;
        if (key == 13) startSearching();
    });
    $(document).on('click', function(e) { //单击收回横幅
        var target = $(e.target)
        if (!target.is('#searchstr') && !target.is('#notification_zone') || target.is('#notification_zone .toCollapse' && !target.is('#notification_zone *'))) {
            slideUpNotification()
        }
    })

    function startSearching() {
        // highlight()
        getClanData()
        slideUpNotification()
    }

    function slideUpNotification() {
        if ($('#notification_zone').css('display') != 'none') $('#notification_zone').slideUp(250);
    }

    function getClanData() {
        var keyword = $('#searchstr').val();
        var filter = ["\\[", "\\]", "\\{", "\\}", "\\(", "\\)", "\\+", "\\-", "\\*", "\\/"]

        if (keyword == '' || undefined) {
            alert('请输入关键词。')
            return
        }

        for (let i in keyword) {
            for (let j in filter) {
                filtSpecial = new RegExp(filter[j], 'g')
                keyword = keyword.replace(filtSpecial, filter[j])
            }
        }
        console.log(keyword)

        // keyword = keyword.replace(/[\[\]\{\}\(\)\+\-\*\/]/g, '')
        // var comparison = toCompare(keyword, data)
        // renderResult(comparison)
        $.ajax({
            url: './js/clan.json',
            dataType: 'json',
            error: function() { console.log('数据获取失败') },
            success: function(data) {
                toCompare(keyword, data)
            }
        })
    }

    function toCompare(keyword, data) {
        if (!(data instanceof Array)) return
        let len = data.length,
            arr = [],
            reg = new RegExp(keyword, 'i'),
            strictReg = new RegExp(keyword);
        for (let i = 0; i < len; i++) {
            if (String(data[i].Tag).match(reg) || String(data[i].Fullname).match(reg) || String(data[i].ID).match(reg)) {
                arr.push(data[i])
            }
        }
        for (let i in arr) {
            console.log(arr[i])
        }

    }

    function renderResult() {
        if (!(list instanceof Array)) return
        var len = list.length,
            tem = null;
        for (var i = 0; i < len; i++) {

        }
    }
    var i = 0;
    var sCurText;

    // function highlight() {
    //     clearSelection();
    //     //var receiveText = replace($('#searchstr').val())
    //     var searchText = String($('#searchstr').val())
    //     var flag = 0

    //     var regExp = new RegExp(searchText, 'gi');
    //     var content = $('#content tbody tr td').text(); //搜索范围
    //     if (searchText == (null || '')) {
    //         alert('关键词不能为空！')
    //         return
    //     } else if (!regExp.test(content)) {
    //         alert("没有找到相关内容");
    //         return;
    //     } else if (sCurText != searchText) {
    //         i = 0;
    //         sCurText = searchText;
    //         // $('#notice').prepend('<p>查找到 <b>' + sCurText + '</b></p>')
    //     }
    //     //高亮显示
    //     $('tr').each(function() {
    //         var html = $(this).html();
    //         var newHtml = html.replace(regExp, function(txt) {
    //             return '<span class="highlight">' + txt + '</span>'
    //         });
    //         $(this).html(newHtml);
    //         flag = 1;
    //     });
    //     //定位并提示信息
    //     if (flag == 1) {
    //         if ($(".highlight").length > 1) {
    //             $('#register-banner').html('共查找到' + $(".highlight").length + '条结果')
    //             var _top = $(".highlight").eq(i).offset().top +
    //                 $(".highlight").eq(i).height();
    //             var _tip = $(".highlight").eq(i).parent().find("strong").text();
    //             $(".highlight").eq(i).css({
    //                 'background': '#FF0000',
    //                 'font-weight': 'bold',
    //             })
    //             if (_tip == "") {
    //                 _tip = $(".highlight").eq(i).parent().parent().find("strong").text();
    //             }

    //             var _left = $(".highlight").eq(i).offset().left;
    //             var _tipWidth = $("#tip").width();

    //             if (_left > $(document).width() - _tipWidth) {
    //                 _left = _left - _tipWidth;
    //             }
    //             $("#tip").html(_tip).show();
    //             $("#tip").offset({
    //                 top: _top,
    //                 left: _left
    //             });
    //             $("#search_btn").html("下一个");
    //         } else {
    //             var _top = $(".highlight").offset().top + $(".highlight").height();
    //             var _tip = $(".highlight").parent().find("strong").text();
    //             var _left = $(".highlight").offset().left;
    //             $('#tip').show();
    //             $("#tip").html(_tip).offset({
    //                 top: _top,
    //                 left: _left
    //             });
    //         }
    //         $("html, body").animate({
    //             scrollTop: _top - 185
    //         });
    //         i++;
    //         if (i > $(".highlight").length - 1) {
    //             i = 0;
    //         }
    //     }
    // }

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

    // function clearSelection() {
    //     $('tr').each(function() {
    //         //找到所有highlight属性的元素；
    //         $(this).find('.highlight').each(function() {
    //             $(this).replaceWith($(this).html()); //将他们的属性去掉；
    //         });
    //     });
    // }


    function replaceBrackets(target, content, name) {
        //替换某个含有{{xxxx}}的文本
        var origin = $(target).text()
        if (name == '') {
            var processedText = origin.replace(new RegExp('\\{\\{.*\\}\\}', 'g'), content)
        } else { var processedText = origin.replace(new RegExp('\\{\\{' + name + '\\}\\}', 'g'), content) }
        $(target).text(processedText)
    }
    //锚点相关
    // $('#content table tbody tr').on('click', function() {
    //     removeHighlightClan()
    //     highlightClanLine($(this))
    // })

    // function highlightClanLine(e) {
    //     var clanID = '#' + e.attr('id')
    //     e.addClass("highlight2");
    //     // location.href = clanID
    //     // console.log(location.href)
    // }

    // function removeHighlightClan() { $('.highlight2').removeClass('highlight2') }
    // window.location.hash

})