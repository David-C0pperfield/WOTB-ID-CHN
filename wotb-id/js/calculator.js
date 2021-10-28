$(function() {
    $("#toCalculate").on('click', function() {

        toCalculate()
    })
    $("#clear").on('click', function() {
        $('#current-wr').val(''),
            $('#btls').val(''),
            $('#expected-wr').val('');
    })
    $(document).on('keydown', function(e) {
        var key = e.which
        $('#current-wr').val(50)
        $('#btls').val(10)
        $('#expected-wr').val(60)
        if (key == 13) toCalculate()
    })

    function toCalculate() {
        var c_wr = Number($('#current-wr').val()) / 100,
            btls = Number($('#btls').val()),
            e_wr = Number($('#expected-wr').val()) / 100,
            temp = 0,
            btls_won = c_wr * btls;

        // do { alert("请输入数据！"); return } while (c_wr || btls || e_wr)
        for (var i = 0; temp < e_wr; i++) {
            temp = ((btls_won + i) / (btls + i)) * (1 - 0.5 * c_wr)
            console.log(temp)
            if (i > 10000) {
                console.log("overload")
                console.log(c_wr, e_wr, btls * c_wr, btls)
                return
            }
        }
        $('#result').html('理想情况下需要' + i + '场<br/>保守需要' + (i + 10) + '场')
    }
})