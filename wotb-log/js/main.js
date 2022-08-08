const reg = {
        datetime: /blitz-logs_(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
        platform: /Platform:\s*(.*)/,
        id_name: /"dbid":([0-9]+)\S*"name":"([^"]+)/,
        phone_num: /\{"mobile_num":"([0-9]+-[0-9]+)","updated_at":(\d+)\}/,
        gpu_model: /GetGPUModel\(\):\s*(.*)/,
        device_tags: /Device tags:\s*\[(.*)\]/,
        device_kind: /Device kind:\s*(.*)/,
        device_display: /Device display:\s*(.*)/,
        network_type: /Network type:\s*(.*)/,
        device_resolution: /Default Framebuffer size:\s*(.*)/,
        isDynamicResolutionSupported: /isDynamicResolutionSupported:\s*(.*)/,
        timezone: /Timezone:\s*(.*)/,
        app_ver: /Application version:\s*(.*)/,
        build_ver: /Build version:\s*(.*)/,
        locale_info: /InitializeLocalizations device locale:\s*(\S*), locale:\s*(\S*), game locale:\s*(\S*), sound locale:\s*(\S*),/
    },
    /**
     * 翻译词条
     */
    tr = {
        // 系统名
        'Android': '安卓',
        // 设备类型
        'Phone': '手机',
        'Desktop': '桌面',
        // 设备信息
        'manufacturer': '制造商',
        'maxFps': '最大帧率',
        // 网络情况
        'NETWORK_TYPE_WIFI': 'Wi-Fi',
        'NETWORK_TYPE_LTE': 'LTE',
        // 渠道
        'netease': '网易'
    }

/**
 * 使用词汇表中的条目替换翻译
 * @returns {str} 返回翻译后的字符串
 */
String.prototype.tr = function() {
    var str = this
    for (let i in tr) {
        let reg = new RegExp("\\b" + i, 'g')
        str = str.replace(reg, tr[i])
    }
    return str
}

$(function() {
    // 点击上传按键后搜索
    $('#submit').on('click', function() {
        processData()
    })

    /**
     * 获取上传的文件
     * @returns {object} 文件对象
     */
    function getFile() {
        var objFile = $('#upload_file').prop('files')

        if (!objFile.length) {
            alert("请上传文件");
            return
        } else {
            return objFile
        }
    }

    /**
     * 读取上传的文件
     * @param {*} f 文件
     */
    function readFile(f) {

        if (!f) return

        var file = f,
            log_text = '',
            reader = new FileReader(),
            filename = file[0].name


        reader.readAsText(file[0], 'utf-8')

        reader.onload = function() {
            //异步

            log_text = reader.result; // 读取文件内容}
            var analysis = new Analysis(filename, log_text)
            $('#raw_data').html(log_text.replace(/\n/g, '<br />'))

            analysis.demo('#processed_data .content')
        }

    }


    class Analysis {
        /**
         * 分析的文本作为对象，可选出关键词
         * @param {string} filename 文件名
         * @param {string} rawdata 源数据
         */
        constructor(filename, rawdata) {
            this.filename = filename
            this._rawdata = rawdata
        }

        /** 获取用户ID */
        getUid() {
            return "ID：" + this._rawdata.match(reg.id_name)[1]
        }

        /** 获取昵称 */
        getUsername() {
            return "昵称：" + this._rawdata.match(reg.id_name)[2]
        }

        getPhone() {
            try {
                var updated_time = new Date(Number(this._rawdata.match(reg.phone_num)[2]) * 1000) || ""
                return "手机号：" + this._rawdata.match(reg.phone_num)[1] + "（更新于：" + updated_time.toLocaleString() + "）"
            } catch (e) {
                return
            }
        }

        /** 获取平台 */
        getPlatform() {
            return "平台：" + this._rawdata.match(reg.platform)[1].tr()
        }

        /** 获取设备标签 */
        getDeviceTags() {
            return "设备信息：" + this._rawdata.match(reg.device_tags)[1].tr()
        }

        /** 获取设备类型 */
        getDeviceType() {
            return "设备类型：" + this._rawdata.match(reg.device_kind)[1].tr()
        }

        /** 获取网络类型 */
        getNetworkType() {
            return "网络：" + this._rawdata.match(reg.network_type)[1].tr()
        }

        /** 获取GPU型号 */
        getGPU() {
            return "GPU：" + this._rawdata.match(reg.gpu_model)[1]
        }

        /** 获取设备分辨率 */
        getResolution() {
            return "设备分辨率：" + this._rawdata.match(reg.device_resolution)[1]
        }

        /** 获取物理屏幕尺寸 */
        getDisplaySize() {
            return "屏幕尺寸：" + this._rawdata.match(reg.device_display)[1]
        }

        /** 获取应用版本 */
        getAppVer() {
            return "应用版本：" + this._rawdata.match(reg.app_ver)[1]
        }

        /** 获取编译版本 */
        getBuildVer() {
            return "编译版本：" + this._rawdata.match(reg.build_ver)[1]
        }

        /**
         * 获取本地化信息
         * @returns {str} 组合后的多个本地化信息
         */
        getLocaleInfo() {
            var device_lang = this._rawdata.match(reg.locale_info)[1],
                locale = this._rawdata.match(reg.locale_info)[2],
                game_lang = this._rawdata.match(reg.locale_info)[3],
                sound_lang = this._rawdata.match(reg.locale_info)[4]

            return "本地化信息：\n" +
                "设备语言：" + device_lang + "\n" +
                "本地化：" + locale + "\n" +
                "游戏语言：" + game_lang + "\n" +
                "系别成员语音：" + sound_lang + "\n"
        }

        /**
         * 输出字符串
         * @param {*} indicator dom指示器，填写$()里的内容
         */
        demo(indicator) {
            var processed = [
                this.getUid(), this.getUsername(), this.getPhone(),
                this.getPlatform(), this.getNetworkType(),
                this.getDeviceTags(), this.getDeviceType(),
                this.getDisplaySize(), this.getResolution(),
                this.getGPU(),
                this.getAppVer(), this.getBuildVer(),
                this.getLocaleInfo(), getDateTimeFromFile(this.filename)

            ]

            var output = processed.join('\n')

            $(indicator).val(output)
        }
    }
    /**
     * 格式化日志生成时间
     * @param {*} file 文件
     * @returns {str} 格式化后的时间
     */
    function getDateTimeFromFile(f_n) {
        var filename = f_n,
            unit = ["年", "月", "日", "时", "分", "秒"],
            output = ""

        for (let i = 1; i <= 6; i++) {
            output += filename.match(reg.datetime)[i] + unit[i - 1]
        }
        return output
    }


    $('#copy_btn').on('click', function() {
        $('#processed_data .content').select()
        document.execCommand('Copy')
            // alert('已复制')
    })

    /**
     * 主工作流
     */
    function processData() {
        /* f: file(Obj), r: result(DictObj) */
        var f = getFile()

        readFile(f)
    }
})