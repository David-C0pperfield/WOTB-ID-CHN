$(function() {
    var clanData,
        beginIndex = 0,
        stepLength = 20,
        endingIndex = beginIndex + stepLength - 1,
        dataIndex = beginIndex,
        overflowIndex = 0,
        overflowStep = 0,
        fileExtList = {
            1: 'png',
            2: 'jpg',
            3: 'jpeg'
        };
    $.ajaxSetup({ async: false })
    $.ajax({
        url: "./js/clan.json",
        dataType: "json",
        error: function() { console.log('数据获取失败') },
        success: function(data) { clanData = data }
    })

    calcTableHeight();
    $(window).resize(function() { calcTableHeight(); })
    getClanData('byId', getQueryStr('cid'));

    if (getQueryStr('keyword')) {
        getClanData()
        $('#searchstr').val(getQueryStr('keyword'))
    } else fetchData()

    $(document).on('click', '.flipBtn.back', function() {
        dataIndex = beginIndex
        $('.flipBtn').show()
        $('.flipBtn.back').hide()
        window.history.replaceState({ Page: 1 }, '', './')
        fetchData()
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
        restorePosition()
        if (clanData === undefined) return false;
        var total_entries = clanData.length;
        info('收录', total_entries);
        (function judgePage() {
            if (beginIndex <= 0) { $('.flipBtn.prev').hide() } else $('.flipBtn.prev').show()
            if (endingIndex >= total_entries - 1) { $('.flipBtn.next').hide() } else $('.flipBtn.next').show()
        })();
        (function loadList() {
            $('#content tbody').empty()
            if (beginIndex < 0) { //index为负数时
                beginIndex = 0
                endingIndex = beginIndex + stepLength - 1

            }
            if (endingIndex > total_entries - 1) { //超出的处理
                overflowIndex = endingIndex
                endingIndex = total_entries - 1
                overflowStep = overflowIndex - endingIndex

            }
            if (overflowStep != 0) { //补回溢出的读取长度
                endingIndex += overflowStep
                overflowStep = 0
            }
            while (dataIndex >= beginIndex && dataIndex <= endingIndex) {
                insertData(clanData, dataIndex, 'table')
                if (dataIndex < total_entries - 1) dataIndex++;
                else return
            }
        })();
    }

    $(document).on('keydown', function(e) {
        var keyFind = e.which
        if ((e.ctrlKey && keyFind == 70) || (e.metaKey && keyFind == 70)) {
            e.preventDefault();
            $('#searchstr').focus();
        }
    })
    $('#search_btn').on('click', function() {
        if ($('#searchstr').val() == '') return
        startSearching()
    })
    $('.btn.resetBtn>*').on('click', function() {
        removeInput('#searchstr');
        $('#searchstr').focus();
    })

    function slideDownNotification() { setTimeout(function() { $('#notification_zone').slideDown(250); }, 450) }
    $('#searchstr').on('click', function() { //聚焦时显示横幅
        if ($('#searchstr').is(':focus')) $('#notification_zone').slideDown(250)
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

    //详情浮层
    $(document).on('click', '#content tbody tr', function() { //点击条目，显示浮层
        let cid = $(this).attr('data-clan-id');
        window.history.pushState({ Page: 3 }, '', '?cid=' + cid)
        getClanData('byId', getQueryStr('cid'));
        showDetail()
    })
    $(document).on('mousedown', '#content tbody tr', function(e) {
        if (e.which != 1) return
        $(this).css({ 'background-color': 'rgba(70, 94, 109, 0.5)' })
    })
    $(document).on('mouseup', '#content tbody tr', function() {
        $(this).removeAttr('style')
    })
    $(document).on('click', '#detail .clanFamily [data-clan-id]', function() { //点击相关军团，切换显示
        let cid = $(this).attr('data-clan-id');
        window.history.pushState({ Page: 4 }, '', '?cid=' + cid)
        $('#detail .content').fadeOut(250)
        setTimeout(function() {
            $('#detail .content>*').remove();
            getClanData('byId', getQueryStr('cid'));
        }, 200)
        showDetail()
        $('#detail .content').fadeIn(350)
    })

    $('#detail').on('click', function(e) { //关闭浮层
        let target = $(e.target)
        if (!target.is('#detail .inner *') || target.is('#detail .dismissBtn *')) restoreDetailWindow()
    })

    function restoreDetailWindow() {
        window.history.replaceState({ Page: 1 }, '', './')
        $('#detail .inner').animate({ 'height': '0' }, 500)
        $('#detail').fadeOut(600, function() { $('#detail .content').empty() });
        document.title = '闪击战ID大百科'
        $('meta[name="description"]').attr('content', '本网页旨在帮助国服玩家刊载军团简介。有意见或建议请加Q群：715200589')
    }

    function startSearching() {
        if ($('#searchstr').val()) window.history.pushState({ Page: 2 }, '', '?keyword=' + $('#searchstr').val());
        else {
            alert("您还没有输入关键词！")
            return
        }
        restorePosition()
        getClanData()
    }

    function slideUpNotification() { if ($('#notification_zone').css('display') != 'none') $('#notification_zone').slideUp(250); }

    function getClanData(mode, id) {
        if (!mode) {
            var keyword = getQueryStr('keyword');
            if (!keyword) return
            $('#content tbody').empty()
            let result = toCompare(keyword, clanData),
                resultCount = result.length
            if (resultCount == 0) insertData()
            info('搜索', resultCount);
            for (let i in result) insertData(result, i, 'table')
            let backIcon = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
                '<path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>'
            slideUpNotification()
            $('.flipBtn').hide()
            $('#register-banner').prepend('<span class="btn flipBtn back">' + backIcon + '返回</span>');
            $('.flipBtn.back').show()
        } else if (mode == 'byId') {
            var id = id,
                detail

            if (isNaN(Number(id))) {
                detail = toCompare(id, clanData, 'private')
            } else {
                id = Number(id)
                if (id == 0 || id % 1 != 0) return
                detail = toCompare(id, clanData, 'id')
            }
            let len = detail.length;
            if (len == 0) return
            insertData(detail, 0, 'detail')
            document.title = '[' + detail[0].Tag + ']' + detail[0].Full + '——闪击战ID百科'
            if (detail[0].Desc) {
                $('meta[name="description"]').attr('content', detail[0].Desc)
            } else { $('meta[name="description"]').attr('content', '本网页旨在帮助国服玩家刊载军团简介。有意见或建议请加Q群：715200589') }
            showDetail()
        }
    }

    function getClanFamily(i) {
        var parentClan = i,
            result = toCompare(parentClan, clanData, 'mid'),
            family_branch = [];
        //resultCount = result.length
        //if (resultCount > 0) var clan_result_count = ''.concat('该军团有', (resultCount - 1), '个分团')
        $('#detail .content').append('<div class="clanFamily"><h3>相关军团</h3></div>')
        for (let i in result) { //寻找深层次军团族
            family_branch[i] = (toCompare(result[i].ID, clanData, 'mid')[0])
            if (family_branch[i] != undefined) {
                if (family_branch[i].ID == family_branch[i].MID) {
                    family_branch[i] = toCompare(-result[i].ID, clanData, 'mid')[0]
                }
            }
        }
        for (let i in family_branch) { if (!family_branch[i]) family_branch[i] = null }
        // family_branch.splice(0, 1)
        // console.log(result)
        console.log(family_branch)
        for (let i in result) insertData(result, i, 'mid', family_branch[i])
    }

    var filter = ["[", "]", "{", "}", "(", ")", "+", "*", "/"],
        filter_factor = '\\'
    for (let i = 0; i < filter.length; i++) filter[i] = filter_factor + filter[i]

    function toCompare(keyword, data, mode) {
        switch (keyword) {
            case !keyword:
                break;
            default:
                if (isNaN(Number(keyword))) {
                    for (let i in keyword) {
                        for (let j in filter) {
                            filtSpecial = new RegExp(filter[j], 'g')
                            keyword = keyword.replace(filtSpecial, filter[j])
                        }
                    }
                }
                var strictReg = new RegExp('^' + keyword + '$')
                break;
        }
        if (!(data instanceof Array)) return
        var len = data.length,
            arr = [],
            reg = new RegExp(keyword, 'i');
        switch (mode) {
            case 'id':
                for (let i = 0; i < len; i++) {
                    if (String(data[i].ID).match(strictReg)) arr.push(data[i])
                }
                break;
            case 'mid':
                for (let i = 0; i < len; i++) {
                    if (String(data[i].MID).match(strictReg)) arr.push(data[i])
                }
                break;
            case 'private':
                for (let i = 0; i < len; i++) {
                    if (String(data[i].Tag).match(strictReg)) arr.push(data[i])
                }
                break;
            case 'analysis':
                let z = 0;
                for (let i = 0; i < len; i++) {
                    if (String(data[i].Desc).length > 10 && !String(data[i].Desc).match(/编者/g) && String(data[i].Desc).match(/\d/g)) {
                        arr.push(data[i])
                        z++
                    }
                }
                // console.log(z)
                break;
            default:
                for (let i = 0; i < len; i++) {
                    if (String(data[i].Tag).match(reg) || String(data[i].Full).match(reg) || String(data[i].ID).match(strictReg || reg)) arr.push(data[i])
                }
                break;
        }
        return arr
    }

    function info(action, number) {
        $('.info .action').html(action);
        $('.info .total_entries').html(number);
    }
    var repeated_desc;

    function insertData(d, i, method, family_branch) {
        if (!d) {
            $('#content tbody').append('<tr><td>未搜索到相关内容，相关军团可能未被收录</td></tr>')
            return
        }
        i = i || 0
        var ID = d[i].ID,
            Tag = d[i].Tag,
            Full = d[i].Full,
            tableID;
        if (d[i].hasOwnProperty('Desc')) { var Desc = d[i].Desc } else Desc = '无'
        if (d[i].hasOwnProperty('MID')) var MID = d[i].MID
        if (d[i].hasOwnProperty('Logo')) var logoExt = d[i].Logo


        let insertHTML;
        switch (method) {
            case 'table':
                repeatedDesc(MID, Desc) //检测重复指令
                if (repeated_desc) Desc = repeated_desc
                if (Desc.length > 20) Desc = Desc.substr(0, 19) + '…'
                if (isNaN(ID)) tableID = Tag;
                else tableID = ID
                insertHTML = '<tr data-clan-id=' + tableID + '><td>' + ID +
                    '</td><td>' + '[' + Tag + '] ' + Full +
                    '</td><td>' + Desc + '</td></tr>'
                $('#content tbody').append(insertHTML) //插入页面
                repeated_desc = '' //清空变量
                break;

            case 'detail':
                var logoURL = 'img src="./img/assets/default_clan_logo.svg"',
                    imgDisplay = ''
                if (d[i].hasOwnProperty('Imgs')) var imgList = d[i].Imgs
                if (logoExt) logoURL = 'img src="img/clan/' + ID + '/0.' + fileExtList[logoExt] + '"'
                if (d[i].Date) var Estbl = processDate(d[i].Date);
                else Estbl = '--' //军团建立日期

                if (imgList) {
                    imgDisplay = '<div class="clan-img"><div class = "container">'
                    for (let i = 0; i < imgList.length; i++) {
                        imgDisplay += '<li><img src="./img/clan/' + ID + '/' + (i + 1) + '.' + fileExtList[imgList[i]] + '">' + '</li>'
                    }
                    imgDisplay += '</div></div>'
                        // $('#detail .content').append(imgDisplay)
                }
                repeatedDesc(MID, Desc) //检测重复指令
                if (repeated_desc) Desc = repeated_desc
                Desc = Desc.replace(/\n/g, '</p><p>')
                var clanBrief = '<div class="clanInfo"><div class="logo">' +
                    ' <' + logoURL + ' alt="[' + Tag + ']+' + Full + 'Logo"></div>' +
                    '<div class="info"><p class="tag">[' + Tag + '] ' + Full + '</p>' +
                    '<p>ID：' + ID + '</p>' +
                    '<p>创建日期：' + Estbl + '</p></div></div>',
                    clanIntro = '<div class="introduction"><h3>简介</h3>' +
                    '<p>' + Desc + '</p></div>';

                insertHTML = clanBrief + imgDisplay + clanIntro
                $('#detail .content').append(insertHTML) //插入页面
                if (MID) getClanFamily(MID) //检测是否有主团
                repeated_desc = '' //清空变量
                break;

            case 'mid': // 注入军团族群表
                let beginMark = '<div><div data-clan-id="' + ID + '">';
                var clan_cell = '<span class="tag">[' + Tag + '] ' + Full + '</span>' +
                    '<span class="idNumber">ID：' + ID + '</span>';
                if (family_branch) {}
                let endMark = '</div></div>'
                if (ID == getQueryStr('cid')) beginMark = '<div data-clan-id="' + ID + '"class ="current">'
                insertHTML = [beginMark, clan_cell, endMark].join('')
                $('#detail .clanFamily').append(insertHTML)
                break;
        }
        return
    }

    function removeInput(t) { $(t).val('') }

    function calcTableHeight() {
        tablePosition = $(window).height() - $('table thead').outerHeight() - $('#content #register-banner').outerHeight() - $('#head').outerHeight()
        $('table tbody').css({ 'height': tablePosition + 'px' })
        return tablePosition;
    }
    // 军团单独页面
    function getQueryStr(n) {
        let reg = new RegExp('(^|&)' + n + '=([^&]*)(&|$)'),
            result = window.location.search.substr(1).match(reg);
        if (!result) return
        let decodeR = decodeURIComponent(result[2]);
        if (!decodeR) return
        if (result != null) return decodeR
        return null
    }

    function restorePosition() {
        $('table tbody').animate({ scrollTop: 0 }, 500)
    }

    function showDetail() {
        $('#detail .inner').animate({ 'height': '100%' }, 450);
        $('#detail').fadeIn(400)
    }

    function processDate(rd) { //处理日期
        let rDate = rd; //源日期
        date = new Date();
        date.setFullYear(1900), date.setMonth(0), date.setDate(rDate - 1) //设置日期
        let processedDate = [date.getFullYear(), Number(date.getMonth() + 1), date.getDate()], //标准化日期
            result = processedDate.join('-') //连字符样式
        return result
    }

    function repeatedDesc(MID, Desc) {
        var reID = /\/repeat(\(([^)]*)\))?/
        if (Desc.match(reID)) {
            if (Desc.match(reID)[2]) MID = Desc.match(reID)[2]
            repeated_desc = toCompare(MID, clanData, 'id')
            return repeated_desc = Desc.replace(reID, repeated_desc[0].Desc)
        } else return null
    }

    var indexList = new Array(),
        recommendList = toCompare(undefined, clanData, 'analysis')
        // showRecomend()
    for (let i = 0; i < indexList.length; i++) {
        console.log(recommendList[indexList[i]])
    }

    function randomNum() {
        var rand = parseInt(Math.random() * recommendList.length + 1);
        for (let i; i < indexList.length; i++) { if (rand == indexList[i]) return false }
        indexList.push(rand)
    }

    function showRecomend() {
        do { randomNum() } while (indexList.length < 5)
    }
})