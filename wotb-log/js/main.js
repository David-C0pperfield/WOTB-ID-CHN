const reg = {
        datetime: /blitz-logs_(\d){4}(\d){2}(\d){2}(\d){2}(\d){2}(\d){2}/,
        platform: /Platform:\s*(.*)/,
        id_name: /\"dbid\":([0-9]+)\S*\"name\":\"(.*)\",/,
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
        locale_info: /InitializeLocalizations device locale:\s*(\S*), locale:\s*(\S*), game locale:\s*(\S*), sound locale:\s*(\S*)/
    },
    tr = {
        'Android': '安卓',

        'Phone': '手机',
        'Desktop': '桌面',

        'manufacturer': '制造商',
        'maxFps': '最大帧率',

        'NETWORK_TYPE_WIFI': 'Wi-Fi',
        'NETWORK_TYPE_LTE': 'LTE',

        'netease': '网易'
    }
String.prototype.tr = function() {
    var str = this
    for (let i in tr) {
        let reg = new RegExp("\\b" + i, 'g')
        str = str.replace(reg, tr[i])
    }
    return str
}

$(function() {

    $('#submit').on('click', function() {
        processDate()
    })

    function getFile() {
        var objFile = $('#upload_file').prop('files')

        if (!objFile.length) {
            alert("请上传文件");
            return
        } else return objFile
    }

    function readFile(f) {
        var file = f,
            log_text = '',
            reader = new FileReader()

        reader.readAsText(file[0], 'utf-8')

        reader.onload = function() {
            //异步
            log_text = reader.result; // 读取文件内容}
            var analysis = new Analysis(log_text)
            processed = [
                analysis.getUid(), analysis.getUsername(),
                analysis.getPlatform(), analysis.getNetworkType(),
                analysis.getDeviceTags(), analysis.getDeviceType(),
                analysis.getDisplaySize(), analysis.getResolution(),
                analysis.getGPU(),
                analysis.getAppVer(), analysis.getBuildVer(),
                analysis.getLocaleInfo()
            ]
            output = processed
            console.log(output)

        }

    }

    class Analysis {
        constructor(rawdata) {
            this._rawdata = rawdata
        }

        getUid() {
            return "ID：" + this._rawdata.match(reg.id_name)[1]
        }

        getUsername() {
            return "昵称：" + this._rawdata.match(reg.id_name)[2]
        }

        getPlatform() {
            return "平台：" + this._rawdata.match(reg.platform)[1].tr()
        }

        getDeviceTags() {
            return "设备信息：" + this._rawdata.match(reg.device_tags)[1].tr()
        }

        getDeviceType() {
            return "设备类型：" + this._rawdata.match(reg.device_kind)[1].tr()
        }


        getNetworkType() {
            return "网络：" + this._rawdata.match(reg.network_type)[1].tr()
        }

        getGPU() {
            return "GPU：" + this._rawdata.match(reg.gpu_model)[1]
        }

        getResolution() {
            return "设备分辨率：" + this._rawdata.match(reg.device_resolution)[1]
        }

        getDisplaySize() {
            return "屏幕尺寸：" + this._rawdata.match(reg.device_display)[1]
        }

        getAppVer() {
            return "应用版本：" + this._rawdata.match(reg.app_ver)[1]
        }
        getBuildVer() {
            return "编译版本：" + this._rawdata.match(reg.build_ver)[1]
        }
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

    }

    function process_text(t) {
        console.log()
        platform = t.match(reg.platform)[1]
        output = []
    }

    // Main Stream
    function processDate() {
        /* f: file(Obj), r: result(DictObj) */
        var f = getFile()
        var filename = f[0].name

        readFile(f)
    }
})