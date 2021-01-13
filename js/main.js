$(function() {
    calcTableHeight();
    $(window).resize(function() {
        calcTableHeight();
    })
    getQueryStr('cid')
    fetchData() //接受json

    // fetchData() //接受json
    var beginIndex = 0,
        stepLength = 20,
        endingIndex = beginIndex + stepLength - 1,
        dataIndex = beginIndex,
        overflowIndex = 0,
        overflowStep = 0;
    $(document).on('click', '.flipBtn.back', function() {
        beginIndex = beginIndex
        endingIndex = endingIndex
        dataIndex = beginIndex
        fetchData()
        $('.flipBtn').show()
        $('.flipBtn.back').hide()
    })
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
                $('table tbody').animate({ scrollTop: 0 }, 500)
                if (data === undefined) return false;
                var total_entries = data.length;
                info('收录', total_entries);
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

                    } //index为负数时的处理
                    if (endingIndex > total_entries - 1) {
                        overflowIndex = endingIndex
                        endingIndex = total_entries - 1
                        overflowStep = overflowIndex - endingIndex

                    } //超出的处理
                    if (overflowStep != 0) {
                        endingIndex += overflowStep
                        overflowStep = 0
                    } //补回溢出的读取长度

                    while (dataIndex >= beginIndex && dataIndex <= endingIndex) {
                        insertData(data, dataIndex)
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
    $('.btn.resetBtn>*').on('click', function() {
        removeInput('#searchstr');
        $('#searchstr').focus();
    })

    function slideDownNotification() {
        setTimeout(function() {
            $('#notification_zone').slideDown(250);
        }, 450)
    }
    $('#searchstr').on('click', function() { //聚焦时显示横幅
        if ($('#searchstr').is(':focus')) {
            $('#notification_zone').slideDown(250)
        };
    })
    $('#searchstr').on('keydown', function(e) { //检测回车
        var key = e.which;
        if (key == 13) startSearching();
    })
    $(document).on('click', function(e) { //单击收回横幅
        var target = $(e.target)
        if (!target.is('#searchstr') && !target.is('#notification_zone .wrap') && !target.is('#notification_zone .wrap *') || (target.is('#notification_zone .toCollapse') || target.is('#notification_zone .toCollapse *'))) {
            slideUpNotification()
        }
    })
    $(document).on('click', '#content tbody tr', function() {
        let cid = $(this).attr('id');
        window.history.pushState({ Page: 1 }, '', '?cid=' + cid)
        getQueryStr('cid')
    })

    function startSearching() {
        // highlight()
        getClanData()
        slideUpNotification()
        if ($('#searchstr').val() == '') return
        $('.flipBtn').hide()
        $('#register-banner').prepend('<span class="btn flipBtn back">\
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\
        </svg>返回\
    </span>');
        $('.flipBtn.back').show()
    }

    function slideUpNotification() {
        if ($('#notification_zone').css('display') != 'none') $('#notification_zone').slideUp(250);
    }

    function getClanData() {
        var keyword = $('#searchstr').val();

        if (keyword == '' || undefined) {
            alert('请输入关键词。')
            return
        }
        $.ajax({
            url: './js/clan.json',
            dataType: 'json',
            error: function() { console.log('数据获取失败') },
            success: function(data) {
                $('#content tbody').empty()
                let result = toCompare(keyword, data),
                    resultCount = result.length
                if (resultCount == 0) { insertData() }
                info('搜索', resultCount);
                for (let i in result) {
                    insertData(result, i)
                }
            }
        })
    }

    function toCompare(keyword, data, idSearch) {
        let filter = ["\\[", "\\]", "\\{", "\\}", "\\(", "\\)", "\\+", "\\-", "\\*", "\\/"]
        if (isNaN(Number(keyword))) {
            for (let i in keyword) {
                for (let j in filter) {
                    filtSpecial = new RegExp(filter[j], 'g')
                    keyword = keyword.replace(filtSpecial, filter[j])
                }
            }
        } else {
            var strictReg = new RegExp('^' + keyword + '$');
        }

        if (!(data instanceof Array)) return
        var len = data.length,
            arr = [],
            reg = new RegExp(keyword, 'i');
        if (idSearch) {
            for (let i = 0; i < len; i++) {
                if (String(data[i].ID).match(strictReg || reg)) {
                    arr.push(data[i])
                }
            }
        } else {
            for (let i = 0; i < len; i++) {
                if (String(data[i].Tag).match(reg) || String(data[i].Full).match(reg) || String(data[i].ID).match(strictReg || reg)) {
                    arr.push(data[i])
                }
            }
        }
        return arr
    }

    function info(action, number) {
        $('.info .action').html(action);
        $('.info .total_entries').html(number);
    }

    function insertData(d, i) {
        if (!d && !i) { $('#content tbody').append('<tr><td>没有搜索到相关内容，相关军团可能未被收录</td></tr>') }
        let ID = d[i].ID,
            Tag = d[i].Tag,
            Full = d[i].Full,

            Desc = d[i].Desc;
        if (Desc == '') { Desc = '--' } else if (Desc.length > 20) { Desc = Desc.substr(0, 19) + '…' }

        let insertHTML = '<tr id=' + ID + '><td>' + ID +
            '</td><td>' + '[' + Tag + '] ' + Full +
            '</td><td>' + Desc + '</td></tr>'
        $('#content tbody').append(insertHTML)
    }

    function removeInput(t) {
        $(t).val('')
    }

    function calcTableHeight() {
        tablePosition = $(window).height() - $('table thead').outerHeight() - $('#content #register-banner').outerHeight() - $('#head').outerHeight()
        $('table tbody').css({ 'height': tablePosition + 'px' })
        return tablePosition;
    }
    // 军团单独显示
    function getQueryStr(n) {
        let reg = new RegExp('(^|&)' + n + '=([^&]*)(&|$)'),
            result = window.location.search.substr(1).match(reg),
            decodeR = unescape(result[2]);
        if (result != null) getClanByID(decodeR);
        return null
    }

    function getClanByID(id) {
        var id = Number(id);
        $.ajax({
            url: './js/clan.json',
            dataType: 'json',
            error: function() { console.log('数据获取失败') },
            success: function(data) {
                if (typeof(id) != 'number' || id == 0 || id % 1 != 0) return;
                toCompare(id, data, 1)
            }
        })
    }

})