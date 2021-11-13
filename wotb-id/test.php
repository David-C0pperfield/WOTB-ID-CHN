<!DOCTYPE html>
<html>

<head>
    <title>闪击战ID大百科</title>
    <meta charset="utf-8">
    <meta name="author" content="大兴安岭、科波菲尔">
    <meta name="description" content="本网页旨在帮助国服玩家刊载军团简介。有意见或建议请加Q群：715200589">
    <meta name="keyword" content="WOT,WOTB,坦克世界闪击战,军团通信录，军团名册">
    <meta http-equive="Content-Type" content="text/html;charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
    <link rel="stylesheet" href="css/main.min.css">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <link rel="apple-touch-icon" href="icon.png">
    <script src="js/jquery-3.5.1.min.js"></script>
</head>

<body>
    <div class="main">
        <div id="head">
            <div id="searchbar">
                <div id="inner_s_bar">
                    <input class="textbox" id="searchstr" type="text" size="10" placeholder="请输入要查找的军团ID、标签、名称" name="searchstr">
                    <div class="searchIcon" id="search_btn">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                        <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                    </svg>
                    </div>

                    <div class="btn resetBtn">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div id="notification_zone">
                <div class="wrap">
                    <article id="part1">
                        <?
                        $fname = "./notif_intro.txt";
                        $handle = fopen($fname,"r");
                        $content = fread($handle,filesize($fname));
                        echo $content;
                        fclose($handle);
                       ?>
                        
                    </article>
                    <hr>
                    <article id="part2">
                        <section id="acknowledgement">
                            <h3>特别感谢</h3>
                            <p><b>TPG军团</b><i>(ID: 7341 / 12257)</i></p>
                            <p>以及<b>SAKI</b><b>氪撸勃</b>和<b>ARF团副 上官雨蝶</b>同志</p>
                        </section>
                        <section id="links">
                            <h3>推广</h3>
                            <p><a href="http://wotinspector.com/zh-hans/">WoT(b)装甲地图检视器官网</a></p>
                            <p><a href="http://wotb.163.com">坦克世界闪击战国服官网</a></p>
                        </section>
                    </article>
                </div>
                <div class="toCollapse">
                    <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" class="bi bi-chevron-compact-up" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
                </svg>
                </div>
            </div>
        </div>
    </div>
    <div id="content">
        <div id="register-banner">
            <span class="btn flipBtn prev">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg><span>前20</span>
            </span>
            <span class="info">共<span class="action">收录</span><span class="total_entries"></span>个军团</span>
            <span class="btn flipBtn next"><span>后20</span>
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </span>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>军团名</th>
                    <th>简介</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>加载中…</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="detail">
        <div class="wrap">
            <div class="inner">
                <div class="window">
                    <div class="dismissBtn btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>
                    <div class="content">
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
<!-- <script src="js/main.min.js"></script> -->
<script src="js/main.js"></script>
<script type="text/javascript">
    $(function() {
        $('#notification_zone #links').append(unescape("%3Cspan id='cnzz_stat_icon_1279674708'%3E%3C/span%3E%3Cscript src='https://s4.cnzz.com/z_stat.php%3Fid%3D1279674708' type='text/javascript'%3E%3C/script%3E"));
    })
</script>

</html>